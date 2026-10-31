const fs = require('fs');

const listHtml = fs.readFileSync('scripts/raw_html/list_products.html', 'utf8');

// Let's search for category navigation / sidebar tree
// Usually it's an accordion or ul/li or cat_filter
const catFilterMatches = [...listHtml.matchAll(/<a[^>]*cat_filter=([^&"'>]+)[^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Total cat_filter links:', catFilterMatches.length);

const categories = [];
const seenCats = new Set();
for (const match of catFilterMatches) {
  const code = match[1];
  const name = match[2].replace(/<[^>]+>/g, '').trim();
  let decoded = '';
  try {
    decoded = Buffer.from(code, 'base64').toString('utf8');
  } catch (e) {}

  if (name && !seenCats.has(name)) {
    seenCats.add(name);
    categories.push({ name, code, decoded });
  }
}

console.log('Unique categories found via cat_filter:', categories.length);
console.log('First 20 categories:', categories.slice(0, 20));

// Let's also check for subcategories or sub_cat_filter
const subCatMatches = [...listHtml.matchAll(/<a[^>]*sub_cat_filter=([^&"'>]+)[^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Total sub_cat_filter links:', subCatMatches.length);

const subcategories = [];
const seenSubs = new Set();
for (const match of subCatMatches) {
  const code = match[1];
  const name = match[2].replace(/<[^>]+>/g, '').trim();
  let decoded = '';
  try {
    decoded = Buffer.from(code, 'base64').toString('utf8');
  } catch (e) {}

  if (name && !seenSubs.has(name)) {
    seenSubs.add(name);
    subcategories.push({ name, code, decoded });
  }
}
console.log('Unique subcategories found via sub_cat_filter:', subcategories.length);
console.log('Sample subcategories:', subcategories.slice(0, 25));

fs.writeFileSync('scripts/categories_parsed.json', JSON.stringify({ categories, subcategories }, null, 2));
