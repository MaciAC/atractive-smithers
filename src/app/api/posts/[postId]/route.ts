import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/db';
import { LocalFileService } from '@/utils/fileService';

async function getLocalFileUrl(key: string): Promise<string> {
  // For local files, we can directly return the URL
  // Check if file exists (optional - for debugging)
  const exists = await LocalFileService.fileExists(key);
  if (!exists) {
    console.warn(`File not found locally: ${key}`);
  }
  
  return LocalFileService.getFileUrl(key);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;
    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const post = await getPost(postId);

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // If includeFiles is requested, get local file URLs for multimedia
    const searchParams = request.nextUrl.searchParams;
    const includeFiles = searchParams.get('includeFiles') === 'true';

    if (includeFiles && post.post.multimedia) {
      const multimediaWithUrls = await Promise.all(
        post.post.multimedia.map(async (media) => ({
          ...media,
          url: await getLocalFileUrl(media.url)
        }))
      );
      post.post.multimedia = multimediaWithUrls;
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}