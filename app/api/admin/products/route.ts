import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getAllProducts,
  createProductInDb,
  updateProductInDb,
  deleteProductInDb,
} from '@/lib/db';
import { Product } from '@/types';

function safeRevalidate(paths: string[]) {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // Ignore outside request context
    }
  }
}

// GET: fetch all products from PostgreSQL
export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error('Error reading products from PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: update existing product in PostgreSQL
export async function PUT(req: NextRequest) {
  try {
    const updatedProduct = await req.json();

    if (!updatedProduct.id && !updatedProduct.riplCode) {
      return NextResponse.json({ success: false, error: 'Product ID or RIPL Code is required' }, { status: 400 });
    }

    const saved = await updateProductInDb(updatedProduct);

    if (!saved) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    safeRevalidate([
      '/',
      '/products',
      `/products/${saved.slug}`,
      `/products/${saved.id}`,
      `/products/${saved.riplCode.toLowerCase()}`,
    ]);

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully in PostgreSQL',
      product: saved,
    });
  } catch (error: any) {
    console.error('Error updating product in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: create new product in PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const newProduct = await req.json();

    if (!newProduct.name || !newProduct.riplCode) {
      return NextResponse.json({ success: false, error: 'Name and RIPL Code are required' }, { status: 400 });
    }

    const baseSlug = (newProduct.slug || newProduct.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = newProduct.id || `${baseSlug}-${Date.now()}`;
    const slug = newProduct.slug || `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const fullProduct: Product = {
      id,
      slug,
      name: newProduct.name,
      riplCode: newProduct.riplCode,
      brand: newProduct.brand || 'AGRIMATE',
      category: newProduct.category || 'GENERAL',
      subcategory: newProduct.subcategory || '',
      mrp: Number(newProduct.mrp) || 0,
      sellingPrice: Number(newProduct.sellingPrice) || 0,
      discountPercentage: Number(newProduct.discountPercentage) || 0,
      currency: 'INR',
      taxInclusive: true,
      stockQuantity: Number(newProduct.stockQuantity) || 10,
      availability: newProduct.availability || 'In Stock',
      images:
        Array.isArray(newProduct.images) && newProduct.images.length > 0
          ? newProduct.images
          : [newProduct.thumbnailImage || '/assets/branding/logo.png'],
      thumbnailImage: newProduct.thumbnailImage || '/assets/branding/logo.png',
      description: newProduct.description || '',
      specifications: newProduct.specifications || {},
      brochures: newProduct.brochures || [],
      videos: newProduct.videos || [],
      accessories: newProduct.accessories || [],
      spareParts: newProduct.spareParts || [],
      createdAt: new Date().toISOString(),
    };

    const created = await createProductInDb(fullProduct);

    safeRevalidate(['/', '/products', `/products/${created.slug}`, `/products/${created.id}`]);

    return NextResponse.json({
      success: true,
      message: 'Product created successfully in PostgreSQL',
      product: created,
    });
  } catch (error: any) {
    console.error('Error creating product in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: delete product from PostgreSQL
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const { deleted, remaining } = await deleteProductInDb(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    safeRevalidate(['/', '/products', `/products/${deleted.slug}`, `/products/${deleted.id}`]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully from PostgreSQL',
      remaining,
    });
  } catch (error: any) {
    console.error('Error deleting product from PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
