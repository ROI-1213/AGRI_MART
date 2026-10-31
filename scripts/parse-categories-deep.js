const fs = require('fs');

const html = fs.readFileSync('scripts/home_full.html', 'utf8');

// Find all cat_filter links with surrounding context
const regex = /<a[^>]*href=["'][^"']*list_product_inner\/\?cat_filter=([^"'&]+)["'][^>]*>([\s\S]*?)<\/a>/gi;

const categories = [];
let match;
while ((match = regex.exec(html)) !== null) {
  const catCode = match[1];
  let decoded = '';
  try {
    decoded = Buffer.from(catCode, 'base64').toString('utf8');
  } catch (e) {
    decoded = catCode;
  }
  const label = match[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
  if (label) {
    categories.push({ catCode, decoded, label });
  }
}

console.log('Total category links found in home_full.html:', categories.length);

// Deduplicate
const unique = [];
const seen = new Set();
for (const c of categories) {
  const key = c.decoded + '::' + c.label;
  if (!seen.has(key)) {
    seen.add(key);
    unique.push(c);
  }
}

console.log('Unique categories/subcategories found:', unique.length);
unique.forEach((u, i) => {
  console.log(`${i + 1}. [ID: ${u.decoded}] (${u.catCode}) ${u.label}`);
});

fs.writeFileSync('scripts/categories_extracted_deep.json', JSON.stringify(unique, null, 2));
