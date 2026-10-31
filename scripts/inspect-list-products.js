const fs = require('fs');

const html = fs.existsSync('scripts/raw_html/list_products.html') 
  ? fs.readFileSync('scripts/raw_html/list_products.html', 'utf8')
  : '';

console.log('list_products.html length:', html.length);

// Extract all prduct_details links
const prodMatches = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
console.log('Total prduct_details matches:', prodMatches.length);

const unique = [...new Set(prodMatches.map(m => m[1]))];
console.log('Unique products in list_products.html:', unique.length);

// Check pagination in list_products.html
const pagMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*(?:list_products|page)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Pagination / nav links in list_products.html:');
pagMatches.forEach(m => {
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  console.log(m[1], '-->', text);
});
