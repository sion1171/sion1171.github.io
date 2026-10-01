// Post-build: write a static HTML shell per route so GitHub Pages serves them with
// HTTP 200 and route-specific <title>/meta (link previews, search indexing),
// then generate sitemap.xml from the same route list.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { SITE_URL, getAllRoutes } from '../src/data/routes.js'

const DIST = 'dist'
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function setTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Tag not found in index.html: ${pattern}`)
  return html.replace(pattern, replacement)
}

function renderRoute(route) {
  const url = `${SITE_URL}${route.path}`
  const title = escapeHtml(route.title)
  const description = escapeHtml(route.description)
  let html = template
  html = setTag(html, /<title>.*?<\/title>/, `<title>${title}</title>`)
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`)
  html = setTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`)
  html = setTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${route.type || 'website'}" />`)
  html = setTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`)
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`)
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`)
  html = setTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`)
  html = setTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`)
  return html
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

const routes = getAllRoutes()

for (const route of routes) {
  const html = renderRoute(route)
  if (route.path === '/') {
    write(join(DIST, 'index.html'), html)
    continue
  }
  // /blog/foo -> dist/blog/foo.html (served at the extensionless URL by GitHub Pages)
  write(join(DIST, `${route.path}.html`), html)
  // /blog also exists as a directory (blog/<slug>.html), so cover the /blog/ form too
  if (route.path === '/blog') write(join(DIST, 'blog', 'index.html'), html)
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
  </url>`).join('\n')}
</urlset>
`
write(join(DIST, 'sitemap.xml'), sitemap)

console.log(`Prerendered ${routes.length} routes + sitemap.xml`)
