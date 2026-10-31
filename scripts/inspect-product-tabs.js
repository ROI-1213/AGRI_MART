const fs = require('fs');

const html = fs.readFileSync('scripts/product_sample_full.html', 'utf8');

console.log('--- AROUND INDEX 58763 (-200 to +2500) ---');
console.log(html.slice(58563, 61500));
