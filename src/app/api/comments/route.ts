import { NextResponse } from 'next/server';
import { searchComments } from '@/lib/db';

type VerifiedFilter = 'any' | 'verified' | 'not_verified';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q') || '';
    const sortBy = searchParams.get('sort') || 'likes';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const verifiedFilter = (searchParams.get('verified') || 'any') as VerifiedFilter;

    // Convert frontend sort options to database sort options
    const dbSortBy = (() => {
      switch (sortBy) {
        case 'newest':
          return 'date';
        case 'oldest':
          return 'date_reverse';
        case 'shortest':
          return 'length_asc';
        case 'longest':
          return 'length_desc';
        default:
          return 'likes';
      }
    })();

    // Get comments with search and pagination
    const result = await searchComments({
      searchQuery,
      sortBy: dbSortBy,
      page,
      limit,
      verifiedFilter
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