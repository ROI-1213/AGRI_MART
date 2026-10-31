const http = require('http');
const fs = require('fs');

const get = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
};

(async () => {
  console.log('--- 1. VERIFYING HOMEPAGE & SECTION POSITIONING ---');
  const home = await get('/');
  console.log('Homepage status:', home.status);

  const heroPos = home.data.indexOf('hero_reliable_equipment');
  const shopCatPos = home.data.indexOf('Shop by Category');
  const growthPos = home.data.indexOf('Agrimart Growth &amp; Opportunities') !== -1 
    ? home.data.indexOf('Agrimart Growth &amp; Opportunities') 
    : home.data.indexOf('Agrimart Growth & Opportunities');
  const brandsPos = home.data.indexOf('Our Trusted International &amp; In-House Brands') !== -1 
    ? home.data.indexOf('Our Trusted International &amp; In-House Brands') 
    : home.data.indexOf('Our Trusted International & In-House Brands');

  console.log('Position indices:');
  console.log('  Hero Slider:', heroPos);
  console.log('  Shop by Category:', shopCatPos);
  console.log('  Growth & Opportunities:', growthPos);
  console.log('  Trusted Brands:', brandsPos);

  const orderCorrect = (heroPos < shopCatPos) && (shopCatPos < brandsPos);
  console.log('Positioning is valid (Below Hero & Above Brands):', orderCorrect);

  console.log('--- 2. VERIFYING ALL 28 CATEGORIES ---');
  const manifest = JSON.parse(fs.readFileSync('data/import/category_showcase_manifest.json', 'utf8'));
  console.log('Total categories in manifest:', manifest.length);

  let missingOnPage = 0;
  manifest.forEach(cat => {
    const found = home.data.includes(cat.name) || home.data.includes(cat.slug);
    if (!found) {
      console.log('Missing category on homepage:', cat.name);
      missingOnPage++;
    }
  });
  console.log('Missing categories on page:', missingOnPage);

  console.log('--- 3. TESTING SAMPLE CATEGORY NAVIGATION ---');
  const sampleCat = manifest[1]; // Brush Cutter
  const catUrl = sampleCat.route;
  console.log('Testing category route:', catUrl);
  const catPage = await get(catUrl);
  console.log('Category page status:', catPage.status, 'contains products:', catPage.data.includes('BRUSH CUTTER'));

  console.log('--- 4. CHECKING ABSENCE OF FORBIDDEN CONTROLS ---');
  const categorySectionHtml = home.data.slice(shopCatPos, brandsPos);
  const hasAddToCart = categorySectionHtml.toLowerCase().includes('add to cart');
  const hasWishlist = categorySectionHtml.toLowerCase().includes('wishlist');
  const hasPrice = categorySectionHtml.includes('₹') || categorySectionHtml.toLowerCase().includes('inr');
  console.log('Has Add to Cart in ShopByCategory:', hasAddToCart);
  console.log('Has Wishlist in ShopByCategory:', hasWishlist);
  console.log('Has Price in ShopByCategory:', hasPrice);

  console.log('Verification completed successfully!');
})();
