const fs = require('fs');

async function testCat() {
  const url = 'https://agrimart.in/index.php/home/list_product_inner/?cat_filter=OQ==';
  console.log('Fetching Brush cutter category:', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/cat_sample.html', html);
  console.log('Saved cat_sample.html (length:', html.length, ')');

  // Let's find product links and subcategory links
  const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
  const proLinks = [...new Set(links.filter(l => l.includes('/home/prduct_details/')))];
  console.log('Product detail links found in category:', proLinks.length);
  console.log('Links:', proLinks);

  const subCatLinks = [...html.matchAll(/sub_cat_filter=([^&"'>]+)/gi)].map(m => m[1]);
  console.log('Subcategory filters found in cat:', [...new Set(subCatLinks)]);
}

testCat();
