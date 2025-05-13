import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
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

export async function GET(
  request: Request,
  context: { params: Promise<{ memeId: string }> }
) {
  try {
    const { memeId } = await context.params;
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      Prefix: `${memeId}/`,
    });

    const response = await s3Client.send(command);
    const files = await Promise.all(
      (response.Contents || []).map(async (file) => {
        if (!file.Key) return null;
        return {
          key: file.Key,
          url: await getPresignedUrl(file.Key),
        };
      })
    );

    const validFiles = files.filter((file): file is { key: string; url: string } => file !== null);

    return NextResponse.json({ files: validFiles });
  } catch (error) {
    console.error('Error listing files from R2:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}