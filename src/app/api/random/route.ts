import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
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

    // Get local file URL for the multimedia
    const localFileUrl = await getLocalFileUrl(randomMultimedia.url);

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
        url: localFileUrl
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