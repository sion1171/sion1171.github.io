# sion1171.github.io

Personal portfolio and blog of Sion Yoon — AI/Data Scientist at Tridge.
Live at **https://sion1171.github.io**.

Built with React 19, React Router, and Vite. Deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # production build into dist/
npm run preview   # serve dist/ locally
npm run lint
```

## Deployment

Pushing to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds and publishes `dist/` to GitHub Pages.

## Project layout

```
src/
  data/
    blogPosts.js      # blog posts (English only, shared by both languages)
    translations.js   # all page copy in English and Korean (resume, publications, projects, …)
    routes.js         # per-route title/description — used by the app and the build script
  components/         # page sections and subpages (BlogPost, ProjectDetail, …)
  context/            # theme (light/dark) and language (en/ko), persisted in localStorage
scripts/
  prerender-routes.js # post-build: writes a static HTML shell per route + sitemap.xml
mermaid/              # sources for blog diagrams (rendered to public/blog/*.svg)
public/               # static assets: images, resume.pdf, 404.html, robots.txt
```

## Adding content

- **Blog post** — add an entry to `src/data/blogPosts.js`. Content blocks are strings (`## ` for headings; `**bold**`, `` `code` ``, `[link](url)` inline) or `{ type: 'image' | 'image-row', … }` objects. The route page and sitemap entry are generated on the next build.
- **Project page** — add an entry under `projects` in both `en` and `ko` in `src/data/translations.js`, and set `projectPage` on the matching publication item.
- **Images** — keep them small: WebP/JPEG, sized to roughly 2× their display width.

## How routing works on GitHub Pages

GitHub Pages has no SPA fallback, so `scripts/prerender-routes.js` writes `dist/blog/<slug>.html`, `dist/project/<id>.html`, etc. Each one is the app shell with route-specific `<title>` and Open Graph tags, so known routes return HTTP 200 and show correct link previews. Unknown paths fall back to `public/404.html`, which redirects into the SPA.
