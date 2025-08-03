import { NextResponse } from 'next/server';
import { LocalFileService } from '@/utils/fileService';
import fs from 'fs/promises';
import path from 'path';

async function getLocalFileUrl(key: string): Promise<string> {
  return LocalFileService.getFileUrl(key);
}

async function listLocalFiles(memeId: string): Promise<{ key: string; url: string }[]> {
  try {
    const mediaDir = path.join(process.cwd(), 'public', 'media');
    const memeDir = path.join(mediaDir, memeId);
    
    // Check if directory exists
    try {
      await fs.access(memeDir);
    } catch {
      return []; // Directory doesn't exist, return empty array
    }

    const files = await fs.readdir(memeDir, { withFileTypes: true });
    const fileList: { key: string; url: string }[] = [];

    for (const file of files) {
      if (file.isFile()) {
        const key = `${memeId}/${file.name}`;
        fileList.push({
          key,
          url: await getLocalFileUrl(key)
        });
      }
    }

    return fileList;
  } catch (error) {
    console.error('Error listing local files:', error);
    return [];
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ memeId: string }> }
) {
  try {
    const { memeId } = await context.params;
    const files = await listLocalFiles(memeId);

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing local files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}