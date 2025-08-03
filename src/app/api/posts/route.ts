import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/db';
import { LocalFileService } from '@/utils/fileService';
import { prisma } from '@/lib/db';

async function getLocalFileUrl(key: string): Promise<string> {
  // For local files, we can directly return the URL
  // Check if file exists (optional - for debugging)
  const exists = await LocalFileService.fileExists(key);
  if (!exists) {
    console.warn(`File not found locally: ${key}`);
  }
  
  return LocalFileService.getFileUrl(key);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeFiles = searchParams.get('includeFiles') === 'true';

    if (includeFiles) {
      // Get posts with multimedia and convert URLs to local paths
      const posts = await prisma.post.findMany({
        where: {
          multimedia: {
            some: {} // Only posts that have at least one multimedia item
          }
        },
        include: {
          multimedia: {
            orderBy: { display_order: 'asc' }
          }
        },
        orderBy: { date: 'desc' }
      });

      const postsWithLocalUrls = await Promise.all(
        posts.map(async (post) => ({
          ...post,
          multimedia: await Promise.all(
            post.multimedia.map(async (media) => ({
              ...media,
              url: await getLocalFileUrl(media.url)
            }))
          )
        }))
      );

      return NextResponse.json({ posts: postsWithLocalUrls });
    } else {
      // Return posts without file URLs (original behavior)
      const posts = await getAllPosts();
      return NextResponse.json({ posts });
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}