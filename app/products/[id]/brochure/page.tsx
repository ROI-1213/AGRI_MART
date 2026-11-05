'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';

export default function ProductBrochurePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const productId = resolvedParams.id;
  const product = (productsData as unknown as Product[]).find(
    p => p.id === productId || p.slug === productId || p.riplCode.toLowerCase() === productId?.toLowerCase()
  );

  useEffect(() => {
    if (product && product.brochures && product.brochures.length > 0) {
      const primaryUrl = product.brochures[0].url;
      const base = primaryUrl.split('/').pop() || '';
      window.location.href = base ? `/uploads/product_brochure/1/${base}` : (product.slug ? `/products/${product.slug}` : `/products/${productId}`);
    } else if (product) {
      router.replace(product.slug ? `/products/${product.slug}` : `/products/${productId}`);
    } else {
      router.replace('/products');
    }
  }, [product, productId, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Opening official product brochure...</p>
    </div>
  );
}
