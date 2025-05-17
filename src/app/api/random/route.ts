import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { urlCache } from '@/utils/urlCache';

const s3Client = new S3Client({
  region: process.env.R2_REGION || 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

async function getPresignedUrl(key: string): Promise<string> {
  // Check cache first
  const cachedUrl = urlCache.get(key);
  if (cachedUrl) {
    return cachedUrl;
  }

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  // Generate a presigned URL that expires in 24 hours
  const url = await getSignedUrl(s3Client, command, { expiresIn: 24 * 60 * 60 });

  // Cache the URL
  urlCache.set(key, url);

  return url;
}

export async function GET() {
  try {
    // Get a random multimedia element
    const multimediaCount = await prisma.multimedia.count();
    const randomMultimediaIndex = Math.floor(Math.random() * multimediaCount);
    const randomMultimedia = await prisma.multimedia.findFirst({
      skip: randomMultimediaIndex,
      take: 1,
    });

    if (!randomMultimedia) {
      return NextResponse.json({ error: 'No multimedia found' }, { status: 404 });
    }

    // Get presigned URL for the multimedia
    const presignedUrl = await getPresignedUrl(randomMultimedia.url);

    // Get 10 random comments
    const commentsCount = await prisma.comment.count({
      where: {
        text: { not: '' } // Exclude empty comments
      }
    });
    const randomComments = await prisma.comment.findMany({
      where: {
        text: { not: '' } // Exclude empty comments
      },
      include: {
        user: true
      },
      skip: Math.floor(Math.random() * Math.max(0, commentsCount - 10)),
      take: 10,
    });

    return NextResponse.json({
      multimedia: {
        ...randomMultimedia,
        url: presignedUrl
      },
      comments: randomComments.map(comment => ({
        text: comment.text,
        likes: comment.likes,
        owner: {
          id: comment.user.id,
          username: comment.user.username,
          is_verified: comment.user.is_verified,
          profile_pic_url: comment.user.profile_pic_url
        }
      }))
    });
  } catch (error) {
    console.error('Error in random route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}