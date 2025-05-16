import { NextRequest, NextResponse } from 'next/server';
import { searchPosts, searchComments } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'posts';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || (type === 'posts' ? '36' : '20'));
    const sortBy = searchParams.get('sortBy') || (type === 'posts' ? 'date' : 'likes');
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    if (type === 'posts') {
      const result = await searchPosts({
        searchQuery: query,
        sortBy: sortBy as 'date' | 'date_reverse' | 'likes' | 'comments',
        startDate,
        endDate,
        page,
        limit
      });

      return NextResponse.json(result);
    } else if (type === 'comments') {
      const result = await searchComments({
        searchQuery: query,
        sortBy: sortBy as 'likes' | 'date',
        page,
        limit
      });

      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Invalid search type' }, { status: 400 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}