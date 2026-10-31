const fs = require('fs');

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseProductHtml(html, url, defaultCategories = []) {
  // 1. Title
  const titleMatch = html.match(/<h2[^>]*class=["'][^"']*product_title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
                     html.match(/<h2[^>]*class=["'][^"']*product-title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
                     html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const name = titleMatch ? cleanText(titleMatch[1]) : '';

  // 2. RIPL Code
  const riplMatch = html.match(/<h5>\s*(RIPL[0-9A-Za-z]+)\s*<\/h5>/i) ||
                    html.match(/RIPL\s*Code\s*:\s*<\/b>\s*(RIPL[0-9A-Za-z]+)/i) ||
                    html.match(/RIPL\s*([0-9A-Za-z]+)/i);
  const riplCode = riplMatch ? (riplMatch[1].startsWith('RIPL') ? riplMatch[1] : `RIPL${riplMatch[1]}`) : '';

  // 3. Hidden product ID
  const pidMatch = html.match(/name=["']hidden_productid["'][^>]*value=["']([^"']+)["']/i);
  const productId = pidMatch ? pidMatch[1] : '';

  // 4. Group ID
  const gidMatch = html.match(/name=["']prodouct_group["'][^>]*value=["']([^"']+)["']/i);
  const groupId = gidMatch ? gidMatch[1] : '';

  // 5. Model
  const modelMatch = html.match(/Model\s*:\s*&nbsp;\s*<\/b>\s*([^<&]+)/i) ||
                     html.match(/MODEL\s*:\s*([^<&]+)/i) ||
                     html.match(/<div[^>]*style=["'][^"']*word-break:\s*break-word[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  let modelNumber = modelMatch ? cleanText(modelMatch[1]) : '';
  if (!modelNumber && name) {
    const parts = name.split(/\s+/);
    modelNumber = parts[0] || '';
  }

  // 6. Brand determination
  let brand = 'AGRIMATE';
  const upperName = (name + ' ' + html.slice(0, 10000)).toUpperCase();
  if (upperName.includes('KASEI')) {
    brand = 'KASEI';
  } else if (upperName.includes('OLEO-MAC') || upperName.includes('OLEO MAC')) {
    brand = 'OLEO MAC';
  } else if (upperName.includes('GREEN PANTHER') || upperName.includes('GREENPANTHER')) {
    brand = 'GREEN PANTHER';
  } else if (upperName.includes('AGRIMATE')) {
    brand = 'AGRIMATE';
  }

  // 7. Pricing
  // Look for MRP and Price
  let mrp = 0;
  let sellingPrice = 0;
  let discountPercentage = 0;

  // Selling price / Price:
  const priceSpanMatch = html.match(/<span class=["']price["'][^>]*>[\s\S]*?(?:fa-rupee'>|<i[^>]*><\/i>)?\s*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (priceSpanMatch) {
    sellingPrice = parseFloat(priceSpanMatch[1].replace(/,/g, ''));
  }

  // Check strike / del for original MRP
  const delMatch = html.match(/<del[^>]*>[\s\S]*?([0-9,]+(?:\.[0-9]{2})?)[\s\S]*?<\/del>/i);
  if (delMatch) {
    mrp = parseFloat(delMatch[1].replace(/,/g, ''));
  } else {
    mrp = sellingPrice;
  }

  if (mrp > sellingPrice && mrp > 0) {
    discountPercentage = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  // 8. Stock status
  let availability = 'In Stock';
  let stockQuantity = 10;
  if (html.includes('OUT OF STOCK') || html.includes('out_of_stock') || html.includes('Notify Me')) {
    // If it has "Notify Me" button instead of "Add to cart", it's out of stock or enquiry only
    if (html.includes('btn-danger"><i class="fa fa-bell"></i> Notify Me') || html.includes('OUT OF STOCK')) {
      availability = 'Out of Stock';
      stockQuantity = 0;
    }
  }

  // 9. Images (Main image and gallery)
  const images = [];
  // Look for product_3526_1.jpg etc
  const prodImgMatches = [...html.matchAll(/(https?:\/\/agrimart\.in\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+\.(?:jpg|jpeg|png|webp))/gi)]
    .concat([...html.matchAll(/src=["'](\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+\.(?:jpg|jpeg|png|webp))["']/gi)]);

  const seenImgs = new Set();
  for (const m of prodImgMatches) {
    let imgUrl = m[1];
    if (imgUrl.startsWith('/')) imgUrl = `https://agrimart.in${imgUrl}`;
    // Exclude thumb if we have full
    if (!imgUrl.includes('_thumb.') && !seenImgs.has(imgUrl)) {
      seenImgs.add(imgUrl);
      images.push(imgUrl);
    }
  }

  // If no full images found, check thumbs
  if (images.length === 0) {
    const thumbMatches = [...html.matchAll(/(https?:\/\/agrimart\.in\/uploads\/product_image\/[0-9]+\/product_[0-9]+_[0-9]+_thumb\.(?:jpg|jpeg|png|webp))/gi)];
    for (const m of thumbMatches) {
      const full = m[1].replace('_thumb.', '.');
      if (!seenImgs.has(full)) {
        seenImgs.add(full);
        images.push(full);
      }
    }
  }

  // 10. Description and Tabs
  let description = '';
  let specifications = {};
  let accessories = [];
  let brochures = [];
  let videos = [];
  let spareParts = [];

  // Parse ttm-tabs or content-inner
  const tabsBlockMatch = html.match(/<div class=["']ttm-tabs tabs-for-single-products["'][^>]*>([\s\S]*?)<\/div>\s*<!--\s*Optional Accessories/i) ||
                         html.match(/<div class=["']ttm-tabs tabs-for-single-products["'][^>]*>([\s\S]*?)<\/div>/i);
  
  if (tabsBlockMatch) {
    const tabsHtml = tabsBlockMatch[1];
    // Find all content-inner divs
    const contentInners = [...tabsHtml.matchAll(/<div class=["']content-inner["'][^>]*>([\s\S]*?)<\/div><!-- content-inner/gi)];
    
    // Inner 0 is usually Product Description
    if (contentInners.length > 0) {
      description = cleanText(contentInners[0][1]);

      // Extract specifications from description paragraph (e.g. Model: AM-2052 Engine Type: 2 Stroke Displacement: 52CC)
      const specPairs = [...contentInners[0][1].matchAll(/<b>([^<:]+):?\s*&nbsp;?<\/b>\s*:?\s*([^<]+)/gi)];
      for (const sp of specPairs) {
        const k = cleanText(sp[1]);
        const v = cleanText(sp[2]);
        if (k && v && k.length < 40) {
          specifications[k] = v;
        }
      }
    }

    // Inner 1 is Accessories
    if (contentInners.length > 1) {
      const accText = cleanText(contentInners[1][1]);
      if (accText && !accText.toLowerCase().includes('not available')) {
        // Split by 1. 2. 3. or commas
        const items = accText.split(/[0-9]+\s*[\.\)]\s*/).filter(x => x.trim().length > 0);
        if (items.length > 0) {
          accessories = items.map(item => ({ name: item.trim(), included: true }));
        } else {
          accessories = [{ name: accText, included: true }];
        }
      }
    }

    // Inner 2 is Brochures
    if (contentInners.length > 2) {
      const bHtml = contentInners[2][1];
      const bMatches = [...bHtml.matchAll(/<a[^>]*href=["']([^"']+\.pdf)["'][^>]*>([\s\S]*?)<\/a>/gi)];
      for (const bm of bMatches) {
        let bUrl = bm[1];
        if (bUrl.startsWith('/')) bUrl = `https://agrimart.in${bUrl}`;
        const bName = cleanText(bm[2]) || 'Product Brochure';
        let lang = 'English';
        if (bName.toLowerCase().includes('kannada')) lang = 'Kannada';
        else if (bName.toLowerCase().includes('telugu')) lang = 'Telugu';
        brochures.push({ name: bName, url: bUrl, language: lang });
      }
    }

    // Inner 3 is Video
    if (contentInners.length > 3) {
      const vHtml = contentInners[3][1];
      const vMatches = [...vHtml.matchAll(/src=["']([^"']*(?:youtube|vimeo|youtu\.be)[^"']*)["']/gi)]
        .concat([...vHtml.matchAll(/href=["']([^"']*(?:youtube|vimeo|youtu\.be)[^"']*)["']/gi)]);
      for (const vm of vMatches) {
        videos.push({ title: `${name} Video`, videoUrl: vm[1] });
      }
    }
  }

  // Also check Spare parts section in full HTML
  const spareMatch = html.match(/id=["']showSpare["'][\s\S]*?<div class=["']row["']>([\s\S]*?)<\/div>\s*<\/div>/i);
  if (spareMatch && !spareMatch[1].toLowerCase().includes('not available')) {
    const spareItems = [...spareMatch[1].matchAll(/<h4[^>]*>([\s\S]*?)<\/h4>/gi)];
    spareParts = spareItems.map(s => ({ name: cleanText(s[1]), partNo: '' }));
  }

  // Category
  const category = defaultCategories[0] || 'AGRICULTURAL MACHINERY';

  return {
    name,
    riplCode: riplCode || `RIPL${productId || '000000'}`,
    productId,
    groupId,
    modelNumber,
    brand,
    category,
    categories: defaultCategories,
    mrp,
    sellingPrice,
    discountPercentage,
    taxInclusive: true,
    currency: 'INR',
    availability,
    stockQuantity,
    description: description || `${name} (${brand}) high performance agricultural machinery.`,
    specifications,
    accessories,
    brochures,
    videos,
    spareParts,
    images,
    sourceUrl: url
  };
}

const sampleHtml = fs.readFileSync('scripts/product_sample_full.html', 'utf8');
const parsed = parseProductHtml(sampleHtml, 'https://agrimart.in/index.php/home/prduct_details/MzUyNg==/MTc2Mg==', ['BRUSH CUTTER - WEED CUTTER']);
console.log('--- EXTRACTED PRODUCT DETAILS ---');
console.log(JSON.stringify(parsed, null, 2));
