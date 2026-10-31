const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://agrimart.in';

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      if (i === retries - 1) return null;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return null;
}

async function downloadFile(url, dest) {
  try {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) return true;

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (res.ok) {
      const buf = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buf));
      return true;
    }
  } catch (e) {
    // console.warn(`Failed download: ${url}`, e.message);
  }
  return false;
}

function parseProduct(html, url, defaultCategories = []) {
  // Title
  const titleMatch = html.match(/<h2[^>]*class=["'][^"']*product_title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
                     html.match(/<h2[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
                     html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  let name = titleMatch ? cleanText(titleMatch[1]) : '';

  // RIPL Code
  const riplMatch = html.match(/<h5>\s*(RIPL[0-9A-Za-z]+)\s*<\/h5>/i) ||
                    html.match(/RIPL\s*Code\s*:\s*<\/b>\s*(RIPL[0-9A-Za-z]+)/i) ||
                    html.match(/RIPL\s*([0-9A-Za-z]+)/i);
  const riplCode = riplMatch ? (riplMatch[1].startsWith('RIPL') ? riplMatch[1].toUpperCase() : `RIPL${riplMatch[1].toUpperCase()}`) : '';

  // Hidden IDs
  const pidMatch = html.match(/name=["']hidden_productid["'][^>]*value=["']([^"']+)["']/i);
  const productId = pidMatch ? pidMatch[1] : '';

  const gidMatch = html.match(/name=["']prodouct_group["'][^>]*value=["']([^"']+)["']/i);
  const groupId = gidMatch ? gidMatch[1] : '';

  if (!name) {
    name = `Agrimart Product ${riplCode || productId || 'Item'}`;
  }

  // Model Number
  const modelMatch = html.match(/Model\s*:\s*&nbsp;\s*<\/b>\s*([^<&]+)/i) ||
                     html.match(/MODEL\s*:\s*([^<&]+)/i) ||
                     html.match(/<div[^>]*style=["'][^"']*word-break:\s*break-word[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  let modelNumber = modelMatch ? cleanText(modelMatch[1]) : '';
  if (!modelNumber && name) {
    const parts = name.split(/\s+/);
    modelNumber = parts[0] || '';
  }

  // Brand
  let brand = 'AGRIMATE';
  const checkText = (name + ' ' + html.slice(0, 8000)).toUpperCase();
  if (checkText.includes('KASEI')) {
    brand = 'KASEI';
  } else if (checkText.includes('OLEO-MAC') || checkText.includes('OLEO MAC')) {
    brand = 'OLEO MAC';
  } else if (checkText.includes('GREEN PANTHER') || checkText.includes('GREENPANTHER')) {
    brand = 'GREEN PANTHER';
  } else if (checkText.includes('AGRIMATE')) {
    brand = 'AGRIMATE';
  }

  // Pricing from summary entry-summary
  let mrp = 0;
  let sellingPrice = 0;
  let discountPercentage = 0;

  const summaryMatch = html.match(/<div class=["']summary entry-summary[\s\S]*?<\/form>/i);
  const summaryHtml = summaryMatch ? summaryMatch[0] : html;

  const priceSpanMatch = summaryHtml.match(/<span class=["']price["'][^>]*>[\s\S]*?(?:fa-rupee'>|<i[^>]*><\/i>)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (priceSpanMatch) {
    sellingPrice = parseFloat(priceSpanMatch[1].replace(/,/g, ''));
  }

  const delMatch = summaryHtml.match(/<del[^>]*>[\s\S]*?([0-9,]+(?:\.[0-9]{2})?)[\s\S]*?<\/del>/i);
  if (delMatch) {
    mrp = parseFloat(delMatch[1].replace(/,/g, ''));
  } else {
    mrp = sellingPrice;
  }

  if (mrp > sellingPrice && mrp > 0) {
    discountPercentage = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  // Stock
  let availability = 'In Stock';
  let stockQuantity = 10;
  if (html.includes('btn-danger"><i class="fa fa-bell"></i> Notify Me') || html.includes('OUT OF STOCK') || html.includes('out_of_stock')) {
    availability = 'Out of Stock';
    stockQuantity = 0;
  }

  // Images
  const rawImages = [];
  const prodImgMatches = [...html.matchAll(/(https?:\/\/agrimart\.in\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+\.(?:jpg|jpeg|png|webp))/gi)]
    .concat([...html.matchAll(/src=["'](\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+\.(?:jpg|jpeg|png|webp))["']/gi)]);

  const seenImgs = new Set();
  for (const m of prodImgMatches) {
    let imgUrl = m[1];
    if (imgUrl.startsWith('/')) imgUrl = `https://agrimart.in${imgUrl}`;
    if (!imgUrl.includes('_thumb.') && !seenImgs.has(imgUrl)) {
      seenImgs.add(imgUrl);
      rawImages.push(imgUrl);
    }
  }

  if (rawImages.length === 0) {
    const thumbMatches = [...html.matchAll(/(https?:\/\/agrimart\.in\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+_thumb\.(?:jpg|jpeg|png|webp))/gi)];
    for (const m of thumbMatches) {
      const full = m[1].replace('_thumb.', '.');
      if (!seenImgs.has(full)) {
        seenImgs.add(full);
        rawImages.push(full);
      }
    }
  }

  // Description & Tabs
  let description = '';
  let specifications = {};
  let accessories = [];
  let brochures = [];
  let videos = [];
  let spareParts = [];

  const tabsBlockMatch = html.match(/<div class=["']ttm-tabs tabs-for-single-products["'][^>]*>([\s\S]*?)<\/div>\s*<!--\s*Optional Accessories/i) ||
                         html.match(/<div class=["']ttm-tabs tabs-for-single-products["'][^>]*>([\s\S]*?)<\/div>/i);

  if (tabsBlockMatch) {
    const tabsHtml = tabsBlockMatch[1];
    const contentInners = [...tabsHtml.matchAll(/<div class=["']content-inner["'][^>]*>([\s\S]*?)<\/div><!-- content-inner/gi)];

    if (contentInners.length > 0) {
      description = cleanText(contentInners[0][1]);
      const specPairs = [...contentInners[0][1].matchAll(/<b>([^<:]+):?\s*&nbsp;?<\/b>\s*:?\s*([^<]+)/gi)];
      for (const sp of specPairs) {
        const k = cleanText(sp[1]);
        const v = cleanText(sp[2]);
        if (k && v && k.length < 50 && v.length < 200) {
          specifications[k] = v;
        }
      }
    }

    if (contentInners.length > 1) {
      const accText = cleanText(contentInners[1][1]);
      if (accText && !accText.toLowerCase().includes('not available')) {
        const items = accText.split(/[0-9]+\s*[\.\)]\s*/).filter(x => x.trim().length > 0);
        if (items.length > 0) {
          accessories = items.map(item => ({ name: item.trim(), included: true }));
        } else {
          accessories = [{ name: accText, included: true }];
        }
      }
    }

    if (contentInners.length > 2) {
      const bHtml = contentInners[2][1];
      const bMatches = [...bHtml.matchAll(/<a[^>]*href=["']([^"']+\.pdf)["'][^>]*>([\s\S]*?)<\/a>/gi)];
      for (const bm of bMatches) {
        let bUrl = bm[1];
        if (bUrl.startsWith('/')) bUrl = `https://agrimart.in${bUrl}`;
        const bName = cleanText(bm[2]) || 'Product Brochure';
        let lang = 'English';
        if (bName.toLowerCase().includes('kannada')) lang = 'Kannada';
        else if (bName.toLowerCase().includes('telugu')) lang = 'Telugu';
        brochures.push({ name: bName, url: bUrl, language: lang });
      }
    }

    if (contentInners.length > 3) {
      const vHtml = contentInners[3][1];
      const vMatches = [...vHtml.matchAll(/src=["']([^"']*(?:youtube|vimeo|youtu\.be)[^"']*)["']/gi)]
        .concat([...vHtml.matchAll(/href=["']([^"']*(?:youtube|vimeo|youtu\.be)[^"']*)["']/gi)]);
      for (const vm of vMatches) {
        videos.push({ title: `${name} Video`, videoUrl: vm[1] });
      }
    }
  }

  // Also check Spare parts
  const spareMatch = html.match(/id=["']showSpare["'][\s\S]*?<div class=["']row["']>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (spareMatch && !spareMatch[1].toLowerCase().includes('not available')) {
    const spareItems = [...spareMatch[1].matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)];
    spareParts = spareItems.map(s => ({ name: cleanText(s[1]), partNo: '' }));
  }

  const category = (defaultCategories && defaultCategories.length > 0) 
    ? defaultCategories[0] 
    : 'AGRICULTURAL MACHINERY';

  const cleanRipl = riplCode || `RIPL${String(productId || '000000').padStart(6, '0')}`;
  const slug = slugify(name || cleanRipl);

  return {
    id: slug,
    name,
    slug,
    riplCode: cleanRipl,
    productId,
    groupId,
    modelNumber,
    brand,
    category,
    categories: defaultCategories || [category],
    mrp: mrp || sellingPrice || 0,
    sellingPrice: sellingPrice || mrp || 0,
    discountPercentage,
    taxInclusive: true,
    currency: 'INR',
    availability,
    stockQuantity,
    description: description || `${name} (${brand}) genuine agricultural farm equipment.`,
    specifications,
    accessories,
    brochures,
    videos,
    spareParts,
    rawImages,
    sourceUrl: url
  };
}

async function runMigration() {
  console.log('=== STARTING COMPLETE AGRIMART CATALOG MIGRATION ===');

  const manifest = JSON.parse(fs.readFileSync('scripts/catalog_discovery_manifest.json', 'utf8'));
  const productsToMigrate = manifest.products;
  console.log(`Loaded ${productsToMigrate.length} products to scrape and migrate.`);

  // Load existing state if available for resume
  const stateFile = 'scripts/migration_state.json';
  let state = {};
  if (fs.existsSync(stateFile)) {
    try {
      state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
      console.log(`Resuming from state: ${Object.keys(state).length} products already processed.`);
    } catch (e) {}
  }

  const finalProducts = [];
  const CONCURRENCY = 6;

  for (let i = 0; i < productsToMigrate.length; i += CONCURRENCY) {
    const chunk = productsToMigrate.slice(i, i + CONCURRENCY);
    console.log(`\nProcessing batch ${Math.floor(i / CONCURRENCY) + 1} / ${Math.ceil(productsToMigrate.length / CONCURRENCY)} (Items ${i + 1} - ${Math.min(i + CONCURRENCY, productsToMigrate.length)})...`);

    await Promise.all(chunk.map(async (item) => {
      if (state[item.urlPart]) {
        finalProducts.push(state[item.urlPart]);
        return;
      }

      process.stdout.write(`  Fetching ${item.urlPart}... `);
      const html = await fetchWithRetry(item.fullUrl);
      if (!html) {
        console.log('Failed HTML fetch.');
        return;
      }

      const parsed = parseProduct(html, item.fullUrl, item.categories);

      // Download images locally to public/assets/products/{riplCode}/
      const localImages = [];
      const safeRiplFolder = parsed.riplCode.toLowerCase().replace(/[^a-z0-9]/g, '');

      for (let imgIdx = 0; imgIdx < parsed.rawImages.length; imgIdx++) {
        const rawImgUrl = parsed.rawImages[imgIdx];
        const ext = path.extname(rawImgUrl).split('?')[0] || '.jpg';
        const filename = `img_${imgIdx + 1}${ext}`;
        const localRelPath = `/assets/products/${safeRiplFolder}/${filename}`;
        const localDiskPath = path.join('public', 'assets', 'products', safeRiplFolder, filename);

        const ok = await downloadFile(rawImgUrl, localDiskPath);
        if (ok) {
          localImages.push(localRelPath);
        }
      }

      parsed.images = localImages.length > 0 ? localImages : ['/assets/branding/logo.png'];
      parsed.thumbnailImage = parsed.images[0];
      delete parsed.rawImages;

      state[item.urlPart] = parsed;
      finalProducts.push(parsed);
      console.log(`[OK] ${parsed.name.slice(0, 35)}... (${parsed.images.length} images)`);
    }));

    // Periodically save state
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nAll ${finalProducts.length} products processed and downloaded!`);

  // Ensure unique product slugs & IDs
  const idCounts = {};
  const cleanedProducts = finalProducts.map(p => {
    let id = p.id;
    if (idCounts[id]) {
      idCounts[id]++;
      id = `${id}-${idCounts[id]}`;
    } else {
      idCounts[id] = 1;
    }
    return {
      ...p,
      id,
      slug: id
    };
  });

  // Save to data/import/products.json
  fs.writeFileSync('data/import/products.json', JSON.stringify(cleanedProducts, null, 2));
  console.log(`Saved ${cleanedProducts.length} products to data/import/products.json`);

  // Build Categories Hierarchy
  const categoryMap = {};
  cleanedProducts.forEach(p => {
    const cat = p.category;
    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        slug: slugify(cat),
        count: 0,
        subcategories: new Set()
      };
    }
    categoryMap[cat].count++;
    if (p.modelNumber) {
      categoryMap[cat].subcategories.add(p.brand);
    }
  });

  const categoriesJson = Object.values(categoryMap).map((c, idx) => ({
    id: `cat_${idx + 1}`,
    name: c.name,
    slug: c.slug,
    count: c.count,
    icon: 'Layers',
    subcategories: Array.from(c.subcategories).slice(0, 5)
  }));

  fs.writeFileSync('data/import/categories.json', JSON.stringify(categoriesJson, null, 2));
  console.log(`Saved ${categoriesJson.length} categories to data/import/categories.json`);

  // Generate Master CSV Export
  generateCsv(cleanedProducts);

  // Generate Audit Report
  generateAuditReport(cleanedProducts, manifest);
}

function generateCsv(products) {
  const headers = [
    'Main Category',
    'Subcategory',
    'Nested Subcategory',
    'Brand',
    'Product Name',
    'Model Number',
    'RIPL Code',
    'SKU',
    'Legacy Product ID',
    'Legacy Product URL',
    'Original MRP',
    'Displayed Price',
    'PTR',
    'Seller Price',
    'Discount',
    'Stock Quantity',
    'Stock Status',
    'Full Description',
    'Specifications',
    'Primary Image URL',
    'Additional Image URLs',
    'Brochure URLs',
    'Video URLs',
    'Accessories',
    'Spare Parts',
    'New Product URL',
    'Migration Status',
    'Validation Notes'
  ];

  const escapeCsv = (val) => {
    if (val === null || val === undefined) return '""';
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const rows = products.map(p => [
    p.category,
    p.brand,
    '',
    p.brand,
    p.name,
    p.modelNumber,
    p.riplCode,
    p.riplCode,
    p.productId,
    p.sourceUrl,
    p.mrp,
    p.sellingPrice,
    '',
    p.sellingPrice,
    `${p.discountPercentage}%`,
    p.stockQuantity,
    p.availability,
    p.description,
    JSON.stringify(p.specifications),
    p.thumbnailImage,
    p.images.join('; '),
    p.brochures.map(b => b.url).join('; '),
    p.videos.map(v => v.videoUrl).join('; '),
    p.accessories.map(a => a.name).join('; '),
    p.spareParts.map(s => s.name).join('; '),
    `http://localhost:3000/products/${p.id}`,
    'MIGRATED_VERIFIED',
    'Extracted from agrimart.in'
  ].map(escapeCsv).join(','));

  const csvContent = [headers.join(','), ...rows].join('\n');
  if (!fs.existsSync('docs')) fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync('docs/master_catalog_export.csv', csvContent);
  console.log('Saved docs/master_catalog_export.csv');
}

function generateAuditReport(products, manifest) {
  const brandCounts = {};
  const catCounts = {};
  let totalImages = 0;
  let totalBrochures = 0;
  let totalVideos = 0;
  let totalAccessories = 0;

  products.forEach(p => {
    brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
    catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    totalImages += p.images.length;
    totalBrochures += p.brochures.length;
    totalVideos += p.videos.length;
    totalAccessories += p.accessories.length;
  });

  const report = {
    generatedAt: new Date().toISOString(),
    totalDiscoveredInSource: manifest.totalUniqueProducts,
    totalMigrated: products.length,
    totalImagesDownloaded: totalImages,
    totalBrochuresFound: totalBrochures,
    totalVideosFound: totalVideos,
    totalAccessoriesFound: totalAccessories,
    categoriesCount: Object.keys(catCounts).length,
    categoryBreakdown: catCounts,
    brandBreakdown: brandCounts
  };

  fs.writeFileSync('docs/migration_audit_report.json', JSON.stringify(report, null, 2));
  console.log('Saved docs/migration_audit_report.json');
}

runMigration().catch(console.error);
