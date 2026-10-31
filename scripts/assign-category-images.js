const fs = require('fs');

const products = JSON.parse(fs.readFileSync('data/import/products.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('data/import/categories.json', 'utf8'));

const updated = categories.map(cat => {
  const matchingProds = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase());
  const count = matchingProds.length;
  const image = matchingProds.length > 0 && matchingProds[0].thumbnailImage 
    ? matchingProds[0].thumbnailImage 
    : '/assets/branding/logo.png';

  return {
    ...cat,
    count,
    image
  };
});

fs.writeFileSync('data/import/categories.json', JSON.stringify(updated, null, 2));
console.log('Categories updated with counts and genuine product thumbnail images!');
