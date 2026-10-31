const fs = require('fs');
const html = fs.readFileSync('scripts/header_reference.html', 'utf8');

console.log('--- ENTIRE HEADER REFERENCE LENGTH ---', html.length);

// Extract the navbar / menubar part
const menuMatch = html.match(/<div class="ttm-menubar[\s\S]*?<\/header>/i) ||
                  html.match(/<div class="site-header-menu[\s\S]*?<\/header>/i) ||
                  html.match(/<nav[\s\S]*?<\/header>/i);

if (menuMatch) {
  console.log('--- MENU SNIPPET ---');
  console.log(menuMatch[0].slice(0, 3000));
} else {
  console.log(html.slice(1500, 4500));
}
