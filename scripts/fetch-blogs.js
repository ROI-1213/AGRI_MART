const fs = require('fs');

const blogs = JSON.parse(fs.readFileSync('scripts/blog_list.json', 'utf8'));

async function fetchAllBlogs() {
  const fullBlogs = [];
  for (const b of blogs) {
    console.log(`Fetching blog: ${b.url}...`);
    try {
      const res = await fetch(b.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      const html = await res.text();
      const slug = b.url.split('/').pop();
      fs.writeFileSync(`scripts/raw_html/blog_${slug}.html`, html);

      // Extract title, banner/image, content
      const titleMatch = html.match(/<h2[^>]*class=["'][^"']*title[^"']*["'][^>]*>([\s\S]*?)<\/h2>/i) ||
                         html.match(/<h[13][^>]*>([\s\S]*?)<\/h[13]>/i);
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : b.excerpt;

      // Extract images in blog
      const imgMatches = [...html.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
      const blogImgs = imgMatches.filter(src => src.includes('/uploads/') || src.includes('blog') || src.includes('banner'));

      fullBlogs.push({
        slug,
        title,
        excerpt: b.excerpt,
        url: b.url,
        images: blogImgs,
        htmlLength: html.length
      });
    } catch (e) {
      console.error(`Failed to fetch ${b.url}:`, e.message);
    }
  }
  fs.writeFileSync('scripts/blogs_meta.json', JSON.stringify(fullBlogs, null, 2));
  console.log('Finished fetching blogs.');
}

fetchAllBlogs();
