async function checkImagesHealth() {
  console.log('=== VERIFYING IMAGES HEALTH ON HOMEPAGE & PRODUCTS ===');
  
  const urlsToCheck = [
    'http://localhost:3000',
    'http://localhost:3000/products',
    'http://localhost:3000/products/am-2052k-bc-2s-ms-brush-cutter'
  ];

  const foundImages = new Set();

  for (const pageUrl of urlsToCheck) {
    const res = await fetch(pageUrl);
    const html = await res.text();
    const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
    for (const m of matches) {
      foundImages.add(m[1]);
    }
  }

  console.log(`Found ${foundImages.size} unique image sources rendered across key pages.`);
  let failed = 0;

  for (const imgSrc of foundImages) {
    if (imgSrc.startsWith('data:')) continue;
    const fullUrl = imgSrc.startsWith('http') ? imgSrc : `http://localhost:3000${imgSrc}`;
    try {
      const res = await fetch(fullUrl);
      if (res.status !== 200) {
        console.error(`[IMAGE FAIL ${res.status}] ${imgSrc}`);
        failed++;
      }
    } catch (e) {
      console.error(`[IMAGE ERROR] ${imgSrc}:`, e.message);
      failed++;
    }
  }

  if (failed === 0) {
    console.log(`[ALL ${foundImages.size} IMAGES OK 200] Zero broken images found!`);
  } else {
    console.warn(`${failed} images failed to load.`);
  }
}

checkImagesHealth().catch(console.error);
