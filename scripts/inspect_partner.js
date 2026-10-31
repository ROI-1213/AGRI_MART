const fs = require('fs');

const partnerHtml = fs.readFileSync('scripts/raw_html/become_a_partner.html', 'utf8');
console.log('--- PARTNER IMAGES ---');
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let m;
while ((m = imgRegex.exec(partnerHtml)) !== null) {
  if (m[1].includes('become') || m[1].includes('dealer') || m[1].includes('partner')) {
    console.log('Partner IMG:', m[1]);
  }
}

const dealerHtml = fs.readFileSync('scripts/raw_html/dealer_register.html', 'utf8');
console.log('--- DEALER INPUTS ---');
const inputRegex = /<input[^>]+name=["']([^"']+)["'][^>]*>/gi;
while ((m = inputRegex.exec(dealerHtml)) !== null) {
  console.log('Input:', m[1]);
}
const selectRegex = /<select[^>]+name=["']([^"']+)["'][^>]*>/gi;
while ((m = selectRegex.exec(dealerHtml)) !== null) {
  console.log('Select:', m[1]);
}
