const fs = require('fs');

const html = fs.readFileSync('scripts/cat_brushcutter.html', 'utf8');

// Look for subcategory or sub_cat or dropdowns or filters or accordions
const subMatches = [...html.matchAll(/(?:sub_cat|subcategory|subcat|sub_category)[^"'>\s]*/gi)];
console.log('Sub matches in html:', subMatches.length, subMatches.slice(0, 10).map(m => m[0]));

// Look for any input checkboxes, selects, or lists in the sidebar
const sidebarMatches = [...html.matchAll(/<div[^>]*class=["'][^"']*(?:sidebar|filter|widget|category)[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
console.log('Sidebar divs:', sidebarMatches.length);

// Also look for "sub" in links
const allLinks = [...html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
const possibleSubLinks = allLinks.filter(m => 
  m[1].includes('sub') || 
  m[2].toLowerCase().includes('petrol') || 
  m[2].toLowerCase().includes('stroke') ||
  m[2].toLowerCase().includes('electric')
);

console.log('Possible subcategory links:', possibleSubLinks.length);
possibleSubLinks.slice(0, 20).forEach(m => {
  console.log(m[1], '-->', m[2].replace(/<[^>]+>/g, '').trim());
});
