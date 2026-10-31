const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeFolder(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== 'brochures') { // skip PDF folder
        await optimizeFolder(fullPath);
      }
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        try {
          const originalSize = stat.size;
          if (originalSize > 50000) { // Only optimize images > 50KB
            const buffer = fs.readFileSync(fullPath);
            let pipeline = sharp(buffer);

            const metadata = await pipeline.metadata();

            // Resize massive images if needed
            if (fullPath.includes('awards') || fullPath.includes('recognition')) {
              pipeline = pipeline.resize({ width: 300, withoutEnlargement: true });
            } else if (fullPath.includes('banners')) {
              pipeline = pipeline.resize({ width: 1600, withoutEnlargement: true });
            } else if (fullPath.includes('products')) {
              pipeline = pipeline.resize({ width: 600, withoutEnlargement: true });
            }

            let optimizedBuffer;
            if (ext === '.png') {
              optimizedBuffer = await pipeline
                .png({ quality: 80, compressionLevel: 8 })
                .toBuffer();
            } else {
              optimizedBuffer = await pipeline
                .jpeg({ quality: 80, mozjpeg: true })
                .toBuffer();
            }

            if (optimizedBuffer.length < originalSize) {
              fs.writeFileSync(fullPath, optimizedBuffer);
              console.log(`Optimized ${fullPath}: ${(originalSize/1024).toFixed(1)}KB -> ${(optimizedBuffer.length/1024).toFixed(1)}KB (-${Math.round((1 - optimizedBuffer.length/originalSize)*100)}%)`);
            }
          }
        } catch (err) {
          console.warn(`Could not optimize ${fullPath}:`, err.message);
        }
      }
    }
  }
}

async function run() {
  console.log('Optimizing all website images with Sharp...');
  await optimizeFolder('public/assets');
  console.log('Image optimization finished!');
}

run();
