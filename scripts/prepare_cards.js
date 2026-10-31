const sharp = require('sharp');

async function roundCorners() {
  const cards = [
    'award_card_1.png', 
    'award_card_2.png', 
    'award_card_3.png', 
    'award_card_4.png',
    'award_card_5.png',
    'award_card_6.png',
    'award_card_7.png'
  ];
  const w = 600;
  const h = 1073;
  const r = 36; // rounded corner radius in 600x1073

  const maskSvg = Buffer.from(
    `<svg width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="white" /></svg>`
  );

  for (const c of cards) {
    const inputPath = 'public/assets/awards/' + c;
    const outputPath = 'public/assets/awards/' + c.replace('.png', '_round.png');
    
    await sharp(inputPath)
      .composite([{
        input: maskSvg,
        blend: 'dest-in'
      }])
      .png({ quality: 100 })
      .toFile(outputPath);
      
    console.log('Rounded:', outputPath);
  }
}

roundCorners();
