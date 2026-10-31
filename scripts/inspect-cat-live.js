const fs = require('fs');

async function testCategoryPage() {
  const url = 'https://agrimart.in/index.php/home/list_product_inner/?cat_filter=MQ=='; // Blower
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('scripts/cat_sample_live.html', html);
  console.log('Length:', html.length);

  // Check subcategories links or filters
  const subcatMatches = [...html.matchAll(/sub_cat_filter=([^"'&]+)/gi)];
  console.log('sub_cat_filter matches:', subcatMatches.length);

  // Check product detail links
  const prodMatches = [...html.matchAll(/prduct_details\/([^"'#\s]+)/gi)];
  console.log('Product links found:', prodMatches.length);

  // Check pagination
  const paginationMatches = [...html.matchAll(/pagination|page-link|href=["'][^"']*page=[0-9]+[^"']*["']/gi)];
  console.log('Pagination matches:', paginationMatches.length);

  // Let's see some product link samples
  const uniqueProds = [...new Set(prodMatches.map(m => m[1]))];
  console.log('Unique product URLs in category MQ==:', uniqueProds);
}

testCategoryPage().catch(console.error);
