const fs = require('fs');

async function checkHighOffset() {
  const url = 'https://agrimart.in/index.php/home/list_products/216';
  console.log('Fetching', url);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  const prods = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  const u = [...new Set(prods.map(m => m[1]))];
  console.log('Unique products at offset 216:', u.length);

  const pagLinks = [...html.matchAll(/<a[^>]*href=["']([^"']*list_products\/[0-9]+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Pagination links on offset 216:');
  const seen = new Set();
  pagLinks.forEach(m => {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      console.log(m[1], '-->', text);
    }
  });
}

checkHighOffset().catch(console.error);
