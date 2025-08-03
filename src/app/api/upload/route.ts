import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { LocalFileService } from '@/utils/fileService';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'uploads';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type (optional - add your own validation)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${originalName}`;
    const fileKey = `${folder}/${fileName}`;

    // Ensure directory exists
    await LocalFileService.ensureDirectory(fileKey);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = LocalFileService.getFilePath(fileKey);
    
    await writeFile(filePath, buffer);

    // Return the file information
    const fileUrl = LocalFileService.getFileUrl(fileKey);
    
    return NextResponse.json({
      success: true,
      file: {
        key: fileKey,
        url: fileUrl,
        name: fileName,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}