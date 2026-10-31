const fs = require('fs');
const html = fs.readFileSync('scripts/product_sample.html', 'utf8');

const subsidyModal = html.match(/<div id="subsidyForm"[\s\S]*?<\/form>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i);
if (subsidyModal) {
  const inputs = [...subsidyModal[0].matchAll(/<label[^>]*>([\s\S]*?)<\/label>\s*<(?:input|select|textarea)[^>]*name=["']([^"']+)["']/gi)];
  console.log('Subsidy form inputs:');
  for (const inp of inputs) {
    console.log(`- ${inp[2]} (${inp[1].replace(/<[^>]+>/g, '').trim()})`);
  }
}

// Also check tabs
const tabUl = html.match(/<ul[^>]*class=["'][^"']*tabs[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i) ||
               html.match(/<ul[^>]*class=["'][^"']*nav nav-tabs[^"']*["'][^>]*>([\s\S]*?)<\/ul>/i);
if (tabUl) {
  console.log('Tabs UL:', tabUl[0]);
}
