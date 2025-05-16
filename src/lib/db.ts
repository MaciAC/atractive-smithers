import { PrismaClient } from '@prisma/client';

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
  limit = 20
}: {
  searchQuery?: string;
  sortBy?: 'likes' | 'date' | 'date_reverse';
  page?: number;
  limit?: number;
}) {
  const where = searchQuery ? {
    OR: [
      { text: { contains: searchQuery, mode: 'insensitive' as const } },
      { user: { username: { contains: searchQuery, mode: 'insensitive' as const } } }
    ]
  } : {};

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
        ...(sortBy === 'date_reverse' && { created_at: 'asc' }),
        ...(sortBy === 'date' && { created_at: 'desc' })
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