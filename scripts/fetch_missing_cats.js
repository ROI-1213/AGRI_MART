const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', (e) => resolve({ status: 500, error: e.message }));
  });
}

(async () => {
  console.log('Fetching cat 202 (MILKING MACHINE)...');
  const res1 = await fetchUrl('https://agrimart.in/index.php/home/list_product_inner/?cat_filter=MjAy');
  console.log('Status 202:', res1.status, 'len:', res1.data ? res1.data.length : 0);
  const prodMatches = (res1.data || '').match(/prduct_details\/([^"']+)/g);
  console.log('Products in 202:', prodMatches);

  // Check if there are images inside cat 202
  const imgMatches = (res1.data || '').match(/src=["']([^"']*(?:product|upload|item)[^"']*)["']/gi);
  console.log('Images in 202:', imgMatches);

  // Check home full for MB PLOUGH
  if (fs.existsSync('scripts/home_full.html')) {
    const homeHtml = fs.readFileSync('scripts/home_full.html', 'utf8');
    const mbMatches = homeHtml.match(/[^<]*PLOUGH[^<]*/gi);
    console.log('MB PLOUGH matches in home:', mbMatches);
    const catMatches = homeHtml.match(/cat_filter=([a-zA-Z0-9=]+)[^>]*>([^<]*PLOUGH[^<]*)</gi);
    console.log('MB PLOUGH catMatches:', catMatches);
  }
})();
