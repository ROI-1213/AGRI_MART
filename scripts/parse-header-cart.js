const fs = require('fs');
const html = fs.readFileSync('scripts/header_reference.html', 'utf8');

console.log(html.slice(5300, 7200));
