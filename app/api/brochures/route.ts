import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const productId = searchParams.get('id') || searchParams.get('code') || '';
  const lang = searchParams.get('lang') || 'English';
  const filename = searchParams.get('filename') || 'product_brochure.pdf';

  if (!targetUrl) {
    if (productId) {
      return NextResponse.redirect(new URL(`/products/${productId}/brochure?lang=${encodeURIComponent(lang)}&print=1`, request.url));
    }
    return NextResponse.redirect(new URL('/assets/brochures/agrimart_brochure.pdf', request.url));
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';

    // If target successfully returned a PDF, stream it inline
    if (response.ok && contentType.includes('application/pdf')) {
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400'
        }
      });
    }
  } catch {
    // Remote fetch failed or timed out (e.g. agrimart.in under maintenance)
  }

  // Graceful fallback: Redirect to dedicated printable in-app brochure view in user's language
  if (productId) {
    return NextResponse.redirect(new URL(`/products/${productId}/brochure?lang=${encodeURIComponent(lang)}&print=1`, request.url));
  }

  // Master catalog fallback
  return NextResponse.redirect(new URL('/assets/brochures/agrimart_brochure.pdf', request.url));
}
