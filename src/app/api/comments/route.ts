import { NextResponse } from 'next/server';
import { searchComments, query, getUser } from '@/lib/db';
import { Comment } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'likes';

    // Get comments with search
    let comments: Comment[];
    if (searchQuery) {
      const result = await searchComments({ searchQuery });
      comments = result.comments;
    } else {
      // Get all comments, limit to 100 for performance
      comments = await query(
        `SELECT c.*, p.caption
         FROM comments c
         JOIN posts p ON c.post_id = p.id
         ORDER BY ${sortBy === 'date' ? 'c.created_at' : 'c.likes'} DESC
         LIMIT 100`
      );
    }

    // Add user information to each comment
    for (const comment of comments) {
      comment.owner = await getUser(comment.user_id);
    }

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}