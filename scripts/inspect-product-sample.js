const fs = require('fs');

async function inspectProductPage() {
  const url = 'https://agrimart.in/index.php/home/prduct_details/MzUyNg==/MTc2Mg==';
  console.log('Fetching product page:', url);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  fs.writeFileSync('scripts/product_sample_full.html', html);
  console.log('Product page length:', html.length);

  // Look for breadcrumb
  const breadcrumb = [...html.matchAll(/<ol[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/ol>/gi)]
    .concat([...html.matchAll(/<ul[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>([\s\S]*?)<\/ul>/gi)]);
  
  if (breadcrumb.length > 0) {
    console.log('Breadcrumb:', breadcrumb[0][1].replace(/<[^>]+>/g, ' > ').replace(/\s+/g, ' ').trim());
  } else {
    console.log('No standard breadcrumb found. Searching for title and meta...');
  }

  // Check title
  const title = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .concat([...html.matchAll(/<h2[^>]*class=["'][^"']*product[^"']*["'][^>]*>([\s\S]*?)<\/h2>/gi)]);
  console.log('Title matches:', title.map(m => m[1].replace(/<[^>]+>/g, '').trim()));

  // Look for tabs: specifications, accessories, brochure, video, spares
  const tabs = [...html.matchAll(/<a[^>]*href=["']#([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Tabs / hash links:');
  tabs.forEach(m => console.log(' #', m[1], '-->', m[2].replace(/<[^>]+>/g, '').trim()));
}

inspectProductPage().catch(console.error);
