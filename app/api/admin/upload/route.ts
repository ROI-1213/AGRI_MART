import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { upsertCmsSetting } from '@/lib/db';

const MIME_MAP: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const rawFolder = (formData.get('folder') as string) || 'general';
    const folder = rawFolder.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

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

    const uploadedUrls: string[] = [];

    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase() || '.png';
      const cleanBaseName = path
        .basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .slice(0, 40);

      const uniqueFileName = `${cleanBaseName}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}${ext}`;
      const mimeType = file.type || MIME_MAP[ext] || 'image/png';

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let wroteToLocalDisk = false;
      try {
        const uploadBaseDir = path.join(process.cwd(), 'public', 'uploads', folder);
        await fs.mkdir(uploadBaseDir, { recursive: true });
        const filePath = path.join(uploadBaseDir, uniqueFileName);
        await fs.writeFile(filePath, buffer);
        wroteToLocalDisk = true;
      } catch {
        // Read-only filesystem (e.g. Vercel serverless)
        wroteToLocalDisk = false;
      }

      let savedToDb = false;
      try {
        const dbKey = `upload_${folder}_${uniqueFileName}`;
        await upsertCmsSetting(dbKey, {
          fileName: uniqueFileName,
          mimeType,
          base64: buffer.toString('base64'),
          updatedAt: new Date().toISOString(),
        });
        savedToDb = true;
      } catch {
        savedToDb = false;
      }

      if (savedToDb) {
        uploadedUrls.push(`/api/uploads/${folder}/${uniqueFileName}`);
      } else if (wroteToLocalDisk) {
        uploadedUrls.push(`/uploads/${folder}/${uniqueFileName}`);
      } else {
        // Ultimate serverless fallback: self-contained Data URI
        uploadedUrls.push(`data:${mimeType};base64,${buffer.toString('base64')}`);
      }
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
