const fs = require('fs');

async function testLargeCategory() {
  const url = 'https://agrimart.in/index.php/home/list_product_inner/?cat_filter=OQ=='; // Brush Cutter
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/cat_brushcutter.html', html);
  console.log('Length:', html.length);

  // Check product detail links
  const prodMatches = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  const uniqueProds = [...new Set(prodMatches.map(m => m[1]))];
  console.log('Unique product URLs in category OQ==:', uniqueProds.length);

  // Check pagination links
  const pagMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*(?:list_product)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Nav links:');
  const seen = new Set();
  pagMatches.forEach(m => {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (!seen.has(m[1] + text)) {
      seen.add(m[1] + text);
      console.log(m[1], '-->', text);
    }
  });
}

testLargeCategory().catch(console.error);
