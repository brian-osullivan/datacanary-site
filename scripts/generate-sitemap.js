const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://datacanary.io';
const PUBLIC_DIR = path.join(__dirname, '../public');

function getPages(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const urls = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const subDir = path.join(dir, entry.name);
      const indexFile = path.join(subDir, 'index.html');
      const slug = base + '/' + entry.name;

      if (fs.existsSync(indexFile)) {
        urls.push(slug);
      }
      urls.push(...getPages(subDir, slug));
    }
  }
  return urls;
}

const pages = ['', ...getPages(PUBLIC_DIR)]; // '' = homepage

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
console.log(`Sitemap generated with ${pages.length} URLs`);
