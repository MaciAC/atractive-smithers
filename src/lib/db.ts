import { Pool } from 'pg';

// Create a singleton database connection pool
const globalPool = global as unknown as { pool: Pool | undefined };

const getPool = (): Pool => {
  if (!globalPool.pool) {
    globalPool.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : { rejectUnauthorized: false }, // Also allow self-signed certificates in development
    });
  }
  return globalPool.pool;
};

export async function query<T = unknown>(text: string, params: unknown[] = []): Promise<T[]> {
  const pool = getPool();
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result.rows;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

export async function getUser(userId: string) {
  return (await query<User>('SELECT * FROM users WHERE id = $1', [userId]))[0];
}

export async function getPost(postId: string) {
  const result = await query<{
    id: string;
    date: Date;
    likes: number;
    caption: string;
    total_comments: number;
    multimedia: Multimedia[];
    comments: Comment[];
  }>(`
    WITH post_data AS (
      SELECT p.*,
             COUNT(DISTINCT c.id) as comment_count,
             COALESCE(
               jsonb_agg(
                 jsonb_build_object(
                   'id', m.id,
                   'type', m.type,
                   'url', m.url,
                   'width', m.width,
                   'height', m.height,
                   'duration', m.duration,
                   'display_order', m.display_order
                 ) ORDER BY m.display_order
               ) FILTER (WHERE m.id IS NOT NULL),
               '[]'::jsonb
             ) as multimedia
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN multimedia m ON p.id = m.post_id
      WHERE p.id = $1
      GROUP BY p.id
    ),
    comments_data AS (
      SELECT
        c.id,
        c.post_id,
        c.text,
        c.likes,
        c.parent_comment_id,
        c.created_at,
        u.id as user_id,
        u.username,
        u.is_verified,
        u.profile_pic_url
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
    )
    SELECT
      pd.id,
      pd.date,
      pd.likes,
      pd.caption,
      pd.comment_count as total_comments,
      pd.multimedia,
      COALESCE(
        jsonb_agg(
          CASE
            WHEN cd.id IS NOT NULL THEN
              jsonb_build_object(
                'id', cd.id,
                'post_id', cd.post_id,
                'user_id', cd.user_id,
                'text', cd.text,
                'likes', cd.likes,
                'parent_comment_id', cd.parent_comment_id,
                'created_at', cd.created_at,
                'owner', jsonb_build_object(
                  'id', cd.user_id,
                  'username', cd.username,
                  'is_verified', cd.is_verified,
                  'profile_pic_url', cd.profile_pic_url
                )
              )
            ELSE NULL
          END
        ) FILTER (WHERE cd.id IS NOT NULL),
        '[]'::jsonb
      ) as comments
    FROM post_data pd
    LEFT JOIN comments_data cd ON true
    GROUP BY pd.id, pd.date, pd.likes, pd.caption, pd.comment_count, pd.multimedia
  `, [postId]);

  if (!result[0]) return null;

  // Process comments to organize them into threads
  const postData = result[0];
  const comments = postData.comments || [];
  const topLevelComments = comments.filter((c: Comment) => !c.parent_comment_id);

  // Add thread comments to their parent comments
  topLevelComments.forEach((comment: Comment) => {
    comment.thread_comments = comments.filter((c: Comment) => c.parent_comment_id === comment.id);
  });

  // Return in the expected structure
  return {
    post: {
      id: postData.id,
      date: postData.date,
      likes: postData.likes,
      caption: postData.caption,
      total_comments: postData.total_comments,
      multimedia: postData.multimedia || [],
      comments: topLevelComments
    },
    comments: topLevelComments
  };
}

export async function getPostComments(postId: string) {
  // Get top-level comments first
  const comments = await query<Comment & { parent_comment_id: number | null }>(
    'SELECT * FROM comments WHERE post_id = $1 AND parent_comment_id IS NULL ORDER BY likes DESC',
    [postId]
  );

  // Get thread comments for these parent comments
  for (const comment of comments) {
    comment.thread_comments = await query<Comment>(
      'SELECT * FROM comments WHERE post_id = $1 AND parent_comment_id = $2 ORDER BY likes DESC',
      [postId, comment.id]
    );
  }

  return comments;
}

export async function getAllPosts() {
  return await query<Post>('SELECT * FROM posts ORDER BY date DESC');
}

export async function searchPosts({
  searchQuery = '',
  sortBy = 'date',
  startDate = '',
  endDate = '',
  page = 1,
  limit = 36
}: {
  searchQuery?: string;
  sortBy?: 'date' | 'date_reverse' | 'likes' | 'comments';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build the base query
  let sql = `
    WITH post_data AS (
      SELECT
        p.*,
        COUNT(DISTINCT c.id) as comment_count,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'id', m.id,
              'type', m.type,
              'url', m.url,
              'width', m.width,
              'height', m.height,
              'duration', m.duration,
              'display_order', m.display_order
            ) ORDER BY m.display_order
          ) FILTER (WHERE m.id IS NOT NULL),
          '[]'::jsonb
        ) as multimedia
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN multimedia m ON p.id = m.post_id
    `;

  // Add WHERE conditions
  const whereConditions = [];
  if (searchQuery) {
    whereConditions.push(`
      (p.caption ILIKE $${paramIndex} OR
       p.id ILIKE $${paramIndex} OR
       EXISTS (
         SELECT 1
         FROM comments c2
         JOIN users u2 ON c2.user_id = u2.id
         WHERE c2.post_id = p.id
         AND (c2.text ILIKE $${paramIndex} OR u2.username ILIKE $${paramIndex})
       ))
    `);
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  if (startDate) {
    whereConditions.push(`p.date >= $${paramIndex}`);
    params.push(startDate);
    paramIndex++;
  }

  if (endDate) {
    whereConditions.push(`p.date <= $${paramIndex}`);
    params.push(endDate);
    paramIndex++;
  }

  if (whereConditions.length > 0) {
    sql += ' WHERE ' + whereConditions.join(' AND ');
  }

  sql += ' GROUP BY p.id)';

  // Select from the CTE
  sql += `
    SELECT * FROM post_data
  `;

  // Add ordering
  switch (sortBy) {
    case 'likes':
      sql += ' ORDER BY likes DESC';
      break;
    case 'comments':
      sql += ' ORDER BY comment_count DESC';
      break;
    case 'date_reverse':
      sql += ' ORDER BY date ASC';
      break;
    case 'date':
    default:
      sql += ' ORDER BY date DESC';
      break;
  }

  // Add pagination
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  // Get total count
  const countSql = `
    WITH post_data AS (
      SELECT p.*
      FROM posts p
      ${whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : ''}
    )
    SELECT COUNT(*) as total FROM post_data
  `;

  const [posts, totalResult] = await Promise.all([
    query<Post>(sql, params),
    query<{ total: number }>(countSql, params.slice(0, -2))
  ]);

  return {
    posts,
    total: totalResult[0]?.total || 0,
    page,
    limit,
    hasMore: offset + posts.length < (totalResult[0]?.total || 0)
  };
}

export async function searchComments({
  searchQuery = '',
  sortBy = 'likes',
  page = 1,
  limit = 20
}: {
  searchQuery?: string;
  sortBy?: 'likes' | 'date' | 'date_reverse';
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  const params: unknown[] = [];
  let paramIndex = 1;

  // Build the base query with all necessary joins and data in one go
  let sql = `
    WITH comment_data AS (
      SELECT
        c.*,
        p.caption as post_caption,
        u.username,
        u.is_verified,
        u.profile_pic_url,
        COUNT(c2.id) as thread_comment_count
      FROM comments c
      JOIN posts p ON c.post_id = p.id
      JOIN users u ON c.user_id = u.id
      LEFT JOIN comments c2 ON c2.parent_comment_id = c.id
    `;

  // Add WHERE conditions
  const whereConditions = [];
  if (searchQuery) {
    whereConditions.push(`
      (c.text ILIKE $${paramIndex})
    `);
    params.push(`%${searchQuery}%`);
    paramIndex++;
  }

  if (whereConditions.length > 0) {
    sql += ' WHERE ' + whereConditions.join(' AND ');
  }

  sql += ' GROUP BY c.id, p.caption, u.username, u.is_verified, u.profile_pic_url)';

  // Main query selecting from the CTE
  sql += `
    SELECT
      cd.*,
      jsonb_build_object(
        'id', cd.user_id,
        'username', cd.username,
        'is_verified', cd.is_verified,
        'profile_pic_url', cd.profile_pic_url
      ) as owner
    FROM comment_data cd
  `;

  // Add ordering
  switch (sortBy) {
    case 'likes':
      sql += ' ORDER BY cd.likes DESC';
      break;
    case 'date_reverse':
      sql += ' ORDER BY cd.created_at ASC';
      break;
    case 'date':
    default:
      sql += ' ORDER BY cd.created_at DESC';
      break;
  }

  // Add pagination
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  // Get total count
  const countSql = `
    SELECT COUNT(DISTINCT c.id) as total
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    JOIN users u ON c.user_id = u.id
    ${whereConditions.length > 0 ? ' WHERE ' + whereConditions.join(' AND ') : ''}
  `;

  const [comments, totalResult] = await Promise.all([
    query<Comment>(sql, params),
    query<{ total: number }>(countSql, params.slice(0, -2))
  ]);

  // Get thread comments for each comment in a single query
  const commentIds = comments.map(c => c.id);
  if (commentIds.length > 0) {
    const threadComments = await query<Comment>(
      `SELECT c.*, u.username, u.is_verified, u.profile_pic_url
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.parent_comment_id = ANY($1)
       ORDER BY c.likes DESC`,
      [commentIds]
    );

    // Organize thread comments by parent comment
    const threadCommentsByParent = threadComments.reduce((acc, comment) => {
      if (!acc[comment.parent_comment_id!]) {
        acc[comment.parent_comment_id!] = [];
      }
      acc[comment.parent_comment_id!].push(comment);
      return acc;
    }, {} as Record<number, Comment[]>);

    // Add thread comments to their parent comments
    comments.forEach(comment => {
      comment.thread_comments = threadCommentsByParent[comment.id] || [];
    });
  }

  return {
    comments,
    total: totalResult[0]?.total || 0,
    page,
    limit,
    hasMore: offset + comments.length < (totalResult[0]?.total || 0)
  };
}

// Types matching the database schema
export interface User {
  id: string;
  username: string;
  is_verified: boolean;
  profile_pic_url: string | null;
}

export type Multimedia = {
  id: number;
  post_id: string;
  type: 'image' | 'video';
  url: string;
  width: number | null;
  height: number | null;
  duration: number | null;
  display_order: number;
  created_at: Date;
};

export type Post = {
  id: string;
  date: Date;
  likes: number;
  caption: string;
  total_comments: number;
  multimedia: Multimedia[];
  comments: Comment[];
};

export interface Comment {
  id: number;
  post_id: string;
  user_id: string;
  text: string;
  likes: number;
  parent_comment_id: number | null;
  created_at: Date;
  owner?: User;
  thread_comments?: Comment[];
}