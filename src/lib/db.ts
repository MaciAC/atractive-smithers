import { PrismaClient, Prisma } from '@prisma/client';

// Create a singleton Prisma client instance
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export types
export type Post = {
  id: string;
  date: Date;
  likes: number;
  caption: string | null;
  total_comments: number;
  created_at: Date;
  multimedia?: Multimedia[];
  comments?: Comment[];
};

export type Comment = {
  id: number;
  post_id: string;
  user_id: string;
  text: string;
  likes: number;
  parent_comment_id: number | null;
  created_at: Date;
  user?: User;
  thread_comments?: Comment[];
};

export type User = {
  id: string;
  username: string;
  is_verified: boolean;
  profile_pic_url: string | null;
  created_at: Date;
};

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

export async function getUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId }
  });
}

export async function getPost(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      multimedia: {
        orderBy: { display_order: 'asc' }
      },
      comments: {
        where: { parent_comment_id: null },
        include: {
          user: true,
          thread_comments: {
            include: {
              user: true
            },
            orderBy: { likes: 'desc' }
          }
        },
        orderBy: { likes: 'desc' }
      }
    }
  });

  if (!post) return null;

  return {
    post: {
      id: post.id,
      date: post.date,
      likes: post.likes,
      caption: post.caption || '',
      total_comments: post.total_comments,
      multimedia: post.multimedia,
      comments: post.comments
    },
    comments: post.comments
  };
}

export async function getPostComments(postId: string) {
  return await prisma.comment.findMany({
    where: {
      post_id: postId,
      parent_comment_id: null
    },
    include: {
      user: true,
      thread_comments: {
        include: {
          user: true
        },
        orderBy: { likes: 'desc' }
      }
    },
    orderBy: { likes: 'desc' }
  });
}

export async function getAllPosts() {
  return await prisma.post.findMany({
    where: {
      multimedia: {
        some: {} // Only posts that have at least one multimedia item
      }
    },
    orderBy: { date: 'desc' }
  });
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
  const where = {
    AND: [
      { multimedia: { some: {} } }, // Only posts that have at least one multimedia item
      searchQuery ? {
        OR: [
          { caption: { contains: searchQuery, mode: 'insensitive' as const } },
          { id: { contains: searchQuery, mode: 'insensitive' as const } },
          {
            comments: {
              some: {
                OR: [
                  { text: { contains: searchQuery, mode: 'insensitive' as const } },
                  { user: { username: { contains: searchQuery, mode: 'insensitive' as const } } }
                ]
              }
            }
          }
        ]
      } : {},
      startDate ? { date: { gte: new Date(startDate) } } : {},
      endDate ? { date: { lte: new Date(endDate) } } : {}
    ]
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        multimedia: {
          orderBy: { display_order: 'asc' }
        },
        comments: {
          include: {
            user: true,
            thread_comments: {
              include: {
                user: true
              },
              orderBy: { likes: 'desc' }
            }
          },
          orderBy: { likes: 'desc' }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: {
        ...(sortBy === 'likes' && { likes: 'desc' }),
        ...(sortBy === 'comments' && { total_comments: 'desc' }),
        ...(sortBy === 'date_reverse' && { date: 'asc' }),
        ...(sortBy === 'date' && { date: 'desc' })
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.post.count({ where })
  ]);

  return {
    posts,
    total,
    page,
    limit,
    hasMore: (page - 1) * limit + posts.length < total
  };
}

export async function searchComments({
  searchQuery = '',
  sortBy = 'likes',
  page = 1,
  limit = 20,
  verifiedFilter = 'any'
}: {
  searchQuery?: string;
  sortBy?: 'likes' | 'date' | 'date_reverse' | 'length_asc' | 'length_desc';
  page?: number;
  limit?: number;
  verifiedFilter?: 'any' | 'verified' | 'not_verified';
}) {
  const where = {
    AND: [
      { text: { not: '' } },
      searchQuery ? {
        OR: [
          { text: { contains: searchQuery, mode: 'insensitive' as const } },
          { user: { username: { contains: searchQuery, mode: 'insensitive' as const } } }
        ]
      } : {},
      verifiedFilter !== 'any' ? {
        user: {
          is_verified: verifiedFilter === 'verified'
        }
      } : {}
    ]
  };

  // For length sorting, we need to use a raw SQL query
  if (sortBy === 'length_asc' || sortBy === 'length_desc') {
    const conditions = [
      Prisma.sql`c.text != ''`
    ];

    if (searchQuery) {
      conditions.push(Prisma.sql`(LOWER(c.text) LIKE LOWER(${`%${searchQuery}%`}) OR LOWER(u.username) LIKE LOWER(${`%${searchQuery}%`}))`);
    }

    if (verifiedFilter !== 'any') {
      conditions.push(Prisma.sql`u.is_verified = ${verifiedFilter === 'verified'}`);
    }

    const whereClause = Prisma.sql`WHERE ${conditions.reduce((acc, condition, i) =>
      i === 0 ? condition : Prisma.sql`${acc} AND ${condition}`
    )}`;

    const [comments, total] = await Promise.all([
      prisma.$queryRaw`
        SELECT
          c.id, c.post_id, c.user_id, c.text, c.likes, c.parent_comment_id, c.created_at,
          u.id as user_id, u.username, u.is_verified, u.profile_pic_url,
          p.caption as post_caption
        FROM "Comment" c
        LEFT JOIN "User" u ON c.user_id = u.id
        LEFT JOIN "Post" p ON c.post_id = p.id
        ${whereClause}
        ORDER BY LENGTH(c.text) ${sortBy === 'length_asc' ? Prisma.sql`ASC` : Prisma.sql`DESC`}
        LIMIT ${limit}
        OFFSET ${(page - 1) * limit}
      `,
      prisma.comment.count({ where })
    ]);

    // Transform the raw results to match the expected format
    const formattedComments = (comments as Comment[]).map(comment => ({
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      text: comment.text,
      likes: comment.likes,
      parent_comment_id: comment.parent_comment_id,
      created_at: comment.created_at,
      user: {
        id: comment.user?.id,
        username: comment.user?.username,
        is_verified: comment.user?.is_verified,
        profile_pic_url: comment.user?.profile_pic_url
      },
      thread_comments: [] // We'll need to fetch these separately if needed
    }));

    return {
      comments: formattedComments,
      total,
      page,
      limit,
      hasMore: (page - 1) * limit + formattedComments.length < total
    };
  }

  // For other sorting options, use the regular Prisma query
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        user: true,
        post: {
          select: { caption: true }
        },
        thread_comments: {
          include: {
            user: true
          },
          orderBy: { likes: 'desc' }
        }
      },
      orderBy: {
        ...(sortBy === 'likes' && { likes: 'desc' }),
        ...(sortBy === 'date' && { created_at: 'desc' }),
        ...(sortBy === 'date_reverse' && { created_at: 'asc' })
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.comment.count({ where })
  ]);

  return {
    comments,
    total,
    page,
    limit,
    hasMore: (page - 1) * limit + comments.length < total
  };
}

// Types matching the database schema
export type { Prisma as PrismaTypes } from '@prisma/client';