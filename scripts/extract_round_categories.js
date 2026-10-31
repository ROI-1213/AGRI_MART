const sharp = require('sharp');
const fs = require('fs');

async function main() {
  const src = 'C:/Users/LENOVO/.gemini/antigravity/brain/57b9500b-65c2-44b7-a6bc-347198713be4/.user_uploaded/media_1793337220011_410806b7.png';
  const outDir = 'public/assets/categories/showcase_cards';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const R = 78;
  const D = R * 2;
  const maskSvg = Buffer.from(`<svg width="${D}" height="${D}"><circle cx="${R}" cy="${R}" r="${R}" fill="#fff"/></svg>`);

  const centers = [
    { name: 'rotavator', cx: 116, cy: 295 },
    { name: 'pumpset', cx: 309, cy: 295 },
    { name: 'chainsaw', cx: 502, cy: 295 },
    { name: 'woodchipper', cx: 696, cy: 295 },
    { name: 'intercultivator', cx: 890, cy: 295 }
  ];

  for (const c of centers) {
    const rawCrop = await sharp(src)
      .extract({ left: c.cx - R, top: c.cy - R, width: D, height: D })
      .png()
      .toBuffer();

    await sharp(rawCrop)
      .composite([{ input: maskSvg, blend: 'dest-in' }])
      .png()
      .toFile(outDir + '/' + c.name + '_round_clean.png');

    console.log('Created ' + c.name + '_round_clean.png');
  }
}

main().catch(console.error);
