const fs = require('fs');
const html = fs.readFileSync('scripts/product_sample.html', 'utf8');

const tabPanes = [...html.matchAll(/<div[^>]*class=["'][^"']*content-tab[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
console.log('Tab panes found:', tabPanes.length);
tabPanes.forEach((p, idx) => {
  console.log(`Pane ${idx}:`, p[1].replace(/<[^>]+>/g, ' ').trim().slice(0, 150));
});

// Check brochure tab specifically
const brochureIndex = html.indexOf('product_brochure');
if (brochureIndex !== -1) {
  console.log('--- BROCHURE SECTION ---');
  console.log(html.slice(brochureIndex - 100, brochureIndex + 500));
}
