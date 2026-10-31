const fs = require('fs');
const html = fs.readFileSync('scripts/header_reference.html', 'utf8');

// Find after cat_menu_list
const catListEnd = html.indexOf('</ul', html.indexOf('cat_menu_list'));
console.log('--- AFTER CAT MENU LIST ---');
console.log(html.slice(catListEnd, catListEnd + 3000));
