const sharp = require('sharp');
const path = require('path');

async function build7AwardsShowcase() {
  const width = 2400;
  const height = 1100;

  // Let's take the clean backdrop (or crop sky & tea field + stone platform)
  // From awards_showcase_hd.png
  // Top region (y: 0..380): Sky, morning sun, "Awards" header, laurel branches, subtitle
  // Bottom region (y: 860..1024): Stone ledge & foreground leaves
  const baseImg = 'public/assets/awards/awards_showcase_hd.png';

  const topHeader = await sharp(baseImg)
    .extract({ left: 0, top: 0, width: 2048, height: 380 })
    .resize(width, 390, { fit: 'fill' })
    .toBuffer();

  const bottomLedge = await sharp(baseImg)
    .extract({ left: 0, top: 850, width: 2048, height: 174 })
    .resize(width, 240, { fit: 'fill' })
    .toBuffer();

  // Middle tea field / stone wall transition
  // Create a clean background by sampling left and right edges
  const leftTea = await sharp(baseImg)
    .extract({ left: 0, top: 350, width: 350, height: 520 })
    .resize(width / 2, 520, { fit: 'fill' })
    .toBuffer();

  const rightTea = await sharp(baseImg)
    .extract({ left: 1700, top: 350, width: 348, height: 520 })
    .resize(width / 2, 520, { fit: 'fill' })
    .toBuffer();

  // Create base canvas
  const canvas = sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 245, g: 249, b: 245 }
    }
  });

  // Calculate 7 cards geometry
  // Card height: 470px. Card width: 264px (ratio: 264/470 = 0.56)
  const cardW = 264;
  const cardH = 470;
  const gap = 32;
  const totalCardsW = 7 * cardW + 6 * gap; // 7*264 + 192 = 2040px
  const startX = Math.round((width - totalCardsW) / 2); // (2400 - 2040) / 2 = 180px
  const cardY = 370;

  const cardFiles = [
    'award_card_1_round.png',
    'award_card_2_round.png',
    'award_card_3_round.png',
    'award_card_4_round.png',
    'award_card_5_round.png',
    'award_card_6_round.png',
    'award_card_7_round.png'
  ];

  const compositeOps = [
    // Top header
    { input: topHeader, top: 0, left: 0 },
    // Middle tea field background
    { input: leftTea, top: 370, left: 0 },
    { input: rightTea, top: 370, left: width / 2 },
    // Bottom stone ledge
    { input: bottomLedge, top: height - 240, left: 0 }
  ];

  // Add 7 resized cards
  for (let i = 0; i < 7; i++) {
    const cardBuffer = await sharp('public/assets/awards/' + cardFiles[i])
      .resize(cardW, cardH, { fit: 'fill' })
      .toBuffer();

    compositeOps.push({
      input: cardBuffer,
      top: cardY,
      left: startX + i * (cardW + gap)
    });
  }

  await canvas
    .composite(compositeOps)
    .png({ quality: 100 })
    .toFile('public/assets/awards/awards_showcase_7_hd.png');

  console.log('Successfully generated awards_showcase_7_hd.png (2400x1100)');
  console.log('Coordinates:', { cardW, cardH, gap, startX, cardY, totalCardsW });
}

build7AwardsShowcase().catch(console.error);
