const https = require('https');

function checkAsset(path) {
  return new Promise((resolve) => {
    https.get(`https://agrimart.in${path}`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', () => resolve({ path, status: 500 }));
  });
}

(async () => {
  const candidates = [
    '/assests/theme_1/images/milking_machine.jpg',
    '/assests/theme_1/images/milking.jpg',
    '/uploads/category_image/cat_202.jpg',
    '/uploads/category_image/cat_212.jpg',
    '/uploads/category_image/cat_202.png',
    '/uploads/category_image/cat_212.png',
    '/uploads/category_image/cat_205.jpg',
    '/assests/theme_1/images/mb_plough.jpg',
    '/assests/theme_1/images/plough.jpg'
  ];

  for (const c of candidates) {
    const res = await checkAsset(c);
    if (res.status === 200) console.log('FOUND:', c);
  }
  console.log('Check finished.');
})();
