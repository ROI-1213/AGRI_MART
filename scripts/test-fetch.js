const fs = require('fs');

async function testFetch() {
  try {
    const res = await fetch('https://agrimart.in/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML Length:', html.length);
    fs.writeFileSync('scripts/home_sample.html', html.slice(0, 50000));
    console.log('Sample saved to scripts/home_sample.html');
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testFetch();
