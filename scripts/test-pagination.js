const fs = require('fs');

async function testPagination() {
  // Test 1: list_products/12
  console.log('Testing list_products/12...');
  const res1 = await fetch('https://agrimart.in/index.php/home/list_products/12', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html1 = await res1.text();
  const prods1 = [...html1.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  const u1 = [...new Set(prods1.map(m => m[1]))];
  console.log('list_products/12 returned unique products:', u1.length, u1.slice(0, 3));

  // Test 2: list_products/24
  console.log('Testing list_products/24...');
  const res2 = await fetch('https://agrimart.in/index.php/home/list_products/24', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html2 = await res2.text();
  const prods2 = [...html2.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  const u2 = [...new Set(prods2.map(m => m[1]))];
  console.log('list_products/24 returned unique products:', u2.length, u2.slice(0, 3));

  // Check if u1 and u2 are different products!
  const overlap = u1.filter(x => u2.includes(x));
  console.log('Overlap between page 12 and 24:', overlap.length);

  // Test 3: list_product_inner/12?cat_filter=OQ==
  console.log('Testing list_product_inner/12?cat_filter=OQ==...');
  const res3 = await fetch('https://agrimart.in/index.php/home/list_product_inner/12?cat_filter=OQ==', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html3 = await res3.text();
  const prods3 = [...html3.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  const u3 = [...new Set(prods3.map(m => m[1]))];
  console.log('list_product_inner/12?cat_filter=OQ== unique products:', u3.length, u3.slice(0, 3));
}

testPagination().catch(console.error);
