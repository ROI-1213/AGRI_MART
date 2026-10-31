const fs = require('fs');

async function testProductDetail() {
  const url = 'https://agrimart.in/index.php/home/prduct_details/MzAxOA==/MTQ2Nw==';
  console.log('Fetching sample product detail:', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/product_sample.html', html);
  console.log('Saved product_sample.html (length:', html.length, ')');

  // Let's analyze title, RIPL code, prices, tabs, images, subsidy form
  const titleMatch = html.match(/<h[12][^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h[12]>/i) ||
                     html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  console.log('Title match:', titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

  const riplMatch = html.match(/RIPL\s*([0-9A-Za-z]+)/i);
  console.log('RIPL match:', riplMatch ? riplMatch[0] : 'N/A');

  const priceMatches = [...html.matchAll(/(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{2})?)/gi)];
  console.log('Prices found:', priceMatches.map(m => m[0]));

  // Check tabs (Description, Accessories, Brochure, Video)
  const tabMatches = [...html.matchAll(/<a[^>]*data-toggle=["']tab["'][^>]*>([\s\S]*?)<\/a>/gi)];
  console.log('Tabs found:', tabMatches.map(m => m[1].replace(/<[^>]+>/g, '').trim()));

  // Check images
  const imgs = [...html.matchAll(/src=["']([^"']*(?:uploads|product)[^"']+)["']/gi)].map(m => m[1]);
  console.log('Product images found:', [...new Set(imgs)]);

  // Check PDFs / Brochures
  const pdfs = [...html.matchAll(/href=["']([^"']*\.pdf[^"']*)["']/gi)].map(m => m[1]);
  console.log('PDFs linked:', [...new Set(pdfs)]);

  // Check subsidy form
  const hasSubsidy = html.includes('Subsidy') || html.includes('subsidy');
  console.log('Has Subsidy text/form:', hasSubsidy);
}

testProductDetail();
