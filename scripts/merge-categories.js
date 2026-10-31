const fs = require('fs');

const products = JSON.parse(fs.readFileSync('data/import/products.json', 'utf8'));
const baseCategories = JSON.parse(fs.readFileSync('data/import_backup/categories.json', 'utf8'));

// Calculate count per category
const counts = {};
products.forEach(p => {
  const cat = (p.category || '').toUpperCase().trim();
  counts[cat] = (counts[cat] || 0) + 1;
});

const mergedCategories = baseCategories.map(cat => {
  const key = cat.name.toUpperCase().trim();
  const count = counts[key] || 0;
  return {
    ...cat,
    count
  };
});

fs.writeFileSync('data/import/categories.json', JSON.stringify(mergedCategories, null, 2));
console.log('Categories updated with exact counts from 227 migrated products!');
