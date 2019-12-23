// This is a development script executed in the build step of pages
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const DOMAIN = 'https://liz.wiki';
const SITE_PATHS = [];
const META = /export\s+const\s+meta\s+=\s+({[\s\S]*?\n})/;
const SITEMAP_PATH = 'public/sitemap.xml';
const GUIDES_PATH = 'lib/data/guides.json';

// Set the header
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

// Wrap all pages in <urlset> tags
const xmlUrlWrapper = nodes => `${xmlHeader}
${nodes}
</urlset>`;

function recursiveReadDirSync(dir, arr = [], rootDir = dir){
    const result = fs.readdirSync(dir);

    result.forEach(part => {
        const absolutePath = path.join(dir, part);
        const pathStat = fs.statSync(absolutePath);

        if (pathStat.isDirectory()) {
            recursiveReadDirSync(absolutePath, arr, rootDir);
            return;
        }
        arr.push(absolutePath.replace(rootDir, ''));
    });

    return arr;
}

function xmlUrlNode(pagePath){
    const page = path.basename(pagePath);
    const pageName = path.basename(pagePath, path.extname(page));
    const relativeUrl = pagePath.replace(
        page,
        pageName === 'index' ? '' : pageName + '/',
    );
    const content = fs.readFileSync(path.join('pages', pagePath), 'utf-8');
    const match = content.match(META);
    const loc = DOMAIN + relativeUrl;

    let meta;
    let lastmod;

    if (match && typeof match[1] === 'string') {
        meta = eval('(' + match[1] + ')');

        if (meta.lastEdited) {
            lastmod = meta.lastEdited;
        }
    }

    const node = `  <url>
    <loc>${loc}</loc>${
        lastmod !== undefined
            ? `
    <lastmod>${lastmod}</lastmod>`
            : ``
        }
    <changefreq>hourly</changefreq>
  </url>`;

    return { node, meta };
}

function generateSiteMap(){
    // This will return pages in the format `/docs/v2/name.js`
    const guides = recursiveReadDirSync('pages/guides', [], 'pages');
    const guidesMeta = [];

    const nodes = guides.map(filePath => {
        const pagePath = filePath.replace(/\\/g, '/');
        const { node, meta } = xmlUrlNode(pagePath);

        if (meta) {
            guidesMeta.push(meta);
        }

        return node;
    });

    const sitemap = `${xmlUrlWrapper(nodes.join('\n'))}`;

    fs.writeFileSync(SITEMAP_PATH, sitemap);

    console.log(
        `sitemap.xml with ${nodes.length} entries was written to ${SITEMAP_PATH}`,
    );

    const sortedGuides = guidesMeta.sort((a, b) => {
        if (a.published === b.published) return a.url.localeCompare(b.url);

        return new Date(b.published) - new Date(a.published);
    });
    const guidesJson = JSON.stringify(sortedGuides, null, 2);

    fs.writeFileSync(GUIDES_PATH,
        prettier.format(guidesJson, { parser: 'json' }));

    console.log(
        `guides.json with ${
            guidesMeta.length
            } entries was written to ${GUIDES_PATH}`,
    );
}

generateSiteMap();
