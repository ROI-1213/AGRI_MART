import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Product } from '@/types';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'import', 'products.json');

// GET: fetch all products
export async function GET() {
  try {
    const fileData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
    const products = JSON.parse(fileData);
    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    console.error('Error reading products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: update existing product
export async function PUT(req: NextRequest) {
  try {
    const updatedProduct = await req.json();

    if (!updatedProduct.id && !updatedProduct.riplCode) {
      return NextResponse.json({ success: false, error: 'Product ID or RIPL Code is required' }, { status: 400 });
    }

    const fileData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
    const products: Product[] = JSON.parse(fileData);

    const index = products.findIndex(
      (p) => (updatedProduct.id && p.id === updatedProduct.id) || (updatedProduct.riplCode && p.riplCode === updatedProduct.riplCode)
    );

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Preserve original fields and merge updates
    products[index] = {
      ...products[index],
      ...updatedProduct,
    };

    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: products[index],
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: create new product
export async function POST(req: NextRequest) {
  try {
    const newProduct = await req.json();

    if (!newProduct.name || !newProduct.riplCode) {
      return NextResponse.json({ success: false, error: 'Name and RIPL Code are required' }, { status: 400 });
    }

    const fileData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
    const products: Product[] = JSON.parse(fileData);

    // Generate unique ID and slug if not provided
    const id = newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = newProduct.slug || id;

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
      images: Array.isArray(newProduct.images) && newProduct.images.length > 0 ? newProduct.images : [newProduct.thumbnailImage || '/assets/branding/logo.png'],
      thumbnailImage: newProduct.thumbnailImage || '/assets/branding/logo.png',
      description: newProduct.description || '',
      specifications: newProduct.specifications || {},
      brochures: newProduct.brochures || [],
      videos: newProduct.videos || [],
      accessories: newProduct.accessories || [],
      spareParts: newProduct.spareParts || [],
      createdAt: new Date().toISOString(),
    };

    products.unshift(fullProduct);

    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: fullProduct,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: delete product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
    }

    const fileData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8');
    const products: Product[] = JSON.parse(fileData);

    const filtered = products.filter((p) => p.id !== id);

    if (filtered.length === products.length) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(filtered, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      remaining: filtered.length,
    });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
