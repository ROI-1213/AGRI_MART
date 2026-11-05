import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import productsData from '@/data/import/products.json';
import { Product } from '@/types';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const prods = productsData as unknown as Product[];
  const set = new Set<string>();
  const params: { id: string }[] = [];

  for (const p of prods) {
    if (p.id && !set.has(p.id)) {
      set.add(p.id);
      params.push({ id: p.id });
    }
    if (p.slug && !set.has(p.slug)) {
      set.add(p.slug);
      params.push({ id: p.slug });
    }
    if (p.riplCode && !set.has(p.riplCode.toLowerCase())) {
      set.add(p.riplCode.toLowerCase());
      params.push({ id: p.riplCode.toLowerCase() });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = (productsData as unknown as Product[]).find(
    p => p.id === id || p.slug === id || p.riplCode.toLowerCase() === id?.toLowerCase()
  );
  if (!product) return { title: 'Product Not Found | AGRIMART' };
  return {
    title: `${product.name} | AGRIMART`,
    description: product.description?.slice(0, 160) || `${product.name} available at AGRIMART`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = (productsData as unknown as Product[]).find(
    p => p.id === id || p.slug === id || p.riplCode.toLowerCase() === id?.toLowerCase()
  );

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
