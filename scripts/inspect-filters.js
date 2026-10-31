const fs = require('fs');

const html = fs.readFileSync('scripts/cat_sample_live.html', 'utf8');

// Find all filter-related links or forms or inputs
const filterLinks = [...html.matchAll(/<a[^>]*href=["']([^"']*(?:filter|cat|product)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Total filter/product links:', filterLinks.length);

const interesting = filterLinks.filter(m => 
  !m[1].includes('theme_1') && 
  !m[1].includes('css') && 
  !m[1].includes('js') &&
  (m[1].includes('cat_filter') || m[1].includes('sub') || m[1].includes('brand') || m[1].includes('list_product'))
);

console.log('Interesting links:');
const seen = new Set();
interesting.forEach(m => {
  const url = m[1];
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  const key = url + '::' + text;
  if (!seen.has(key)) {
    seen.add(key);
    console.log(url, '-->', text);
  }
});
