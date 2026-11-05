import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const productId = searchParams.get('id') || searchParams.get('code') || '';
  const lang = searchParams.get('lang') || 'English';
  const customFilename = searchParams.get('filename') || 'product_brochure.pdf';

  if (!targetUrl) {
    if (productId) {
      return NextResponse.redirect(new URL(`/products/${productId}/brochure?lang=${encodeURIComponent(lang)}`, request.url));
    }
    return NextResponse.redirect(new URL('/assets/brochures/agrimart_brochure.pdf', request.url));
  }

  // 1. Direct resolution from local static brochure repository
  try {
    const cleanUrl = targetUrl.startsWith('http') 
      ? targetUrl 
      : `https://agrimart.in${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    const parsed = new URL(cleanUrl);
    const basename = path.basename(parsed.pathname);

    if (basename && /\.(pdf|jpg|jpeg|png|webp)$/i.test(basename)) {
      return NextResponse.redirect(new URL(`/uploads/product_brochure/1/${basename}`, request.url));
    }
  } catch {
    // Continue to fallback if parsing failed
  }

  // 2. Fetch from remote if not available locally
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';

    if (response.ok && (contentType.includes('application/pdf') || contentType.includes('image/'))) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${customFilename}"`,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
      });
    }
  } catch {
    // Remote fetch failed or timed out
  }

  // 3. Graceful fallback: Dedicated printable in-app brochure view
  if (productId) {
    return NextResponse.redirect(new URL(`/products/${productId}/brochure?lang=${encodeURIComponent(lang)}`, request.url));
  }

  return NextResponse.redirect(new URL('/assets/brochures/agrimart_brochure.pdf', request.url));
}
