const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://agrimart.in';

const ASSETS = [
  // Branding & Logo
  { url: `${BASE_URL}/uploads/vendor_logo_image/logo_1.png`, dest: 'public/assets/branding/logo.png', type: 'logo', page: 'all' },
  { url: `${BASE_URL}/assests/theme_1/images/logo.png`, dest: 'public/assets/branding/logo_footer.png', type: 'logo', page: 'footer' },
  { url: `${BASE_URL}/assests/theme_1/images/icon_new.png`, dest: 'public/assets/branding/icon_new.png', type: 'icon', page: 'header' },
  { url: `${BASE_URL}/assests/theme_1/images/favicon.png`, dest: 'public/assets/branding/favicon.png', type: 'favicon', page: 'all' },

  // Banners
  { url: `${BASE_URL}/assests/theme_1/images/slides/banner-04.jpg`, dest: 'public/assets/banners/banner-04.jpg', type: 'banner', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/slides/banner-03.jpg`, dest: 'public/assets/banners/banner-03.jpg', type: 'banner', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/slides/banner-05.jpg`, dest: 'public/assets/banners/banner-05.jpg', type: 'banner', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/banner-five.jpg`, dest: 'public/assets/banners/banner-five.jpg', type: 'banner', page: 'home' },

  // Brands
  { url: `${BASE_URL}/uploads/brand_image/1/brand_3.jpg`, dest: 'public/assets/brands/kasei.jpg', type: 'brand', page: 'home' },
  { url: `${BASE_URL}/uploads/brand_image/1/brand_2.jpeg`, dest: 'public/assets/brands/oleo_mac.jpeg', type: 'brand', page: 'home' },
  { url: `${BASE_URL}/uploads/brand_image/1/brand_1.jpeg`, dest: 'public/assets/brands/agrimate.jpeg', type: 'brand', page: 'home' },
  { url: `${BASE_URL}/uploads/brand_image/1/brand_12.jpeg`, dest: 'public/assets/brands/green_panther.jpeg', type: 'brand', page: 'home' },

  // About & Services
  { url: `${BASE_URL}/assests/theme_1/images/aboutFin.png`, dest: 'public/assets/about/aboutFin.png', type: 'about', page: 'about_us' },
  { url: `${BASE_URL}/assests/theme_1/images/our_network.jpg`, dest: 'public/assets/services/our_network.jpg', type: 'service', page: 'services' },
  { url: `${BASE_URL}/assests/theme_1/images/one_india.png`, dest: 'public/assets/services/one_india.png', type: 'service', page: 'footer' },
  { url: `${BASE_URL}/assests/theme_1/images/google.png`, dest: 'public/assets/branding/google_play.png', type: 'badge', page: 'footer' },
  { url: `${BASE_URL}/assests/theme_1/images/apple.png`, dest: 'public/assets/branding/app_store.png', type: 'badge', page: 'footer' },

  // Awards & Recognition Badges
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/01.jpg`, dest: 'public/assets/awards/award_01.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/02.jpg`, dest: 'public/assets/awards/award_02.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/03.jpg`, dest: 'public/assets/awards/award_03.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/04.jpg`, dest: 'public/assets/awards/award_04.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/05.jpg`, dest: 'public/assets/awards/award_05.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/06.jpg`, dest: 'public/assets/awards/award_06.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/07.jpg`, dest: 'public/assets/awards/award_07.jpg', type: 'award', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/angrau.jpg`, dest: 'public/assets/recognition/angrau.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/ciae.jpg`, dest: 'public/assets/recognition/ciae.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/nerfmtti.jpg`, dest: 'public/assets/recognition/nerfmtti.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/nrfmtti.jpg`, dest: 'public/assets/recognition/nrfmtti.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/srfmtti.jpg`, dest: 'public/assets/recognition/srfmtti.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/tnau.jpg`, dest: 'public/assets/recognition/tnau.jpg', type: 'recognition', page: 'home' },
  { url: `${BASE_URL}/assests/theme_1/images/awards/badge/uas.jpg`, dest: 'public/assets/recognition/uas.jpg', type: 'recognition', page: 'home' }
];

async function downloadAssets() {
  const manifest = [];
  for (const item of ASSETS) {
    try {
      console.log(`Downloading ${item.dest} from ${item.url}...`);
      const dir = path.dirname(item.dest);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        fs.writeFileSync(item.dest, Buffer.from(buffer));
        manifest.push({
          sourceUrl: item.url,
          localPath: `/${item.dest.replace(/^public\//, '')}`,
          originalFilename: path.basename(item.url),
          type: item.type,
          page: item.page,
          sizeBytes: buffer.byteLength,
          downloadStatus: 'SUCCESS',
          downloadedAt: new Date().toISOString()
        });
      } else {
        console.warn(`Failed (${res.status}): ${item.url}`);
        manifest.push({
          sourceUrl: item.url,
          localPath: item.dest,
          originalFilename: path.basename(item.url),
          type: item.type,
          page: item.page,
          sizeBytes: 0,
          downloadStatus: `FAILED_${res.status}`,
          downloadedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error(`Error downloading ${item.url}:`, e.message);
      manifest.push({
        sourceUrl: item.url,
        localPath: item.dest,
        originalFilename: path.basename(item.url),
        type: item.type,
        page: item.page,
        sizeBytes: 0,
        downloadStatus: `ERROR: ${e.message}`,
        downloadedAt: new Date().toISOString()
      });
    }
  }

  // Also include the 3 downloaded PDFs
  const pdfFiles = [
    { name: 'corporate_brochure.pdf', url: 'https://agrimart.in/uploads/corporate_brochure.pdf' },
    { name: 'company_profile.pdf', url: 'https://agrimart.in/uploads/company_profile.pdf' },
    { name: 'agrimart_brochure.pdf', url: 'https://agrimart.in/uploads/agrimart_brochure.pdf' }
  ];
  for (const pdf of pdfFiles) {
    const p = `public/assets/brochures/${pdf.name}`;
    if (fs.existsSync(p)) {
      const stat = fs.statSync(p);
      manifest.push({
        sourceUrl: pdf.url,
        localPath: `/assets/brochures/${pdf.name}`,
        originalFilename: pdf.name,
        type: 'brochure',
        page: 'about_us / footer',
        sizeBytes: stat.size,
        downloadStatus: 'SUCCESS',
        downloadedAt: new Date().toISOString()
      });
    }
  }

  fs.writeFileSync('data/asset-manifest.json', JSON.stringify(manifest, null, 2));
  console.log(`Saved ${manifest.length} records to data/asset-manifest.json`);
}

downloadAssets();
