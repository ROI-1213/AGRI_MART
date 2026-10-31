const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://agrimart.in';

const PAGES_TO_FETCH = [
  { name: 'home', url: `${BASE_URL}/` },
  { name: 'list_products', url: `${BASE_URL}/index.php/home/list_products` },
  { name: 'about_us', url: `${BASE_URL}/index.php/home/about_us` },
  { name: 'services', url: `${BASE_URL}/index.php/home/services` },
  { name: 'blogs', url: `${BASE_URL}/index.php/home/blogs` },
  { name: 'contact_us', url: `${BASE_URL}/index.php/home/contact_us` },
  { name: 'faq', url: `${BASE_URL}/index.php/home/faq` },
  { name: 'privacy_policy', url: `${BASE_URL}/index.php/home/cms/privacy_policy` },
  { name: 'terms_and_conditions', url: `${BASE_URL}/index.php/home/terms_and_conditions` },
  { name: 'legal_notice', url: `${BASE_URL}/index.php/home/cms/legal_notice` },
  { name: 'disclaimer', url: `${BASE_URL}/index.php/home/cms/disclaimer` },
  { name: 'warranty', url: `${BASE_URL}/index.php/home/cms/warranty` },
  { name: 'become_a_partner', url: `${BASE_URL}/index.php/home/cms/become_a_partner` },
  { name: 'buy_earn_rent', url: `${BASE_URL}/index.php/home/cms/buy_earn_rent` },
  { name: 'knowledge_bank', url: `${BASE_URL}/index.php/home/cms/knowledge_bank` },
  { name: 'dealer_register', url: `${BASE_URL}/index.php/home/dealer_register` },
  { name: 'user_login', url: `${BASE_URL}/index.php/login/user_login` },
  { name: 'vendor_login', url: `${BASE_URL}/index.php/vendor/user_login` },
  { name: 'view_cart', url: `${BASE_URL}/index.php/home/view_cart` }
];

async function fetchPage(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) {
      console.warn(`Failed to fetch ${url}: status ${res.status}`);
      return null;
    }
    return await res.text();
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('Starting Agrimart crawl...');
  if (!fs.existsSync('scripts/raw_html')) {
    fs.mkdirSync('scripts/raw_html', { recursive: true });
  }

  const sitemap = [];

  for (const page of PAGES_TO_FETCH) {
    console.log(`Fetching ${page.name} (${page.url})...`);
    const html = await fetchPage(page.url);
    if (html) {
      fs.writeFileSync(`scripts/raw_html/${page.name}.html`, html);
      sitemap.push({
        name: page.name,
        url: page.url,
        status: 'FETCHED',
        sizeBytes: html.length,
        discoveredAt: new Date().toISOString()
      });
    } else {
      sitemap.push({
        name: page.name,
        url: page.url,
        status: 'FAILED',
        sizeBytes: 0,
        discoveredAt: new Date().toISOString()
      });
    }
  }

  fs.writeFileSync('docs/reference-sitemap.json', JSON.stringify(sitemap, null, 2));
  console.log(`Saved ${sitemap.length} sitemap records to docs/reference-sitemap.json`);
}

run();
