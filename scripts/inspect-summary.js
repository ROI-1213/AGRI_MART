const fs = require('fs');

const html = fs.readFileSync('scripts/product_sample_full.html', 'utf8');

// Look specifically inside entry-summary or col-lg-6 for price
const summaryMatch = html.match(/<div class=["']summary entry-summary[\s\S]*?<\/form>/i);
if (summaryMatch) {
  console.log('--- SUMMARY BLOCK ---');
  console.log(summaryMatch[0]);
}
