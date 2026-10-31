const fs = require('fs');

const html = fs.readFileSync('scripts/product_sample_full.html', 'utf8');

// Find the product main area
// Look for product-title or RIPL038175
const idx = html.indexOf('RIPL038175');
if (idx !== -1) {
  console.log('--- AROUND RIPL038175 (-500 to +1500 chars) ---');
  console.log(html.slice(Math.max(0, idx - 500), idx + 2000));
} else {
  console.log('RIPL038175 not found directly');
}
