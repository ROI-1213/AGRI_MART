import { redirect, notFound } from 'next/navigation';
import productsData from '@/data/import/products.json';
import { getProductByIdOrSlug } from '@/lib/db';
import { Product } from '@/types';

export const dynamicParams = true;
export const revalidate = 60;

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

export default async function ProductBrochurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: Product | undefined;
  try {
    const dbProduct = await getProductByIdOrSlug(id);
    if (dbProduct) product = dbProduct;
  } catch {
    // Fallback to seed data
  }
  if (!product) {
    product = (productsData as unknown as Product[]).find(
      p => p.id === id || p.slug === id || p.riplCode.toLowerCase() === id?.toLowerCase()
    );
  }

  if (!product) {
    notFound();
  }

  if (product.brochures && product.brochures.length > 0) {
    const primaryUrl = product.brochures[0].url;
    const base = primaryUrl.split('/').pop() || '';
    if (base) {
      redirect(`/uploads/product_brochure/1/${base}`);
    }
  }

  redirect(product.slug ? `/products/${product.slug}` : `/products/${id}`);
}
