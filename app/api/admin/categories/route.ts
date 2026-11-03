import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const CATEGORIES_FILE_PATH = path.join(process.cwd(), 'data', 'import', 'categories.json');

// GET: fetch all categories
export async function GET() {
  try {
    const fileData = await fs.readFile(CATEGORIES_FILE_PATH, 'utf-8');
    const categories = JSON.parse(fileData);
    return NextResponse.json({ success: true, count: categories.length, categories });
  } catch (error: any) {
    console.error('Error reading categories:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: update existing category
export async function PUT(req: NextRequest) {
  try {
    const updatedCategory = await req.json();

    if (!updatedCategory.id) {
      return NextResponse.json({ success: false, error: 'Category ID is required' }, { status: 400 });
    }

    const fileData = await fs.readFile(CATEGORIES_FILE_PATH, 'utf-8');
    const categories = JSON.parse(fileData);

    const index = categories.findIndex((c: any) => c.id === updatedCategory.id);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    categories[index] = {
      ...categories[index],
      ...updatedCategory,
    };

    await fs.writeFile(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      category: categories[index],
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: create new category
export async function POST(req: NextRequest) {
  try {
    const newCategory = await req.json();

    if (!newCategory.name) {
      return NextResponse.json({ success: false, error: 'Category Name is required' }, { status: 400 });
    }

    const fileData = await fs.readFile(CATEGORIES_FILE_PATH, 'utf-8');
    const categories = JSON.parse(fileData);

    const id = newCategory.id || `cat_${Date.now()}`;
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const fullCategory = {
      id,
      name: newCategory.name.toUpperCase(),
      slug,
      icon: newCategory.icon || 'Package',
      subcategories: Array.isArray(newCategory.subcategories) ? newCategory.subcategories : [],
      count: Number(newCategory.count) || 0,
      image: newCategory.image || '/assets/branding/logo.png',
    };

    categories.push(fullCategory);

    await fs.writeFile(CATEGORIES_FILE_PATH, JSON.stringify(categories, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category: fullCategory,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
