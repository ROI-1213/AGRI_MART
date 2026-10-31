const fs = require('fs');

const html = fs.readFileSync('scripts/product_sample_full.html', 'utf8');

console.log('--- IMAGES ---');
// Look for xzoom or product images
const imgMatches = [...html.matchAll(/<img[^>]*class=["'][^"']*(?:xzoom|cloudzoom|product|img)[^"']*["'][^>]*src=["']([^"']+)["']/gi)];
console.log('Images:', imgMatches.map(m => m[1]));

// Also look for data-preview or data-source
const dataImgs = [...html.matchAll(/(?:data-source|xoriginal|data-preview)=["']([^"']+)["']/gi)];
console.log('High-res data images:', dataImgs.map(m => m[1]));

console.log('--- RIPL / MODEL / SKU ---');
const riplMatches = [...html.matchAll(/(?:RIPL|Model|SKU|Item\s*Code)[^<]{0,50}/gi)];
console.log('RIPL / Code matches:', riplMatches.map(m => m[0].trim()));

console.log('--- PRICING ---');
const priceMatches = [...html.matchAll(/(?:MRP|Price|Rs\.?|₹|INR)[^<]{0,60}/gi)];
console.log('Price matches:', priceMatches.slice(0, 10).map(m => m[0].trim()));

console.log('--- SPECIFICATIONS / TABS / ACCORDIONS ---');
const specTable = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
console.log('Tables found:', specTable.length);
if (specTable.length > 0) {
  console.log('Table 1 content sample:', specTable[0][1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300));
}

console.log('--- BROCHURES / PDFS ---');
const pdfs = [...html.matchAll(/href=["']([^"']+\.pdf)["']/gi)];
console.log('PDFs:', pdfs.map(m => m[1]));

console.log('--- VIDEOS ---');
const videos = [...html.matchAll(/(?:youtube\.com|vimeo\.com|youtu\.be)[^"'\s<>]+/gi)];
console.log('Videos:', videos.map(m => m[0]));
