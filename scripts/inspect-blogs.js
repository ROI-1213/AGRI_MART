const fs = require('fs');

const blogsHtml = fs.readFileSync('scripts/raw_html/blogs.html', 'utf8');
const articleMatches = [...blogsHtml.matchAll(/<article[^>]*>([\s\S]*?)<\/article>/gi)];
console.log('Total articles in blogs.html:', articleMatches.length);

const blogList = [];
for (const match of articleMatches) {
  const content = match[1];
  const linkMatch = content.match(/href=["']([^"']+)["']/i);
  const titleMatch = content.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const imgMatch = content.match(/src=["']([^"']+)["']/i);
  const excerptMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);

  blogList.push({
    url: linkMatch ? linkMatch[1] : null,
    title: titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '',
    image: imgMatch ? imgMatch[1] : null,
    excerpt: excerptMatch ? excerptMatch[1].replace(/<[^>]+>/g, '').trim() : ''
  });
}

console.log(JSON.stringify(blogList, null, 2));
fs.writeFileSync('scripts/blog_list.json', JSON.stringify(blogList, null, 2));
