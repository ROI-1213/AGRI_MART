const fs = require('fs');

// 1. Inspect contact_us.html for form controls
const contactHtml = fs.readFileSync('scripts/raw_html/contact_us.html', 'utf8');
console.log('--- CONTACT US FORM FIELDS ---');
const selectMatches = [...contactHtml.matchAll(/<select[^>]*name=["']([^"']+)["'][^>]*>([\s\S]*?)<\/select>/gi)];
for (const match of selectMatches) {
  console.log('Select name:', match[1]);
  const options = [...match[2].matchAll(/<option[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/gi)]
    .map(o => ({ val: o[1].trim(), text: o[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(o => o.text.length > 0);
  console.log('Options count:', options.length, options.slice(0, 5));
}

// 2. Inspect list_products.html for category hierarchy and products
const listProductsHtml = fs.readFileSync('scripts/raw_html/list_products.html', 'utf8');
console.log('--- LIST PRODUCTS ANALYSIS ---');
console.log('list_products length:', listProductsHtml.length);

// 3. Inspect blogs.html
const blogsHtml = fs.readFileSync('scripts/raw_html/blogs.html', 'utf8');
console.log('--- BLOGS ANALYSIS ---');
const blogArticles = [...blogsHtml.matchAll(/<div[^>]*class=["'][^"']*blog[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
console.log('Blog divs found:', blogArticles.length);

// 4. Inspect faq.html
const faqHtml = fs.readFileSync('scripts/raw_html/faq.html', 'utf8');
console.log('--- FAQ ANALYSIS ---');
const faqItems = [...faqHtml.matchAll(/<h4[^>]*class=["'][^"']*panel-title[^"']*["']>([\s\S]*?)<\/h4>[\s\S]*?<div[^>]*class=["'][^"']*panel-body[^"']*["']>([\s\S]*?)<\/div>/gi)];
console.log('FAQ items found by panel-title:', faqItems.length);
