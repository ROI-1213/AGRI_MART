const fs = require('fs');
const path = require('path');

const categories = JSON.parse(fs.readFileSync('data/import/categories.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('data/import/products.json', 'utf8'));

const destDir = path.join(process.cwd(), 'public', 'assets', 'categories');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map each category to its best representative product
const showcase = [];

categories.forEach((cat, index) => {
  const matching = products.filter(p => 
    p.categoryId === cat.id || 
    (p.category && p.category.toLowerCase().trim() === cat.name.toLowerCase().trim())
  );

  let selectedProduct = null;
  let storedImagePath = null;
  let status = 'VERIFIED';
  let riplCode = null;
  let prodName = null;
  let sourceImg = null;
  let sourceProdUrl = null;

  if (matching.length > 0) {
    // Pick the best product with an existing image file
    for (const p of matching) {
      const img = p.imageUrl || (p.images && p.images[0]);
      if (img && img.startsWith('/assets/products/')) {
        const localPath = path.join(process.cwd(), 'public', img);
        if (fs.existsSync(localPath)) {
          selectedProduct = p;
          break;
        }
      }
    }

    if (!selectedProduct) selectedProduct = matching[0];

    const sourceRel = selectedProduct.imageUrl || (selectedProduct.images && selectedProduct.images[0]);
    riplCode = selectedProduct.riplCode || selectedProduct.id;
    prodName = selectedProduct.name;
    sourceImg = sourceRel;
    sourceProdUrl = selectedProduct.sourceUrl || `https://agrimart.in/index.php/home/prduct_details/${selectedProduct.id}`;

    if (sourceRel && sourceRel.startsWith('/assets/products/')) {
      const ext = path.extname(sourceRel) || '.jpg';
      const destFilename = `${cat.slug}${ext}`;
      const destPath = path.join(destDir, destFilename);
      const srcPath = path.join(process.cwd(), 'public', sourceRel);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        storedImagePath = `/assets/categories/${destFilename}`;
      } else {
        storedImagePath = sourceRel;
      }
    } else {
      storedImagePath = sourceRel || '/assets/branding/logo.png';
    }
  } else {
    // No accessible product in live catalog for this category
    status = 'NO_ACTIVE_SOURCE_PRODUCTS';
    storedImagePath = '/assets/branding/logo.png';
    prodName = 'Catalog Update Pending';
  }

  showcase.push({
    order: index + 1,
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    route: `/products?category=${encodeURIComponent(cat.name)}`,
    sourceCategoryId: cat.sourceId || cat.id,
    sourceCategoryUrl: `https://agrimart.in/index.php/home/list_product_inner/?cat_filter=${cat.catCode || ''}`,
    representativeProduct: prodName,
    riplCode: riplCode,
    originalProductUrl: sourceProdUrl,
    originalImageUrl: sourceImg,
    storedImagePath: storedImagePath,
    verificationStatus: status,
    productCount: matching.length
  });
});

fs.writeFileSync(
  path.join(process.cwd(), 'data', 'import', 'category_showcase_manifest.json'),
  JSON.stringify(showcase, null, 2)
);

console.log('Processed', showcase.length, 'categories for showcase.');
showcase.forEach(s => {
  console.log(`${s.order}. ${s.name} -> ${s.storedImagePath} (${s.verificationStatus}) [${s.productCount} prods]`);
});
