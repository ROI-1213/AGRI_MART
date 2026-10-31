const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const manifest = require('../data/import/category_showcase_manifest.json');

const outDir = 'public/assets/categories/round_badges';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const PASTEL_RGB = [
  { r: 253, g: 242, b: 234 }, // Peach
  { r: 233, g: 245, b: 253 }, // Sky blue
  { r: 235, g: 248, b: 238 }, // Mint green
  { r: 254, g: 248, b: 234 }, // Cream
  { r: 237, g: 248, b: 238 }, // Sage green
  { r: 243, g: 235, b: 249 }, // Lavender
  { r: 255, g: 240, b: 245 }, // Rose
  { r: 232, g: 247, b: 240 }, // Seafoam
];

function createCircleBuffer(D, color) {
  const R = D / 2;
  const buf = Buffer.alloc(D * D * 4);
  for (let y = 0; y < D; y++) {
    for (let x = 0; x < D; x++) {
      const idx = (y * D + x) * 4;
      const dx = x + 0.5 - R;
      const dy = y + 0.5 - R;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= R - 0.5) {
        buf[idx] = color.r;
        buf[idx + 1] = color.g;
        buf[idx + 2] = color.b;
        buf[idx + 3] = 255;
      } else if (dist <= R + 0.5) {
        const factor = (R + 0.5 - dist);
        buf[idx] = color.r;
        buf[idx + 1] = color.g;
        buf[idx + 2] = color.b;
        buf[idx + 3] = Math.floor(factor * 255);
      } else {
        buf[idx + 3] = 0;
      }
    }
  }
  return buf;
}

// Special pre-extracted clean images for the 5 categories from reference image
const SPECIAL_CARDS = {
  'ROTAVATOR': 'public/assets/categories/showcase_cards/rotavator_circle_clean.png',
  'PUMPSET': 'public/assets/categories/showcase_cards/pumpset_circle_clean.png',
  'CHAIN SAW': 'public/assets/categories/showcase_cards/chainsaw_circle_clean.png',
  'WOOD CHIPPER': 'public/assets/categories/showcase_cards/woodchipper_circle_clean.png',
  'INTERCULTIVATOR/POWER WEEDER': 'public/assets/categories/showcase_cards/intercultivator_circle_clean.png',
};

async function processCategory(cat, index) {
  const slug = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const outFile = path.join(outDir, `${slug}.png`);
  const color = PASTEL_RGB[index % PASTEL_RGB.length];
  const D = 220;

  // If we have the special high-res cutout from the reference image, use it directly!
  if (SPECIAL_CARDS[cat.name] && fs.existsSync(SPECIAL_CARDS[cat.name])) {
    await sharp(SPECIAL_CARDS[cat.name])
      .resize(D, D, { fit: 'inside' })
      .png()
      .toFile(outFile);
    return `/assets/categories/round_badges/${slug}.png`;
  }

  const rawPath = path.join('public', cat.storedImagePath);
  if (!fs.existsSync(rawPath)) {
    console.warn(`File missing for ${cat.name}: ${rawPath}`);
    return null;
  }

  try {
    const raw = await sharp(rawPath).raw().toBuffer({ resolveWithObject: true });
    const { data, info } = raw;
    const rgba = Buffer.alloc(info.width * info.height * 4);

    for (let i = 0, j = 0; i < data.length; i += info.channels, j += 4) {
      const r = data[i], g = data[i+1], b = data[i+2];
      rgba[j] = r; rgba[j+1] = g; rgba[j+2] = b;
      // White or near-white background removal
      if (r > 240 && g > 240 && b > 240) {
        rgba[j+3] = 0;
      } else {
        rgba[j+3] = 255;
      }
    }

    const machine = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
      .trim()
      .resize(165, 165, { fit: 'inside' })
      .png()
      .toBuffer();

    const mMeta = await sharp(machine).metadata();
    const circleRaw = createCircleBuffer(D, color);
    const circleBuffer = await sharp(circleRaw, { raw: { width: D, height: D, channels: 4 } }).png().toBuffer();

    await sharp(circleBuffer)
      .composite([
        {
          input: machine,
          left: Math.floor((D - mMeta.width) / 2),
          top: Math.floor((D - mMeta.height) / 2)
        }
      ])
      .png()
      .toFile(outFile);

    return `/assets/categories/round_badges/${slug}.png`;
  } catch (err) {
    console.error(`Error processing ${cat.name}:`, err.message);
    return null;
  }
}

async function main() {
  const results = [];
  for (let i = 0; i < manifest.length; i++) {
    const cat = manifest[i];
    const badgePath = await processCategory(cat, i);
    results.push({
      ...cat,
      roundBadgePath: badgePath || cat.storedImagePath
    });
  }

  fs.writeFileSync(
    'data/import/category_round_manifest.json',
    JSON.stringify(results, null, 2)
  );

  console.log(`Successfully generated all ${results.length} round badges!`);
}

main().catch(console.error);
