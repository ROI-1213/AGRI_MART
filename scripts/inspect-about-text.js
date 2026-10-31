const fs = require('fs');
const html = fs.readFileSync('scripts/raw_html/about_us.html', 'utf8');

// Find headings and paragraphs
const matches = [...html.matchAll(/<(?:h[1-6]|p)[^>]*>([\s\S]*?)<\/(?:h[1-6]|p)>/gi)];
for (const m of matches) {
  const t = m[1].replace(/<[^>]+>/g, '').trim();
  if (t.length > 25) {
    console.log(t.slice(0, 120));
  }
}
