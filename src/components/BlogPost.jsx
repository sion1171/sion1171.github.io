import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { blogPostMeta } from '../data/routes'
import { readingTime } from '../utils/readingTime'
import Navbar from './Navbar'
import Giscus from './Giscus'

const cacheBust = `?v=${__BUILD_TIME__}`

function renderBlock(block, i) {
  if (typeof block === 'object' && block.type === 'image-row') {
    return (
      <div key={i} className="blog-image-row">
        {block.images.map((img, j) => (
          <figure key={j} className="blog-figure">
            <img src={`${img.src}${cacheBust}`} alt={img.alt || ''} className="blog-image" loading="lazy" decoding="async" />
            {img.caption && <figcaption>{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    )
  }

  if (typeof block === 'object' && block.type === 'image') {
    return (
      <figure key={i} className="blog-figure">
        <img src={`${block.src}${cacheBust}`} alt={block.alt || ''} className="blog-image" loading="lazy" decoding="async" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    )
  }

  if (typeof block !== 'string') return null

  if (block.startsWith('## ')) {
    return <h2 key={i}>{block.slice(3)}</h2>
  }

  // Parse **bold**, `code`, and [link](url) within text
  const parts = block.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/)
  const rendered = parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={j}>{part.slice(1, -1)}</code>
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      return <a key={j} href={linkMatch[2]} target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>
    }
    return part
  })

  return <p key={i}>{rendered}</p>
}

function BlogPost() {
  const { slug } = useParams()
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const post = t.blog.posts.find(p => p.slug === slug)
  useDocumentMeta(post ? blogPostMeta(post) : { title: `${t.common.postNotFound} | Sion Yoon` })

  return (
    <div className="blog-post">
      <Navbar />
      <div className="container page-container">
        <Link to="/blog" className="back-link">← {t.blog.title}</Link>
        {post ? (
          <>
            <article className="blog-post-content">
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-read-time">{readingTime(post)} min read</span>
              </div>
              <h1>{post.title}</h1>
              <div className="pub-tags" style={{ marginBottom: '2rem' }}>
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              {post.content.map((block, i) => renderBlock(block, i))}
            </article>
            <div className="blog-comments">
              <Giscus />
            </div>
          </>
        ) : (
          <h1>{t.common.postNotFound}</h1>
        )}
      </div>
    </div>
  )
}

export default BlogPost
