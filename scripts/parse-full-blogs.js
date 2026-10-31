const fs = require('fs');
const path = require('path');

const blogsMeta = JSON.parse(fs.readFileSync('scripts/blogs_meta.json', 'utf8'));

const processedBlogs = [];

for (const b of blogsMeta) {
  const filePath = `scripts/raw_html/blog_${b.slug}.html`;
  if (!fs.existsSync(filePath)) continue;

  const html = fs.readFileSync(filePath, 'utf8');

  // Extract content
  // Look for blog single content container
  const contentMatch = html.match(/<div[^>]*class=["'][^"']*(?:ttm-blog-single-content|entry-content|blog-content|post-content)[^"']*["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/i) ||
                       html.match(/<div[^>]*class=["'][^"']*ttm-service-single-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/i) ||
                       html.match(/<div class="row">([\s\S]*?)<\/div>/i);

  let cleanContent = '';
  if (contentMatch) {
    cleanContent = contentMatch[1]
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .trim();
  }

  // Find thumbnail or featured image
  const imgMatches = [...html.matchAll(/src=["']([^"']*(?:uploads|blog)[^"']+)["']/gi)].map(m => m[1]);
  const featured = imgMatches[0] || '/assets/banners/banner-04.jpg';

  processedBlogs.push({
    id: `blog_${b.slug}`,
    slug: b.slug,
    title: b.title || b.excerpt,
    excerpt: b.excerpt,
    sourceUrl: b.url,
    imageUrl: featured.startsWith('http') ? featured : `https://agrimart.in${featured}`,
    date: '15 March 2024',
    author: 'Agrimart Team',
    category: 'Agricultural Mechanization',
    content: cleanContent || `<p>${b.title}</p><p>${b.excerpt}</p>`
  });
}

fs.writeFileSync('data/import/blogs.json', JSON.stringify(processedBlogs, null, 2));
console.log(`Saved ${processedBlogs.length} blogs to data/import/blogs.json`);
