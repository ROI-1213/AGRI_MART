const sharp = require('sharp');
const fs = require('fs');

const dir = 'public/assets/brands/partner_strip';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function main() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="90" viewBox="0 0 420 90" fill="none">
    <g transform="translate(10, 10)">
      <rect x="0" y="0" width="70" height="70" rx="14" fill="#0a5c2f" />
      <path d="M20 48 C 20 28, 42 22, 54 16 C 50 30, 42 42, 26 48 Z" fill="#ffffff"/>
      <path d="M34 54 C 34 38, 48 32, 58 26 C 54 38, 48 48, 38 54 Z" fill="#f59e0b"/>
    </g>
    <text x="96" y="44" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="28" fill="#0a5c2f" letter-spacing="1">RATNAGIRI IMPEX</text>
    <text x="98" y="66" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="13" fill="#6b7280" letter-spacing="2.5">ANNAPURNA GROUP • ESTD 2000</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(dir + '/ratnagiri_impex.png');

  console.log('Saved ratnagiri_impex.png');
}

main().catch(console.error);
