import { NextResponse } from 'next/server';
import { searchComments, query, getUser } from '@/lib/db';
import { Comment } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'likes';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get comments with search and pagination
    const result = await searchComments({
      searchQuery,
      sortBy: sortBy as 'likes' | 'date' | 'date_reverse',
      page,
      limit
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}