const https = require('https');

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
  console.log('Fetching cat 212 (MB PLOUGH)...');
  const res = await fetchUrl('https://agrimart.in/index.php/home/list_product_inner/?cat_filter=MjEy');
  console.log('Status 212:', res.status, 'len:', res.data ? res.data.length : 0);
  const prodMatches = (res.data || '').match(/prduct_details\/([^"']+)/g);
  console.log('Products in 212:', prodMatches);
})();
