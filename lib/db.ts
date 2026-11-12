import { Pool } from 'pg';
import productsSeedData from '@/data/import/products.json';
import categoriesSeedData from '@/data/import/categories.json';
import partnerAppsSeedData from '@/data/import/partner_applications.json';
import { DEFAULT_HOMEPAGE_CMS, DEFAULT_ABOUTUS_CMS } from '@/lib/cmsDefaults';
import { Product } from '@/types';

export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  count: number;
  image: string;
}

export interface PartnerApplicationRecord {
  id: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  companyName: string;
  businessType: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
  yearsInBusiness: string;
  gstin: string;
  pan: string;
  categoriesOfInterest: string[];
  existingBrands: string;
  message: string;
  adminNotes: string;
}

export interface EnquiryRecord {
  id: string;
  name: string;
  mobile: string;
  email: string;
  whatsappNo?: string;
  type: string;
  enquiryType?: string;
  subject: string;
  message?: string;
  userType?: string;
  gstNumber?: string;
  productId?: string;
  productName?: string;
  riplCode?: string;
  brand?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  townTaluk?: string;
  pincode?: string;
  quantity?: number;
  landSize?: string;
  cropName?: string;
  date: string;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __agrimartPgPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __agrimartDbReadyPromise: Promise<void> | undefined;
  // eslint-disable-next-line no-var
  var __agrimartBuildProductsCache: Product[] | undefined;
}

export function getPool(): Pool {
  if (globalThis.__agrimartPgPool) {
    return globalThis.__agrimartPgPool;
  }

  const sslEnabled = process.env.DB_SSL === 'true';
  const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'agri19044_agrimart',
        user: process.env.DB_USER || 'agri19044_agrimart',
        password: process.env.DB_PASSWORD || '',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };

  globalThis.__agrimartPgPool = new Pool(poolConfig);
  return globalThis.__agrimartPgPool;
}

async function initializeAndSeed(): Promise<void> {
  const pool = getPool();

  // Fast read-only check so normal requests/workers don't take DDL or advisory locks once seeded
  try {
    const fastCheck = await pool.query(`
      SELECT
        to_regclass('public.products') IS NOT NULL AS has_products,
        to_regclass('public.categories') IS NOT NULL AS has_categories,
        to_regclass('public.partner_applications') IS NOT NULL AS has_apps,
        to_regclass('public.enquiries') IS NOT NULL AS has_enquiries,
        to_regclass('public.cms_settings') IS NOT NULL AS has_cms
    `);
    const row = fastCheck.rows[0];
    if (row?.has_products && row?.has_categories && row?.has_apps && row?.has_enquiries && row?.has_cms) {
      const cnt = await pool.query('SELECT COUNT(*)::int AS c FROM products');
      if ((cnt.rows[0]?.c ?? 0) > 0) {
        return;
      }
    }
  } catch {
    // Proceed to full locked initialization
  }

  const client = await pool.connect();

  try {
    await client.query('SELECT pg_advisory_lock(948271)');

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        ripl_code TEXT NOT NULL,
        brand TEXT NOT NULL DEFAULT 'AGRIMATE',
        category TEXT NOT NULL DEFAULT 'GENERAL',
        subcategory TEXT DEFAULT '',
        mrp NUMERIC(12, 2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
        discount_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
        currency TEXT NOT NULL DEFAULT 'INR',
        tax_inclusive BOOLEAN NOT NULL DEFAULT TRUE,
        stock_quantity INTEGER NOT NULL DEFAULT 10,
        availability TEXT NOT NULL DEFAULT 'In Stock',
        images JSONB NOT NULL DEFAULT '[]'::jsonb,
        thumbnail_image TEXT NOT NULL DEFAULT '/assets/branding/logo.png',
        description TEXT DEFAULT '',
        specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
        brochures JSONB NOT NULL DEFAULT '[]'::jsonb,
        videos JSONB NOT NULL DEFAULT '[]'::jsonb,
        accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
        spare_parts JSONB NOT NULL DEFAULT '[]'::jsonb,
        source_url TEXT DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
      CREATE INDEX IF NOT EXISTS idx_products_ripl_code_lower ON products (LOWER(ripl_code));
      CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);

      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        icon TEXT DEFAULT 'Package',
        subcategories JSONB NOT NULL DEFAULT '[]'::jsonb,
        count INTEGER NOT NULL DEFAULT 0,
        image TEXT DEFAULT '/assets/branding/logo.png',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS partner_applications (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL DEFAULT 'NEW',
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        whatsapp TEXT DEFAULT '',
        company_name TEXT NOT NULL,
        business_type TEXT DEFAULT 'Proprietorship',
        address TEXT DEFAULT '',
        state TEXT NOT NULL,
        city TEXT NOT NULL,
        pincode TEXT DEFAULT '',
        years_in_business TEXT DEFAULT '1-3 Years',
        gstin TEXT DEFAULT '',
        pan TEXT DEFAULT '',
        categories_of_interest JSONB NOT NULL DEFAULT '[]'::jsonb,
        existing_brands TEXT DEFAULT '',
        message TEXT DEFAULT '',
        admin_notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS enquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT DEFAULT '',
        whatsapp_no TEXT DEFAULT '',
        type TEXT NOT NULL DEFAULT 'Product Enquiry',
        enquiry_type TEXT DEFAULT 'PRODUCT_ENQUIRY',
        subject TEXT NOT NULL DEFAULT '',
        message TEXT DEFAULT '',
        user_type TEXT DEFAULT 'CUSTOMER',
        gst_number TEXT DEFAULT '',
        product_id TEXT DEFAULT '',
        product_name TEXT DEFAULT '',
        ripl_code TEXT DEFAULT '',
        brand TEXT DEFAULT '',
        country TEXT DEFAULT 'India',
        state TEXT DEFAULT '',
        city TEXT DEFAULT '',
        address TEXT DEFAULT '',
        town_taluk TEXT DEFAULT '',
        pincode TEXT DEFAULT '',
        quantity INTEGER DEFAULT 1,
        land_size TEXT DEFAULT '',
        crop_name TEXT DEFAULT '',
        date_label TEXT DEFAULT '',
        status TEXT NOT NULL DEFAULT 'NEW',
        notes TEXT DEFAULT '',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS cms_settings (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL DEFAULT '{}'::jsonb,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 1. Batch-seed products if empty
    const prodCountRes = await client.query('SELECT COUNT(*)::int AS count FROM products');
    if (prodCountRes.rows[0].count === 0) {
      const prods = productsSeedData as unknown as Product[];
      const batchSize = 50;
      await client.query('BEGIN');
      try {
        for (let offset = 0; offset < prods.length; offset += batchSize) {
          const chunk = prods.slice(offset, offset + batchSize);
          const values: any[] = [];
          const placeholders: string[] = [];

          chunk.forEach((p, idx) => {
            const i = offset + idx;
            const slug = p.slug || p.id || `prod-${i}`;
            const base = idx * 24;
            placeholders.push(
              `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15}::jsonb, $${base + 16}, $${base + 17}, $${base + 18}::jsonb, $${base + 19}::jsonb, $${base + 20}::jsonb, $${base + 21}::jsonb, $${base + 22}::jsonb, $${base + 23}, $${base + 24})`
            );
            values.push(
              p.id,
              p.name || 'Unnamed Product',
              slug,
              p.riplCode || '',
              p.brand || 'AGRIMATE',
              p.category || 'GENERAL',
              p.subcategory || '',
              Number(p.mrp) || 0,
              Number(p.sellingPrice) || 0,
              Number(p.discountPercentage) || 0,
              p.currency || 'INR',
              p.taxInclusive !== false,
              Number(p.stockQuantity) || 0,
              p.availability || 'In Stock',
              JSON.stringify(p.images || []),
              p.thumbnailImage || '/assets/branding/logo.png',
              p.description || '',
              JSON.stringify(p.specifications || {}),
              JSON.stringify(p.brochures || []),
              JSON.stringify(p.videos || []),
              JSON.stringify(p.accessories || []),
              JSON.stringify(p.spareParts || []),
              p.sourceUrl || '',
              i
            );
          });

          await client.query(
            `INSERT INTO products (
              id, name, slug, ripl_code, brand, category, subcategory,
              mrp, selling_price, discount_percentage, currency, tax_inclusive,
              stock_quantity, availability, images, thumbnail_image, description,
              specifications, brochures, videos, accessories, spare_parts, source_url, sort_order
            ) VALUES ${placeholders.join(', ')} ON CONFLICT (id) DO NOTHING`,
            values
          );
        }
        await client.query('COMMIT');
      } catch (seedErr) {
        await client.query('ROLLBACK');
        throw seedErr;
      }
    }

    // 2. Batch-seed categories if empty
    const catCountRes = await client.query('SELECT COUNT(*)::int AS count FROM categories');
    if (catCountRes.rows[0].count === 0) {
      const cats = categoriesSeedData as unknown as CategoryRecord[];
      const values: any[] = [];
      const placeholders: string[] = [];
      cats.forEach((c, i) => {
        const base = i * 8;
        placeholders.push(
          `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}::jsonb, $${base + 6}, $${base + 7}, $${base + 8})`
        );
        values.push(
          c.id,
          c.name,
          c.slug,
          c.icon || 'Package',
          JSON.stringify(c.subcategories || []),
          Number(c.count) || 0,
          c.image || '/assets/branding/logo.png',
          i
        );
      });
      if (placeholders.length > 0) {
        await client.query(
          `INSERT INTO categories (id, name, slug, icon, subcategories, count, image, sort_order)
           VALUES ${placeholders.join(', ')} ON CONFLICT (id) DO NOTHING`,
          values
        );
      }
    }

    // 3. Seed partner applications if empty
    const appCountRes = await client.query('SELECT COUNT(*)::int AS count FROM partner_applications');
    if (appCountRes.rows[0].count === 0 && Array.isArray(partnerAppsSeedData) && partnerAppsSeedData.length > 0) {
      for (const app of partnerAppsSeedData as PartnerApplicationRecord[]) {
        await client.query(
          `INSERT INTO partner_applications (
            id, status, full_name, email, phone, whatsapp, company_name, business_type,
            address, state, city, pincode, years_in_business, gstin, pan,
            categories_of_interest, existing_brands, message, admin_notes, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13, $14, $15,
            $16::jsonb, $17, $18, $19, $20, $21
          ) ON CONFLICT (id) DO NOTHING`,
          [
            app.id,
            app.status || 'NEW',
            app.fullName,
            app.email,
            app.phone,
            app.whatsapp || app.phone,
            app.companyName,
            app.businessType || 'Proprietorship',
            app.address || '',
            app.state,
            app.city,
            app.pincode || '',
            app.yearsInBusiness || '1-3 Years',
            app.gstin || '',
            app.pan || '',
            JSON.stringify(app.categoriesOfInterest || []),
            app.existingBrands || '',
            app.message || '',
            app.adminNotes || '',
            app.createdAt || new Date().toISOString(),
            app.updatedAt || app.createdAt || new Date().toISOString(),
          ]
        );
      }
    }

    // 4. Seed CMS defaults if missing
    await client.query(
      `INSERT INTO cms_settings (key, data)
       VALUES ('homepage', $1::jsonb), ('aboutus', $2::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [JSON.stringify(DEFAULT_HOMEPAGE_CMS), JSON.stringify(DEFAULT_ABOUTUS_CMS)]
    );
  } finally {
    await client.query('SELECT pg_advisory_unlock(948271)').catch(() => {});
    client.release();
  }
}

export async function ensureDatabaseReady(): Promise<void> {
  if (!globalThis.__agrimartDbReadyPromise) {
    globalThis.__agrimartDbReadyPromise = initializeAndSeed().catch((err) => {
      globalThis.__agrimartDbReadyPromise = undefined;
      throw err;
    });
  }
  return globalThis.__agrimartDbReadyPromise;
}

function mapProductRow(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    riplCode: row.ripl_code,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory || '',
    mrp: Number(row.mrp) || 0,
    sellingPrice: Number(row.selling_price) || 0,
    discountPercentage: Number(row.discount_percentage) || 0,
    currency: row.currency || 'INR',
    taxInclusive: row.tax_inclusive !== false,
    stockQuantity: Number(row.stock_quantity) || 0,
    availability: row.availability || 'In Stock',
    images: Array.isArray(row.images) ? row.images : [],
    thumbnailImage: row.thumbnail_image || '/assets/branding/logo.png',
    description: row.description || '',
    specifications: row.specifications && typeof row.specifications === 'object' ? row.specifications : {},
    brochures: Array.isArray(row.brochures) ? row.brochures : [],
    videos: Array.isArray(row.videos) ? row.videos : [],
    accessories: Array.isArray(row.accessories) ? row.accessories : [],
    spareParts: Array.isArray(row.spare_parts) ? row.spare_parts : [],
    sourceUrl: row.source_url || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
  };
}

function mapCategoryRow(row: any): CategoryRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    icon: row.icon || 'Package',
    subcategories: Array.isArray(row.subcategories) ? row.subcategories : [],
    count: Number(row.count) || 0,
    image: row.image || '/assets/branding/logo.png',
  };
}

function mapPartnerAppRow(row: any): PartnerApplicationRecord {
  return {
    id: row.id,
    status: row.status,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp || '',
    companyName: row.company_name,
    businessType: row.business_type || 'Proprietorship',
    address: row.address || '',
    state: row.state,
    city: row.city,
    pincode: row.pincode || '',
    yearsInBusiness: row.years_in_business || '1-3 Years',
    gstin: row.gstin || '',
    pan: row.pan || '',
    categoriesOfInterest: Array.isArray(row.categories_of_interest) ? row.categories_of_interest : [],
    existingBrands: row.existing_brands || '',
    message: row.message || '',
    adminNotes: row.admin_notes || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

function mapEnquiryRow(row: any): EnquiryRecord {
  const created = row.created_at ? new Date(row.created_at) : new Date();
  const formattedDate =
    row.date_label ||
    created.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return {
    id: row.id,
    name: row.name,
    mobile: row.mobile,
    email: row.email || '',
    whatsappNo: row.whatsapp_no || '',
    type: row.type || 'Product Enquiry',
    enquiryType: row.enquiry_type || 'PRODUCT_ENQUIRY',
    subject: row.subject || '',
    message: row.message || '',
    userType: row.user_type || 'CUSTOMER',
    gstNumber: row.gst_number || '',
    productId: row.product_id || '',
    productName: row.product_name || '',
    riplCode: row.ripl_code || '',
    brand: row.brand || '',
    country: row.country || 'India',
    state: row.state || '',
    city: row.city || '',
    address: row.address || '',
    townTaluk: row.town_taluk || '',
    pincode: row.pincode || '',
    quantity: Number(row.quantity) || 1,
    landSize: row.land_size || '',
    cropName: row.crop_name || '',
    date: formattedDate,
    status: row.status || 'NEW',
    notes: row.notes || '',
    createdAt: created.toISOString(),
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

// ---------- PRODUCTS ----------
export async function getAllProducts(): Promise<Product[]> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('SELECT * FROM products ORDER BY sort_order ASC, created_at DESC');
  return res.rows.map(mapProductRow);
}

export async function getProductByIdOrSlug(identifier: string): Promise<Product | null> {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    if (!globalThis.__agrimartBuildProductsCache) {
      globalThis.__agrimartBuildProductsCache = await getAllProducts();
    }
    const lower = identifier.toLowerCase();
    return (
      globalThis.__agrimartBuildProductsCache.find(
        (p) => p.id === identifier || p.slug === identifier || p.riplCode.toLowerCase() === lower
      ) || null
    );
  }
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query(
    'SELECT * FROM products WHERE id = $1 OR slug = $1 OR LOWER(ripl_code) = LOWER($1) LIMIT 1',
    [identifier]
  );
  return res.rows[0] ? mapProductRow(res.rows[0]) : null;
}

export async function createProductInDb(product: Product): Promise<Product> {
  await ensureDatabaseReady();
  const pool = getPool();
  const minSortRes = await pool.query('SELECT COALESCE(MIN(sort_order), 0)::int AS min_order FROM products');
  const nextSortOrder = (minSortRes.rows[0]?.min_order ?? 0) - 1;

  const res = await pool.query(
    `INSERT INTO products (
      id, name, slug, ripl_code, brand, category, subcategory,
      mrp, selling_price, discount_percentage, currency, tax_inclusive,
      stock_quantity, availability, images, thumbnail_image, description,
      specifications, brochures, videos, accessories, spare_parts, source_url, sort_order
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12,
      $13, $14, $15::jsonb, $16, $17,
      $18::jsonb, $19::jsonb, $20::jsonb, $21::jsonb, $22::jsonb, $23, $24
    ) RETURNING *`,
    [
      product.id,
      product.name,
      product.slug,
      product.riplCode,
      product.brand || 'AGRIMATE',
      product.category || 'GENERAL',
      product.subcategory || '',
      Number(product.mrp) || 0,
      Number(product.sellingPrice) || 0,
      Number(product.discountPercentage) || 0,
      product.currency || 'INR',
      product.taxInclusive !== false,
      Number(product.stockQuantity) || 0,
      product.availability || 'In Stock',
      JSON.stringify(product.images || []),
      product.thumbnailImage || '/assets/branding/logo.png',
      product.description || '',
      JSON.stringify(product.specifications || {}),
      JSON.stringify(product.brochures || []),
      JSON.stringify(product.videos || []),
      JSON.stringify(product.accessories || []),
      JSON.stringify(product.spareParts || []),
      product.sourceUrl || '',
      nextSortOrder,
    ]
  );
  return mapProductRow(res.rows[0]);
}

export async function updateProductInDb(updated: Partial<Product>): Promise<Product | null> {
  await ensureDatabaseReady();
  const pool = getPool();
  const existingRes = await pool.query(
    'SELECT * FROM products WHERE id = $1 OR ($2 <> \'\' AND ripl_code = $2) LIMIT 1',
    [updated.id || '', updated.riplCode || '']
  );
  if (existingRes.rows.length === 0) return null;

  const current = mapProductRow(existingRes.rows[0]);
  const merged: Product = { ...current, ...updated };

  const res = await pool.query(
    `UPDATE products SET
      name = $2,
      slug = $3,
      ripl_code = $4,
      brand = $5,
      category = $6,
      subcategory = $7,
      mrp = $8,
      selling_price = $9,
      discount_percentage = $10,
      currency = $11,
      tax_inclusive = $12,
      stock_quantity = $13,
      availability = $14,
      images = $15::jsonb,
      thumbnail_image = $16,
      description = $17,
      specifications = $18::jsonb,
      brochures = $19::jsonb,
      videos = $20::jsonb,
      accessories = $21::jsonb,
      spare_parts = $22::jsonb,
      source_url = $23,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      current.id,
      merged.name,
      merged.slug,
      merged.riplCode,
      merged.brand,
      merged.category,
      merged.subcategory || '',
      Number(merged.mrp) || 0,
      Number(merged.sellingPrice) || 0,
      Number(merged.discountPercentage) || 0,
      merged.currency || 'INR',
      merged.taxInclusive !== false,
      Number(merged.stockQuantity) || 0,
      merged.availability || 'In Stock',
      JSON.stringify(merged.images || []),
      merged.thumbnailImage || '/assets/branding/logo.png',
      merged.description || '',
      JSON.stringify(merged.specifications || {}),
      JSON.stringify(merged.brochures || []),
      JSON.stringify(merged.videos || []),
      JSON.stringify(merged.accessories || []),
      JSON.stringify(merged.spareParts || []),
      merged.sourceUrl || '',
    ]
  );

  return res.rows[0] ? mapProductRow(res.rows[0]) : null;
}

export async function deleteProductInDb(id: string): Promise<{ deleted: Product | null; remaining: number }> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  const countRes = await pool.query('SELECT COUNT(*)::int AS count FROM products');
  return {
    deleted: res.rows[0] ? mapProductRow(res.rows[0]) : null,
    remaining: countRes.rows[0]?.count ?? 0,
  };
}

// ---------- CATEGORIES ----------
export async function getAllCategories(): Promise<CategoryRecord[]> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, name ASC');
  return res.rows.map(mapCategoryRow);
}

export async function createCategoryInDb(cat: CategoryRecord): Promise<CategoryRecord> {
  await ensureDatabaseReady();
  const pool = getPool();
  const maxSortRes = await pool.query('SELECT COALESCE(MAX(sort_order), 0)::int AS max_order FROM categories');
  const nextSortOrder = (maxSortRes.rows[0]?.max_order ?? 0) + 1;

  const res = await pool.query(
    `INSERT INTO categories (id, name, slug, icon, subcategories, count, image, sort_order)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
     RETURNING *`,
    [
      cat.id,
      cat.name,
      cat.slug,
      cat.icon || 'Package',
      JSON.stringify(cat.subcategories || []),
      Number(cat.count) || 0,
      cat.image || '/assets/branding/logo.png',
      nextSortOrder,
    ]
  );
  return mapCategoryRow(res.rows[0]);
}

export async function updateCategoryInDb(updated: Partial<CategoryRecord> & { id: string }): Promise<CategoryRecord | null> {
  await ensureDatabaseReady();
  const pool = getPool();
  const existingRes = await pool.query('SELECT * FROM categories WHERE id = $1 LIMIT 1', [updated.id]);
  if (existingRes.rows.length === 0) return null;

  const current = mapCategoryRow(existingRes.rows[0]);
  const merged: CategoryRecord = { ...current, ...updated };

  const res = await pool.query(
    `UPDATE categories SET
      name = $2,
      slug = $3,
      icon = $4,
      subcategories = $5::jsonb,
      count = $6,
      image = $7,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      current.id,
      merged.name,
      merged.slug,
      merged.icon || 'Package',
      JSON.stringify(merged.subcategories || []),
      Number(merged.count) || 0,
      merged.image || '/assets/branding/logo.png',
    ]
  );
  return res.rows[0] ? mapCategoryRow(res.rows[0]) : null;
}

export async function deleteCategoryInDb(id: string): Promise<boolean> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
  return res.rows.length > 0;
}

// ---------- PARTNER APPLICATIONS ----------
export async function getAllPartnerApplications(): Promise<PartnerApplicationRecord[]> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('SELECT * FROM partner_applications ORDER BY created_at DESC');
  return res.rows.map(mapPartnerAppRow);
}

export async function createPartnerApplicationInDb(app: PartnerApplicationRecord): Promise<PartnerApplicationRecord> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query(
    `INSERT INTO partner_applications (
      id, status, full_name, email, phone, whatsapp, company_name, business_type,
      address, state, city, pincode, years_in_business, gstin, pan,
      categories_of_interest, existing_brands, message, admin_notes, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13, $14, $15,
      $16::jsonb, $17, $18, $19, $20
    ) RETURNING *`,
    [
      app.id,
      app.status || 'NEW',
      app.fullName,
      app.email,
      app.phone,
      app.whatsapp || app.phone,
      app.companyName,
      app.businessType || 'Proprietorship',
      app.address || '',
      app.state,
      app.city,
      app.pincode || '',
      app.yearsInBusiness || '1-3 Years',
      app.gstin || '',
      app.pan || '',
      JSON.stringify(app.categoriesOfInterest || []),
      app.existingBrands || '',
      app.message || '',
      app.adminNotes || '',
      app.createdAt || new Date().toISOString(),
    ]
  );
  return mapPartnerAppRow(res.rows[0]);
}

export async function updatePartnerApplicationInDb(
  id: string,
  updates: { status?: string; adminNotes?: string }
): Promise<PartnerApplicationRecord | null> {
  await ensureDatabaseReady();
  const pool = getPool();
  const existingRes = await pool.query('SELECT * FROM partner_applications WHERE id = $1 LIMIT 1', [id]);
  if (existingRes.rows.length === 0) return null;

  const current = mapPartnerAppRow(existingRes.rows[0]);
  const res = await pool.query(
    `UPDATE partner_applications SET
      status = $2,
      admin_notes = $3,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      id,
      updates.status || current.status,
      typeof updates.adminNotes === 'string' ? updates.adminNotes : current.adminNotes,
    ]
  );
  return res.rows[0] ? mapPartnerAppRow(res.rows[0]) : null;
}

export async function deletePartnerApplicationInDb(id: string): Promise<boolean> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('DELETE FROM partner_applications WHERE id = $1 RETURNING id', [id]);
  return res.rows.length > 0;
}

// ---------- ENQUIRIES ----------
export async function getAllEnquiries(): Promise<EnquiryRecord[]> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('SELECT * FROM enquiries ORDER BY created_at DESC');
  return res.rows.map(mapEnquiryRow);
}

export async function createEnquiryInDb(enq: EnquiryRecord): Promise<EnquiryRecord> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query(
    `INSERT INTO enquiries (
      id, name, mobile, email, whatsapp_no, type, enquiry_type, subject, message,
      user_type, gst_number, product_id, product_name, ripl_code, brand,
      country, state, city, address, town_taluk, pincode, quantity,
      land_size, crop_name, date_label, status, notes, created_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21, $22,
      $23, $24, $25, $26, $27, $28
    ) RETURNING *`,
    [
      enq.id,
      enq.name,
      enq.mobile,
      enq.email || '',
      enq.whatsappNo || '',
      enq.type || 'Product Enquiry',
      enq.enquiryType || 'PRODUCT_ENQUIRY',
      enq.subject || '',
      enq.message || '',
      enq.userType || 'CUSTOMER',
      enq.gstNumber || '',
      enq.productId || '',
      enq.productName || '',
      enq.riplCode || '',
      enq.brand || '',
      enq.country || 'India',
      enq.state || '',
      enq.city || '',
      enq.address || '',
      enq.townTaluk || '',
      enq.pincode || '',
      Number(enq.quantity) || 1,
      enq.landSize || '',
      enq.cropName || '',
      enq.date || '',
      enq.status || 'NEW',
      enq.notes || '',
      enq.createdAt || new Date().toISOString(),
    ]
  );
  return mapEnquiryRow(res.rows[0]);
}

export async function updateEnquiryInDb(
  id: string,
  updates: Partial<EnquiryRecord>
): Promise<EnquiryRecord | null> {
  await ensureDatabaseReady();
  const pool = getPool();
  const existingRes = await pool.query('SELECT * FROM enquiries WHERE id = $1 LIMIT 1', [id]);
  if (existingRes.rows.length === 0) return null;

  const current = mapEnquiryRow(existingRes.rows[0]);
  const merged = { ...current, ...updates };

  const res = await pool.query(
    `UPDATE enquiries SET
      name = $2,
      mobile = $3,
      email = $4,
      type = $5,
      subject = $6,
      status = $7,
      notes = $8,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *`,
    [
      id,
      merged.name,
      merged.mobile,
      merged.email || '',
      merged.type || 'Product Enquiry',
      merged.subject || '',
      merged.status || 'NEW',
      typeof merged.notes === 'string' ? merged.notes : '',
    ]
  );
  return res.rows[0] ? mapEnquiryRow(res.rows[0]) : null;
}

export async function deleteEnquiryInDb(id: string): Promise<boolean> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('DELETE FROM enquiries WHERE id = $1 RETURNING id', [id]);
  return res.rows.length > 0;
}

// ---------- CMS SETTINGS ----------
export async function getCmsSetting<T = any>(key: string): Promise<T | null> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query('SELECT data FROM cms_settings WHERE key = $1 LIMIT 1', [key]);
  return res.rows[0]?.data ?? null;
}

export async function upsertCmsSetting<T = any>(key: string, data: T): Promise<T> {
  await ensureDatabaseReady();
  const pool = getPool();
  const res = await pool.query(
    `INSERT INTO cms_settings (key, data, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
     RETURNING data`,
    [key, JSON.stringify(data)]
  );
  return res.rows[0].data;
}

// ---------- DB HEALTH & STATS ----------
export async function getDbStatus() {
  await ensureDatabaseReady();
  const pool = getPool();
  const [verRes, statsRes] = await Promise.all([
    pool.query('SELECT version() AS version, current_database() AS db_name'),
    pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM products) AS products_count,
        (SELECT COUNT(*)::int FROM categories) AS categories_count,
        (SELECT COUNT(*)::int FROM partner_applications) AS partner_applications_count,
        (SELECT COUNT(*)::int FROM enquiries) AS enquiries_count,
        (SELECT COUNT(*)::int FROM cms_settings) AS cms_count
    `),
  ]);

  return {
    connected: true,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: verRes.rows[0]?.db_name || process.env.DB_NAME || 'agri19044_agrimart',
    version: verRes.rows[0]?.version || 'PostgreSQL',
    counts: {
      products: statsRes.rows[0]?.products_count ?? 0,
      categories: statsRes.rows[0]?.categories_count ?? 0,
      partnerApplications: statsRes.rows[0]?.partner_applications_count ?? 0,
      enquiries: statsRes.rows[0]?.enquiries_count ?? 0,
      cmsSettings: statsRes.rows[0]?.cms_count ?? 0,
    },
  };
}
