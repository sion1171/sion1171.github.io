import { blogPosts } from './blogPosts.js'
import { translations } from './translations.js'

// Shared by the client (document title/meta) and scripts/prerender-routes.js (static HTML + sitemap)
export const SITE_URL = 'https://sion1171.github.io'
export const DEFAULT_TITLE = 'Sion Yoon | AI/Data Scientist Portfolio'
export const DEFAULT_DESCRIPTION = 'Sion Yoon — AI/Data Scientist at Tridge. Building NLP & RAG solutions for global agricultural trade. Michigan State University Data Science student.'

export const homeMeta = {
  path: '/',
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
}

export const blogListMeta = (t = translations.en) => ({
  path: '/blog',
  title: `${t.blog.title} | Sion Yoon`,
  description: t.blog.subtitle,
})

export const blogPostMeta = (post) => ({
  path: `/blog/${post.slug}`,
  title: `${post.title} | Sion Yoon`,
  description: post.summary,
  lastmod: post.date,
  type: 'article',
})

export const projectMeta = (id, project) => ({
  path: `/project/${id}`,
  title: `${project.title} | Sion Yoon`,
  description: project.description[0],
})

export function getAllRoutes() {
  const latestPost = blogPosts.map(p => p.date).sort().at(-1)
  return [
    homeMeta,
    { ...blogListMeta(), lastmod: latestPost },
    ...blogPosts.map(blogPostMeta),
    ...Object.entries(translations.en.projects).map(([id, project]) => projectMeta(id, project)),
  ]
}
