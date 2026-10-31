async function testAllRoutes() {
  const routes = [
    '/',
    '/products',
    '/products?category=BRUSH+CUTTER+-+WEED+CUTTER',
    '/products?brand=KASEI',
    '/products?search=sprayer',
    '/about',
    '/services',
    '/contact',
    '/admin',
    '/cart',
    '/checkout',
    '/faq',
    '/disclaimer',
    '/legal-notice',
    '/privacy-policy',
    '/terms',
    '/warranty',
    '/cms/become-a-partner',
    '/cms/buy-earn-rent',
    '/master_catalog_export.csv'
  ];

  console.log('=== TESTING ALL APPLICATION ROUTES ===');
  let failures = 0;

  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:3000${r}`);
      if (res.status === 200) {
        console.log(`[PASS 200] ${r}`);
      } else {
        console.error(`[FAIL ${res.status}] ${r}`);
        failures++;
      }
    } catch (e) {
      console.error(`[ERROR] ${r}:`, e.message);
      failures++;
    }
  }

  // Also test 5 sample product detail pages
  const sampleProducts = [
    '/products/am-2052k-bc-2s-ms-brush-cutter',
    '/products/bv-250-blower-handheld',
    '/products/am-cs-6022k-pro-agrimate-chain-saw-22-bar',
    '/products/am-5300ea-2s-ms-drill-agrimate-earth-auger-with-8-drill-bit',
    '/products/am-bsdp-20l-lbt-lithium-battery-sprayer-double-pump-2-in-1'
  ];

  console.log('\n=== TESTING SAMPLE PRODUCT DETAIL PAGES ===');
  for (const pr of sampleProducts) {
    try {
      const res = await fetch(`http://localhost:3000${pr}`);
      if (res.status === 200) {
        console.log(`[PASS 200] ${pr}`);
      } else {
        console.log(`[STATUS ${res.status}] ${pr} (checking fallback or slug)`);
      }
    } catch (e) {
      console.error(`[ERROR] ${pr}:`, e.message);
    }
  }

  console.log(`\nRoute test finished with ${failures} failure(s).`);
}

testAllRoutes().catch(console.error);
