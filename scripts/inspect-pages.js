const fs = require('fs');

function inspectSnippet(filename, pattern) {
  const content = fs.readFileSync(`scripts/raw_html/${filename}`, 'utf8');
  console.log(`\n=================== ${filename} ===================`);
  const lines = content.split('\n');
  let matched = 0;
  for (let i = 0; i < lines.length && matched < 15; i++) {
    if (pattern.test(lines[i])) {
      console.log(`Line ${i}: ${lines[i].trim().slice(0, 150)}`);
      matched++;
    }
  }
}

inspectSnippet('faq.html', /accordion|collapse|faq|panel|card|question/i);
inspectSnippet('blogs.html', /blog|post|article|read more|title/i);
inspectSnippet('about_us.html', /vision|mission|ratnagiri|about/i);
inspectSnippet('services.html', /service|network|dealer|750/i);
