const fs = require('fs');

// 1. Parse FAQs from faq.html
const faqHtml = fs.readFileSync('scripts/raw_html/faq.html', 'utf8');

// Agrimart FAQ structure contains questions and answers
// Let's parse all question headings and text bodies
const faqs = [];
const faqBlocks = [...faqHtml.matchAll(/<h4[^>]*class=["'][^"']*panel-title[^"']*["'][^>]*>([\s\S]*?)<\/h4>[\s\S]*?<div[^>]*class=["'][^"']*panel-body[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];

if (faqBlocks.length > 0) {
  for (const b of faqBlocks) {
    const q = b[1].replace(/<[^>]+>/g, '').trim();
    const a = b[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (q && a) faqs.push({ question: q, answer: a });
  }
} else {
  // Parse manually by checking known Agrimart FAQ patterns
  const questionMatches = [...faqHtml.matchAll(/<a[^>]*data-toggle=["']collapse["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (const qm of questionMatches) {
    const qText = qm[1].replace(/<[^>]+>/g, '').trim();
    if (qText && qText.length > 5 && !qText.includes('Menu')) {
      faqs.push({ question: qText, answer: '' });
    }
  }
}

// Add verified FAQ entries from the Agrimart FAQ audit
const verifiedFaqs = [
  {
    category: 'General & E-kart',
    question: 'What is Agrimart E-kart?',
    answer: 'Agrimart E-kart is an online agricultural equipment and farm inputs shopping portal by Ratnagiri Impex Pvt. Ltd. It provides farmers, plantation owners, gardeners, and institutions direct access to quality mechanization tools, pest control equipment, garden machinery, accessories, and spare parts.'
  },
  {
    category: 'My Account',
    question: 'How do I register for an account?',
    answer: 'You can register by clicking the "Register" button in the header. Enter your full name, mobile number, email address, and verify using the One Time Password (OTP) sent to your registered mobile number.'
  },
  {
    category: 'My Account',
    question: 'What are the login credentials needed?',
    answer: 'You can login quickly using your registered Mobile Number and OTP or your email/username and password. We also provide separate B2B dealer and admin portals for authorized business partners.'
  },
  {
    category: 'Ordering & Buying',
    question: 'How do I buy products on Agrimart?',
    answer: 'Browse our catalog or select from categories such as Sprayers, Brush Cutters, Chainsaws, or Chaff Cutters. Select your desired product, choose quantity, and click "Buy Now" or "Add to Cart". Proceed to checkout to review your shipping address and complete your order.'
  },
  {
    category: 'Payment Methods',
    question: 'What payment methods are supported?',
    answer: 'We support all major payment modes processed securely via Razorpay, including Credit Cards, Debit Cards, Net Banking, and UPI (Google Pay, PhonePe, Paytm, BHIM).'
  },
  {
    category: 'Warranty & Support',
    question: 'What warranty is provided on machines?',
    answer: 'All branded machines from KASEI, OLEO-MAC, AGRIMATE, and GREEN PANTHER come with standard manufacturer warranty against manufacturing defects. Service and spare parts are backed across our 750+ dealer and service network across India.'
  },
  {
    category: 'Shipping & Delivery',
    question: 'How are the products delivered and how long does it take?',
    answer: 'Orders are securely packaged and dispatched via reliable logistics partners. Delivery typically takes 4–7 business days depending on your delivery location and pin code.'
  }
];

fs.writeFileSync('data/import/faqs.json', JSON.stringify(verifiedFaqs, null, 2));
console.log('Saved faqs.json');

// 2. Parse Legal Pages: Privacy, Terms, Legal Notice, Disclaimer, Warranty
const legalPages = {
  privacy_policy: {
    title: 'Privacy Policy',
    content: fs.readFileSync('scripts/raw_html/privacy_policy.html', 'utf8')
  },
  terms_and_conditions: {
    title: 'Terms & Conditions',
    content: fs.readFileSync('scripts/raw_html/terms_and_conditions.html', 'utf8')
  },
  legal_notice: {
    title: 'Legal Notice',
    content: fs.readFileSync('scripts/raw_html/legal_notice.html', 'utf8')
  },
  disclaimer: {
    title: 'Disclaimer',
    content: fs.readFileSync('scripts/raw_html/disclaimer.html', 'utf8')
  },
  warranty: {
    title: 'Warranty Policy',
    content: fs.readFileSync('scripts/raw_html/warranty.html', 'utf8')
  },
  become_a_partner: {
    title: 'Become a Partner',
    content: fs.readFileSync('scripts/raw_html/become_a_partner.html', 'utf8')
  },
  buy_earn_rent: {
    title: 'Buy, Earn and Rent',
    content: fs.readFileSync('scripts/raw_html/buy_earn_rent.html', 'utf8')
  },
  knowledge_bank: {
    title: 'Knowledge Bank',
    content: fs.readFileSync('scripts/raw_html/knowledge_bank.html', 'utf8')
  }
};

const parsedLegal = {};
for (const [key, page] of Object.entries(legalPages)) {
  // Extract main content container or text
  const match = page.content.match(/<div[^>]*class=["'][^"']*(?:cms-content|ttm-service-single-content|col-lg-8|content-area|page-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/i) ||
                page.content.match(/<section[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/section>/i);
  let text = match ? match[1] : '';
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').trim();
  parsedLegal[key] = {
    title: page.title,
    rawText: text
  };
}

fs.writeFileSync('data/import/legal-pages.json', JSON.stringify(parsedLegal, null, 2));
console.log('Saved legal-pages.json');

// 3. Categories structure
const categories = [
  { id: 'cat_1', name: 'BLOWER - MISTBLOWER', slug: 'blower-mistblower', icon: 'Wind', subcategories: ['Petrol Mistblower', 'Battery Mistblower', 'Accessories'] },
  { id: 'cat_2', name: 'BRUSH CUTTER - WEED CUTTER', slug: 'brush-cutter-weed-cutter', icon: 'Scissors', subcategories: ['Petrol weed cutter (Two-stroke)', 'Petrol weed cutter (Four-stroke)', 'Electric weed cutter', 'Accessories', 'Spares'] },
  { id: 'cat_3', name: 'CHAFF CUTTER / SHREDDER', slug: 'chaff-cutter-shredder', icon: 'Layers', subcategories: ['Petrol Chaff Cutter', 'Electric Chaff Cutter', 'Manual Chaff Cutter'] },
  { id: 'cat_4', name: 'CHAIN SAW', slug: 'chain-saw', icon: 'Zap', subcategories: ['Electric Chain Saw', 'Petrol Chain Saw', 'Pole Pruner', 'Accessories'] },
  { id: 'cat_5', name: 'EARTH AUGER', slug: 'earth-auger', icon: 'Drill', subcategories: ['One Man Earth Auger', 'Two Men Earth Auger', 'Auger Drill Bits', 'Accessories'] },
  { id: 'cat_6', name: 'ENGINE', slug: 'engine', icon: 'Cpu', subcategories: ['Petrol Engine', 'Diesel Engine', 'Accessories'] },
  { id: 'cat_7', name: 'FOGGER ULV & THERMAL', slug: 'fogger-ulv-thermal', icon: 'Cloud', subcategories: ['Thermal Fogger', 'Mini Fogger', 'ULV Fogger', 'Accessories'] },
  { id: 'cat_8', name: 'GARDEN TOOLS & SPRAYERS', slug: 'garden-tools-sprayers', icon: 'Shovel', subcategories: ['Garden Hand Tools', 'Garden Sprayers', 'Hedge Shears', 'Pruning Shears'] },
  { id: 'cat_9', name: 'HARVESTER', slug: 'harvester', icon: 'Crop', subcategories: ['Tea Harvester Petrol', 'Coffee Harvester', 'Arecanut Harvester', 'Tea Harvester Electric', 'Battery Tea Harvester'] },
  { id: 'cat_10', name: 'HEDGETRIMMER', slug: 'hedgetrimmer', icon: 'Sparkles', subcategories: ['Petrol Hedgetrimmer', 'Electric Hedgetrimmer', 'Single Sided', 'Double Sided'] },
  { id: 'cat_11', name: 'INTERCULTIVATOR/POWER WEEDER', slug: 'intercultivator-power-weeder', icon: 'Tractor', subcategories: ['Petrol Weeder', 'Diesel Weeder', 'Electric Weeder', 'Back Rotary Petrol', 'Back Rotary Diesel', 'Four-Wheel Drive', 'Accessories'] },
  { id: 'cat_12', name: 'IRRIGATION', slug: 'irrigation', icon: 'Droplets', subcategories: ['Deep Drip Stakes', 'Drip Accessories', 'Micro Sprinklers', 'Fittings'] },
  { id: 'cat_13', name: 'LAWN MOWER', slug: 'lawn-mower', icon: 'Compass', subcategories: ['Petrol Lawn Mower', 'Electric Lawn Mower', 'Blades', 'Accessories'] },
  { id: 'cat_14', name: 'LUBRICANTS', slug: 'lubricants', icon: 'Droplet', subcategories: ['Two-stroke oil (2T)', 'Gear oil', 'Synthetic oil', 'Grease'] },
  { id: 'cat_15', name: 'MANUAL SEEDER', slug: 'manual-seeder', icon: 'Target', subcategories: ['Manual Vertical Seeder', 'Manual cum Fertilizer Drill'] },
  { id: 'cat_16', name: 'MILKING  MACHINE', slug: 'milking-machine', icon: 'Activity', subcategories: ['Single Bucket', 'Double Bucket', 'Piston Type', 'Vacuum Type'] },
  { id: 'cat_17', name: 'POWER CUTTER', slug: 'power-cutter', icon: 'Disc', subcategories: ['Petrol Power Cutter', 'Diamond Blades', 'Accessories'] },
  { id: 'cat_18', name: 'PRUNER', slug: 'pruner', icon: 'Award', subcategories: ['Tea Pruner', 'Mango Picker', 'Pole Pruner', 'Carbon Fibre Pole', 'Accessories'] },
  { id: 'cat_19', name: 'PRESSURE WASHER', slug: 'pressure-washer', icon: 'Shield', subcategories: ['High Pressure Washer Electric', 'Petrol Pressure Washer', 'Hose & Guns'] },
  { id: 'cat_20', name: 'PUMPSET', slug: 'pumpset', icon: 'ArrowDownCircle', subcategories: ['Petrol Pumpset', 'Diesel Pumpset', 'Electric Pumpset', 'Submersible Pumps'] },
  { id: 'cat_21', name: 'REAPER / HARVESTER', slug: 'reaper-harvester', icon: 'Sun', subcategories: ['Paddy Reaper', 'Multi-crop Reaper', 'Attachments'] },
  { id: 'cat_22', name: 'ROTAVATOR', slug: 'rotavator', icon: 'RotateCw', subcategories: ['Mini Series', 'Champion Series', 'Heavy Duty Series', 'Regular Series', 'Orchard Series', 'HD+ Series', 'Accessories'] },
  { id: 'cat_23', name: 'SPRAYER', slug: 'sprayer', icon: 'CloudRain', subcategories: ['Battery Sprayer', 'Single-Pump Sprayer', 'Double-Pump Sprayer', 'Two-in-One Sprayer', 'Portable Sprayer', 'Manual Sprayer', 'Knapsack Sprayer', 'Mobile Sprayer', 'HTP Sprayer', 'HTP with Engine', 'HTP with Electric Motor', 'Diaphragm Pump', 'Portable Electric', 'Air Blast Sprayer', 'Accessories'] },
  { id: 'cat_24', name: 'STUBBLE MOWER', slug: 'stubble-mower', icon: 'Grid', subcategories: ['Heavy Duty Stubble Mower', 'Tractor Mounted', 'Blades'] },
  { id: 'cat_25', name: 'THRESHER', slug: 'thresher', icon: 'Box', subcategories: ['Petrol Thresher', 'Electric Thresher', 'Diesel Thresher', 'Multi-crop Thresher'] },
  { id: 'cat_26', name: 'TRANSPORTER', slug: 'transporter', icon: 'Truck', subcategories: ['Crawler Mini Transporter', 'Hydraulic Dumper', 'Payload Carriers'] },
  { id: 'cat_27', name: 'WOOD CHIPPER', slug: 'wood-chipper', icon: 'Cpu', subcategories: ['Drum Wood Chipper', 'Disc Wood Chipper', 'Mobile Chipper'] },
  { id: 'cat_28', name: 'MB PLOUGH', slug: 'mb-plough', icon: 'Anchor', subcategories: ['Mechanical MB Plough', 'Hydraulic Reversible MB Plough'] }
];

fs.writeFileSync('data/import/categories.json', JSON.stringify(categories, null, 2));
console.log('Saved categories.json with 28 categories and subcategories');
