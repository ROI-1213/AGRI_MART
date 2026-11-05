import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const productId = searchParams.get('id') || searchParams.get('code') || '';

  if (!targetUrl) {
    if (productId) {
      return NextResponse.redirect(new URL(`/products/${productId}`, request.url));
    }
    return NextResponse.redirect(new URL('/products', request.url));
  }

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
    // Continue to fallback
  }

  if (productId) {
    return NextResponse.redirect(new URL(`/products/${productId}`, request.url));
  }

  return NextResponse.redirect(new URL('/products', request.url));
}
