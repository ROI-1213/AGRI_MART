const fs = require('fs');

const PDFs = [
  { name: 'corporate_brochure.pdf', url: 'https://agrimart.in/uploads/corporate_brochure.pdf' },
  { name: 'company_profile.pdf', url: 'https://agrimart.in/uploads/company_profile.pdf' },
  { name: 'agrimart_brochure.pdf', url: 'https://agrimart.in/uploads/agrimart_brochure.pdf' }
];

async function checkPDFs() {
  for (const pdf of PDFs) {
    try {
      console.log(`Checking ${pdf.name} from ${pdf.url}...`);
      const res = await fetch(pdf.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      console.log(`Status: ${res.status}, Content-Type: ${res.headers.get('content-type')}, Length: ${res.headers.get('content-length')}`);
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const localPath = `public/assets/brochures/${pdf.name}`;
        fs.writeFileSync(localPath, Buffer.from(buffer));
        console.log(`Downloaded ${pdf.name} (${buffer.byteLength} bytes) to ${localPath}`);
      }
    } catch (e) {
      console.error(`Error downloading ${pdf.name}:`, e.message);
    }
  }
}

checkPDFs();
