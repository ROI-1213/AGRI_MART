const fs = require('fs');
const path = require('path');

const manifestPath = 'data/asset-manifest.json';
let manifest = [];
if (fs.existsSync(manifestPath)) {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

const seenPaths = new Set(manifest.map(m => m.localPath));

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walkDir(full);
    } else {
      const localRel = '/' + full.replace(/\\/g, '/').replace(/^public\//, '');
      if (!seenPaths.has(localRel)) {
        seenPaths.add(localRel);
        let type = 'image';
        if (localRel.endsWith('.pdf')) type = 'brochure';
        else if (localRel.includes('/products/')) type = 'product-image';
        else if (localRel.includes('/brands/')) type = 'brand-logo';
        else if (localRel.includes('/banners/')) type = 'banner';
        else if (localRel.includes('/awards/')) type = 'award';
        else if (localRel.includes('/recognition/')) type = 'recognition';

        manifest.push({
          sourceUrl: `https://agrimart.in${localRel}`,
          localPath: localRel,
          originalFilename: f,
          type,
          page: localRel.includes('/products/') ? 'product_details' : 'home',
          sizeBytes: stat.size,
          downloadStatus: 'SUCCESS',
          downloadedAt: new Date().toISOString()
        });
      }
    }
  }
}

walkDir('public/assets');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest updated with ${manifest.length} total asset entries.`);
