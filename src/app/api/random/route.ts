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
    // Get 1 random video
    const videoCount = await prisma.multimedia.count({
      where: { type: 'video' }
    });
    
    let randomVideo = null;
    if (videoCount > 0) {
      const randomVideoIndex = Math.floor(Math.random() * videoCount);
      randomVideo = await prisma.multimedia.findFirst({
        where: { type: 'video' },
        skip: randomVideoIndex,
        take: 1,
      });
    }

    // Get 5 random images
    const imageCount = await prisma.multimedia.count({
      where: { type: 'image' }
    });
    
    const randomImages = [];
    if (imageCount > 0) {
      // Get 5 random images with different skip values to ensure variety
      const imageIndices = [];
      for (let i = 0; i < Math.min(5, imageCount); i++) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * imageCount);
        } while (imageIndices.includes(randomIndex));
        imageIndices.push(randomIndex);
      }

      for (const index of imageIndices) {
        const image = await prisma.multimedia.findFirst({
          where: { type: 'image' },
          skip: index,
          take: 1,
        });
        if (image) {
          randomImages.push(image);
        }
      }
    }

    // Combine video and images
    const allMultimedia = [];
    allMultimedia.push(...randomImages);
    if (randomVideo) {
      allMultimedia.push(randomVideo);
    }
    
    if (allMultimedia.length === 0) {
      return NextResponse.json({ error: 'No multimedia found' }, { status: 404 });
    }

    // Get local file URLs for all multimedia
    const multimediaWithUrls = await Promise.all(
      allMultimedia.map(async (media) => ({
        ...media,
        url: await getLocalFileUrl(media.url)
      }))
    );

    // Get random comments for each multimedia item
    const commentsCount = await prisma.comment.count({
      where: {
        text: { not: '' } // Exclude empty comments
      }
    });

    const multimediaWithComments = await Promise.all(
      multimediaWithUrls.map(async (media) => {
        const randomComments = await prisma.comment.findMany({
          where: {
            text: { not: '' } // Exclude empty comments
          },
          include: {
            user: true
          },
          skip: Math.floor(Math.random() * Math.max(0, commentsCount - 5)),
          take: 5, // Fewer comments per item since we have 6 items
        });

        return {
          multimedia: media,
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
        };
      })
    );

    return NextResponse.json(multimediaWithComments);
  } catch (error) {
    console.error('Error in random route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}