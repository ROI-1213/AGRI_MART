const fs = require('fs');
const html = fs.readFileSync('scripts/raw_html/home.html', 'utf8');

// Search for header or navbar
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
if (headerMatch) {
  console.log('--- HEADER HTML FOUND (first 2500 chars) ---');
  console.log(headerMatch[0].slice(0, 2500));
  fs.writeFileSync('scripts/header_reference.html', headerMatch[0]);
  console.log('Saved scripts/header_reference.html');
} else {
  // search for menu or navbar
  const navMatch = html.match(/<nav[\s\S]*?<\/nav>/i);
  console.log('Nav found:', !!navMatch);
}
