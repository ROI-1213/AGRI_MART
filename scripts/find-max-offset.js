const fs = require('fs');

async function findMaxOffset() {
  for (let offset = 216; offset <= 300; offset += 12) {
    const url = `https://agrimart.in/index.php/home/list_products/${offset}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const prods = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
    const u = [...new Set(prods.map(m => m[1]))];
    console.log(`Offset ${offset}: ${u.length} products`);
    if (u.length === 0) {
      console.log(`Offset ${offset} returned 0 products. Reached end!`);
      break;
    }
  }
}

findMaxOffset().catch(console.error);
