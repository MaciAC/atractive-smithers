import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Get post statistics (likes and comments per post date)
    const stats = await query(`
      SELECT
        DATE_TRUNC('day', p.date) as day,
        SUM(p.likes) as total_likes,
        COUNT(p.id) as post_count,
        SUM(p.total_comments) as total_comments
      FROM
        posts p
      GROUP BY
        DATE_TRUNC('day', p.date)
      ORDER BY
        day ASC
    `);

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}