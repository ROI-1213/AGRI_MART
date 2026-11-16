import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getCmsSetting } from '@/lib/db';

interface StoredAssetRecord {
  mimeType: string;
  base64: string;
  fileName: string;
}

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

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug || slug.length === 0) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const folder = (slug[0] || 'general').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = (slug[1] || slug[0]).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const ext = path.extname(fileName).toLowerCase();
    const defaultMime = MIME_MAP[ext] || 'application/octet-stream';

    // 1. Check local public/uploads directory first
    try {
      const localPath = path.join(process.cwd(), 'public', 'uploads', folder, fileName);
      const fileBuffer = await fs.readFile(localPath);
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': defaultMime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // Fallback to PostgreSQL storage
    }

    // 2. Check PostgreSQL cms_settings
    const dbKey = `upload_${folder}_${fileName}`;
    const record = await getCmsSetting<StoredAssetRecord>(dbKey);
    if (record && record.base64) {
      const buffer = Buffer.from(record.base64, 'base64');
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': record.mimeType || defaultMime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
