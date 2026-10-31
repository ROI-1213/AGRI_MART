const fs = require('fs');

const html = fs.readFileSync('scripts/cat_sample_live.html', 'utf8');

// Look for pagination
const pagMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*(?:list_product|page)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Pagination / nav links in cat_sample_live.html:');
pagMatches.forEach(m => {
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  console.log(m[1], '-->', text);
});
