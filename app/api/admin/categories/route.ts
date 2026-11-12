import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import {
  getAllCategories,
  createCategoryInDb,
  updateCategoryInDb,
  deleteCategoryInDb,
} from '@/lib/db';

// GET: fetch all categories from PostgreSQL
export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    console.error('Error reading categories from PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: update existing category in PostgreSQL
export async function PUT(req: NextRequest) {
  try {
    const updatedCategory = await req.json();

    if (!updatedCategory.id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const saved = await updateCategoryInDb(updatedCategory);

    if (!saved) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
    } catch {
      // Ignore outside request context
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully in PostgreSQL',
      category: saved,
    });
  } catch (error: any) {
    console.error('Error updating category in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: create new category in PostgreSQL
export async function POST(req: NextRequest) {
  try {
    const newCategory = await req.json();

    if (!newCategory.name) {
      return NextResponse.json({ success: false, error: 'Category Name is required' }, { status: 400 });
    }

    const id = newCategory.id || `cat_${Date.now()}`;
    const baseSlug = (newCategory.slug || newCategory.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const fullCategory = {
      id,
      name: newCategory.name.toUpperCase(),
      slug: baseSlug || id,
      icon: newCategory.icon || 'Package',
      subcategories: Array.isArray(newCategory.subcategories) ? newCategory.subcategories : [],
      count: Number(newCategory.count) || 0,
      image: newCategory.image || '/assets/branding/logo.png',
    };

    const created = await createCategoryInDb(fullCategory);

    try {
      revalidatePath('/');
      revalidatePath('/products');
    } catch {
      // Ignore outside request context
    }

    return NextResponse.json({
      success: true,
      message: 'Category created successfully in PostgreSQL',
      category: created,
    });
  } catch (error: any) {
    console.error('Error creating category in PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: delete category from PostgreSQL
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const deleted = await deleteCategoryInDb(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    try {
      revalidatePath('/');
      revalidatePath('/products');
    } catch {
      // Ignore outside request context
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully from PostgreSQL',
    });
  } catch (error: any) {
    console.error('Error deleting category from PostgreSQL:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
