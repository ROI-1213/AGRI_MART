const http = require('http');

const get = (path) => {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
};

const post = (path, body) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = http.request(`http://localhost:3000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

(async () => {
  console.log('--- TESTING NEW ROUTES ---');
  
  const home = await get('/');
  console.log('/ status:', home.status, 'contains become-a-partner:', home.data.includes('/become-a-partner'));

  const partner = await get('/become-a-partner');
  console.log('/become-a-partner status:', partner.status, 'contains title:', partner.data.includes('Grow Your Business'));

  const reg = await get('/partner-registration');
  console.log('/partner-registration status:', reg.status, 'contains title:', reg.data.includes('Dealership Application'));

  const admin = await get('/admin');
  console.log('/admin status:', admin.status, 'contains Dealer Applications:', admin.data.includes('Dealer Applications'));

  console.log('--- TESTING POST /api/partner-application ---');
  const testPayload = {
    fullName: 'Harish Gowda',
    email: 'harish.agro@gmail.com',
    phone: '9845112233',
    whatsapp: '9845112233',
    companyName: 'Kaveri Agro Machineries',
    businessType: 'Partnership',
    address: 'Near APMC Yard, B.M. Road',
    city: 'Hassan',
    state: 'Karnataka',
    pincode: '573201',
    yearsInBusiness: '3-5 Years',
    gstin: '29ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    categoriesOfInterest: ['INTERCULTIVATOR / POWER WEEDER', 'BRUSH CUTTER - WEED CUTTER', 'SPRAYER'],
    existingBrands: 'Local sprayers, tiller spares',
    message: 'Interested in stocking power weeders and brush cutters for coconut and arecanut belt.'
  };

  const postRes = await post('/api/partner-application', testPayload);
  console.log('API POST Response:', postRes);

  const getRes = await get('/api/partner-application');
  const parsed = JSON.parse(getRes.data);
  console.log('API GET Response count:', parsed.applications ? parsed.applications.length : 0);
  console.log('Latest application ID:', parsed.applications && parsed.applications[0] ? parsed.applications[0].id : null);
})();
