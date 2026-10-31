const fs = require('fs');

async function analyze() {
  // Let's fetch the FULL home html to a file first
  const res = await fetch('https://agrimart.in/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/home_full.html', html);

  const hrefRegex = /href=["']([^"']+)["']/g;
  const srcRegex = /src=["']([^"']+)["']/g;

  const links = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(match[1]);
  }

  const imgs = [];
  while ((match = srcRegex.exec(html)) !== null) {
    imgs.push(match[1]);
  }

  console.log('Total links:', links.length);
  const uniqueLinks = [...new Set(links)];
  const internalLinks = uniqueLinks.filter(l => l.includes('agrimart.in') || l.startsWith('/') || l.startsWith('index.php'));
  console.log('Internal links count:', internalLinks.length);
  fs.writeFileSync('scripts/extracted_links.json', JSON.stringify(internalLinks, null, 2));

  console.log('Total images:', imgs.length);
  const uniqueImgs = [...new Set(imgs)];
  fs.writeFileSync('scripts/extracted_imgs.json', JSON.stringify(uniqueImgs, null, 2));
  console.log('Unique images count:', uniqueImgs.length);
}

analyze().catch(console.error);
