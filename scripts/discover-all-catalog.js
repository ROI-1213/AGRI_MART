const fs = require('fs');

const BASE_URL = 'https://agrimart.in';

const CATEGORIES = [
  { id: '1', code: 'MQ==', name: 'BLOWER - MISTBLOWER' },
  { id: '9', code: 'OQ==', name: 'BRUSH CUTTER - WEED CUTTER' },
  { id: '23', code: 'MjM=', name: 'CHAFF CUTTER / SHREDDER' },
  { id: '11', code: 'MTE=', name: 'CHAIN SAW' },
  { id: '19', code: 'MTk=', name: 'EARTH AUGER' },
  { id: '166', code: 'MTY2', name: 'ENGINE' },
  { id: '15', code: 'MTU=', name: 'FOGGER ULV & THERMAL' },
  { id: '27', code: 'Mjc=', name: 'GARDEN TOOLS & SPRAYERS' },
  { id: '37', code: 'Mzc=', name: 'HARVESTER' },
  { id: '21', code: 'MjE=', name: 'HEDGETRIMMER' },
  { id: '42', code: 'NDI=', name: 'INTERCULTIVATOR/POWER WEEDER' },
  { id: '193', code: 'MTkz', name: 'IRRIGATION' },
  { id: '29', code: 'Mjk=', name: 'LAWN MOWER' },
  { id: '235', code: 'MjM1', name: 'LUBRICANTS' },
  { id: '201', code: 'MjAx', name: 'MANUAL SEEDER' },
  { id: '202', code: 'MjAy', name: 'MILKING  MACHINE' },
  { id: '154', code: 'MTU0', name: 'POWER CUTTER' },
  { id: '4', code: 'NA==', name: 'PRUNER' },
  { id: '48', code: 'NDg=', name: 'PRESSURE WASHER' },
  { id: '159', code: 'MTU5', name: 'PUMPSET' },
  { id: '51', code: 'NTE=', name: 'REAPER / HARVESTER' },
  { id: '189', code: 'MTg5', name: 'ROTAVATOR' },
  { id: '6', code: 'Ng==', name: 'SPRAYER' },
  { id: '221', code: 'MjIx', name: 'STUBBLE MOWER' },
  { id: '217', code: 'MjE3', name: 'THRESHER' },
  { id: '156', code: 'MTU2', name: 'TRANSPORTER' },
  { id: '223', code: 'MjIz', name: 'WOOD CHIPPER' },
];

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  return null;
}

function extractProductLinks(html) {
  const matches = [...html.matchAll(/prduct_details\/([A-Za-z0-9=+\/]+)\/([A-Za-z0-9=+\/]+)/gi)];
  const products = [];
  const seen = new Set();
  for (const m of matches) {
    const fullKey = `${m[1]}/${m[2]}`;
    if (!seen.has(fullKey)) {
      seen.add(fullKey);
      let prodId = '';
      let groupId = '';
      try {
        prodId = Buffer.from(m[1], 'base64').toString('utf8');
        groupId = Buffer.from(m[2], 'base64').toString('utf8');
      } catch (e) {}
      products.push({
        urlPart: fullKey,
        fullUrl: `${BASE_URL}/index.php/home/prduct_details/${fullKey}`,
        prodId,
        groupId
      });
    }
  }
  return products;
}

async function discoverAll() {
  console.log('--- STARTING COMPREHENSIVE CATALOG DISCOVERY ---');
  const allDiscovered = new Map(); // key -> product object
  const categorySummary = {};

  // Part 1: Crawl each of the 27 categories with pagination
  for (const cat of CATEGORIES) {
    console.log(`\nDiscovering Category: ${cat.name} (${cat.id} - ${cat.code})`);
    categorySummary[cat.name] = { id: cat.id, code: cat.code, products: [] };
    let offset = 0;
    while (true) {
      const url = offset === 0 
        ? `${BASE_URL}/index.php/home/list_product_inner/?cat_filter=${cat.code}`
        : `${BASE_URL}/index.php/home/list_product_inner/${offset}?cat_filter=${cat.code}`;

      process.stdout.write(`  Fetching offset ${offset}... `);
      const html = await fetchWithRetry(url);
      if (!html) {
        console.log('Failed to fetch, stopping category.');
        break;
      }

      const found = extractProductLinks(html);
      console.log(`found ${found.length} products`);

      if (found.length === 0) {
        break;
      }

      let newInThisPage = 0;
      for (const p of found) {
        if (!allDiscovered.has(p.urlPart)) {
          allDiscovered.set(p.urlPart, {
            ...p,
            categories: [cat.name]
          });
          newInThisPage++;
        } else {
          const existing = allDiscovered.get(p.urlPart);
          if (!existing.categories.includes(cat.name)) {
            existing.categories.push(cat.name);
          }
        }
        categorySummary[cat.name].products.push(p.urlPart);
      }

      // If fewer than 12 products were on the page, it's the last page
      if (found.length < 12) {
        break;
      }

      offset += 12;
      // Sleep slightly to be polite to the server
      await new Promise(r => setTimeout(r, 200));
    }
  }

  // Part 2: Crawl list_products pagination (0 to 228)
  console.log('\n--- CRAWLING GENERAL list_products CATALOG ---');
  let genOffset = 0;
  while (true) {
    const url = genOffset === 0 
      ? `${BASE_URL}/index.php/home/list_products`
      : `${BASE_URL}/index.php/home/list_products/${genOffset}`;

    process.stdout.write(`Fetching list_products offset ${genOffset}... `);
    const html = await fetchWithRetry(url);
    if (!html) {
      console.log('Failed to fetch, stopping general catalog.');
      break;
    }

    const found = extractProductLinks(html);
    console.log(`found ${found.length} products`);
    if (found.length === 0) break;

    for (const p of found) {
      if (!allDiscovered.has(p.urlPart)) {
        allDiscovered.set(p.urlPart, {
          ...p,
          categories: ['Uncategorized']
        });
      }
    }

    if (found.length < 12) break;
    genOffset += 12;
    await new Promise(r => setTimeout(r, 200));
  }

  const catalogArray = Array.from(allDiscovered.values());
  console.log('\n=========================================');
  console.log(`TOTAL UNIQUE PRODUCTS DISCOVERED: ${catalogArray.length}`);
  console.log('=========================================');

  fs.writeFileSync('scripts/catalog_discovery_manifest.json', JSON.stringify({
    discoveredAt: new Date().toISOString(),
    totalUniqueProducts: catalogArray.length,
    categorySummary,
    products: catalogArray
  }, null, 2));

  console.log('Saved manifest to scripts/catalog_discovery_manifest.json');
}

discoverAll().catch(console.error);
