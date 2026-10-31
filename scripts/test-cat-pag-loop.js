const fs = require('fs');

async function testCatPagination() {
  for (let offset = 0; offset <= 100; offset += 12) {
    const url = offset === 0 
      ? `https://agrimart.in/index.php/home/list_product_inner/?cat_filter=OQ==`
      : `https://agrimart.in/index.php/home/list_product_inner/${offset}?cat_filter=OQ==`;
    
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const prods = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
    const u = [...new Set(prods.map(m => m[1]))];
    console.log(`Cat OQ== Offset ${offset}: ${u.length} products`, u.slice(0, 2));
    if (u.length === 0) break;
  }
}

testCatPagination().catch(console.error);
