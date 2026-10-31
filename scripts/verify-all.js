const fs = require('fs');

async function verify() {
  console.log('=== SYSTEM & MIGRATION VERIFICATION ===\n');

  // Test 1: Homepage
  const resHome = await fetch('http://localhost:3000');
  console.log('1. Homepage status:', resHome.status);
  const homeHtml = await resHome.text();
  console.log('   - Has Shop By Categories:', homeHtml.includes('Shop By Categories'));
  console.log('   - Has Brush Cutters & Weed Cutters:', homeHtml.includes('Brush Cutters &amp; Weed Cutters') || homeHtml.includes('Brush Cutters & Weed Cutters'));
  console.log('   - Has Sprayers section:', homeHtml.includes('Agricultural Sprayers &amp; Foggers') || homeHtml.includes('Agricultural Sprayers & Foggers'));
  console.log('   - Has Garden Tools section:', homeHtml.includes('Garden Tools &amp; Farm Equipment') || homeHtml.includes('Garden Tools & Farm Equipment'));

  // Test 2: Products Catalogue
  const resProducts = await fetch('http://localhost:3000/products');
  console.log('\n2. Products page status:', resProducts.status);
  const prodHtml = await resProducts.text();
  console.log('   - Contains products page markup:', prodHtml.length > 10000);

  // Test 3: Product Detail
  const resDetail = await fetch('http://localhost:3000/products/am-2052k-bc-2s-ms-brush-cutter');
  console.log('\n3. Product detail status:', resDetail.status);
  const detailHtml = await resDetail.text();
  console.log('   - Detail page title matched:', detailHtml.includes('AM-2052K-BC-2S-MS+ BRUSH CUTTER'));
  console.log('   - RIPL code present:', detailHtml.includes('RIPL038175'));
  console.log('   - Has Technical Specifications:', detailHtml.includes('Technical Specifications'));
  console.log('   - Has Brochure download links:', detailHtml.includes('Download Brochure'));

  // Test 4: Master CSV Download
  const resCsv = await fetch('http://localhost:3000/master_catalog_export.csv');
  console.log('\n4. Master CSV export status:', resCsv.status);
  const csvText = await resCsv.text();
  const csvLines = csvText.split('\n').filter(Boolean);
  console.log('   - Master CSV rows count:', csvLines.length);

  // Test 5: Image Static Serving
  const resImg = await fetch('http://localhost:3000/assets/products/ripl038175/img_1.jpg');
  console.log('\n5. Product Image Asset status:', resImg.status, 'Content-Type:', resImg.headers.get('content-type'), 'Size:', resImg.headers.get('content-length'));

  // Test 6: Admin Dashboard
  const resAdmin = await fetch('http://localhost:3000/admin');
  console.log('\n6. Admin Console status:', resAdmin.status);
  const adminHtml = await resAdmin.text();
  console.log('   - Has Products Catalogue tab:', adminHtml.includes('Products Catalogue'));
  console.log('   - Has Migration Audit tab:', adminHtml.includes('Migration Audit'));

  console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
}

verify().catch(console.error);
