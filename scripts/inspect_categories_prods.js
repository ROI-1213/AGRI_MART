const fs = require('fs');

const cats = JSON.parse(fs.readFileSync('data/import/categories.json', 'utf8'));
const prods = JSON.parse(fs.readFileSync('data/import/products.json', 'utf8'));

console.log('Categories count:', cats.length);
cats.forEach((c, idx) => {
  const match = prods.filter(p => 
    p.categoryId === c.id || 
    (p.category && p.category.toLowerCase().trim() === c.name.toLowerCase().trim()) ||
    (c.aliases && c.aliases.some(a => p.category && p.category.toLowerCase().includes(a.toLowerCase())))
  );
  const sample = match[0];
  console.log(`${idx + 1}. [${c.id}] "${c.name}" -> ${match.length} prods. Sample: ${sample ? `${sample.name} (${sample.riplCode || sample.id}) - img: ${sample.imageUrl || (sample.images && sample.images[0])}` : 'NONE'}`);
});
