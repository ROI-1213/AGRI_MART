import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFolder = (formData.get('folder') as string) || 'general';
    // Sanitize folder name
    const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    // Check for multiple files ('files') or single file ('file')
    const files: File[] = [];
    const multiFiles = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    if (multiFiles && multiFiles.length > 0) {
      for (const f of multiFiles) {
        if (f && typeof f === 'object' && f.name) files.push(f);
      }
    } else if (singleFile && singleFile.name) {
      files.push(singleFile);
    }

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded. Please select an image to upload.' },
        { status: 400 }
      );
    }

    const uploadBaseDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.mkdir(uploadBaseDir, { recursive: true });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase() || '.png';
      const cleanBaseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);

      const uniqueFileName = `${cleanBaseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
      const filePath = path.join(uploadBaseDir, uniqueFileName);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${folder}/${uniqueFileName}`;
      uploadedUrls.push(publicUrl);
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Server error while saving uploaded file.',
      },
      { status: 500 }
    );
  }
}
