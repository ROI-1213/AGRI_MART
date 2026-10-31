const fs = require('fs');

const listHtml = fs.readFileSync('scripts/raw_html/list_products.html', 'utf8');

// Search for product items in list_products.html
const productCards = [...listHtml.matchAll(/<div[^>]*class=["'][^"']*product-item[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gi)];
console.log('product-item matches:', productCards.length);

// Also search for general card or product-card
const proBoxes = [...listHtml.matchAll(/<div[^>]*class=["'][^"']*ttm-box-view-overlay[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
console.log('ttm-box matches:', proBoxes.length);

// Search for RIPL codes
const riplMatches = [...listHtml.matchAll(/RIPL[0-9A-Za-z]+/gi)];
console.log('Total RIPL occurrences:', riplMatches.length);
const uniqueRipl = [...new Set(riplMatches.map(m => m[0]))];
console.log('Unique RIPL codes in list_products:', uniqueRipl.length, uniqueRipl.slice(0, 15));

// Check prices
const priceMatches = [...listHtml.matchAll(/(?:₹|Rs\.?|INR)\s*([0-9,]+(?:\.[0-9]{2})?)/gi)];
console.log('Total price occurrences:', priceMatches.length);

// Find all product detail links
const detailLinks = [...listHtml.matchAll(/href=["']([^"']*\/home\/prduct_details\/[^"']+)["']/gi)].map(m => m[1]);
console.log('Total product detail links:', detailLinks.length);
const uniqueDetailLinks = [...new Set(detailLinks)];
console.log('Unique product detail links:', uniqueDetailLinks.length);
console.log('Sample detail links:', uniqueDetailLinks.slice(0, 10));

fs.writeFileSync('scripts/product_links.json', JSON.stringify(uniqueDetailLinks, null, 2));
