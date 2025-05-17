import { NextRequest, NextResponse } from 'next/server';
import { getPost } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { urlCache } from '@/utils/urlCache';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
});

async function getPresignedUrl(key: string) {
  // Check cache first
  const cachedUrl = urlCache.get(key);
  if (cachedUrl) return cachedUrl;

  // Generate new presigned URL
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 24 * 60 * 60 }); // 24 hours
  urlCache.set(key, url);
  return url;
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

    // If includeFiles is requested, get presigned URLs for multimedia
    const searchParams = request.nextUrl.searchParams;
    const includeFiles = searchParams.get('includeFiles') === 'true';

    if (includeFiles && post.post.multimedia) {
      const multimediaWithUrls = await Promise.all(
        post.post.multimedia.map(async (media) => ({
          ...media,
          url: await getPresignedUrl(media.url)
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