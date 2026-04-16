import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function renderBlock(block, i) {
  if (typeof block === 'object' && block.type === 'image') {
    const cacheBust = typeof __BUILD_TIME__ !== 'undefined' ? `?v=${__BUILD_TIME__}` : ''
    return (
      <figure key={i} className="blog-figure">
        <img src={`${block.src}${cacheBust}`} alt={block.alt || ''} className="blog-image" />
        {block.caption && <figcaption>{block.caption}</figcaption>}
      </figure>
    )
  }

  if (typeof block !== 'string') return null

  if (block.startsWith('## ')) {
    return <h2 key={i}>{block.slice(3)}</h2>
  }

  // Parse **bold** and `code` within text
  const parts = block.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
  const rendered = parts.map((part, j) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={j}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={j}>{part.slice(1, -1)}</code>
    }
    return part
  })

  return <p key={i}>{rendered}</p>
}

function BlogPost() {
  const { slug } = useParams()
  const { t, language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const post = t.blog.posts.find(p => p.slug === slug)

  if (!post) {
    return (
      <div className="blog-post" data-theme={theme}>
        <div className="container">
          <Link to="/" className="back-link">← {t.blog.backHome}</Link>
          <h1>Post not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-post" data-theme={theme}>
      <nav className="navbar">
        <Link to="/" className="nav-brand">Sion Yoon</Link>
        <ul className="nav-links">
          <li>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '\u{1F319}' : '\u{2600}\u{FE0F}'}
            </button>
          </li>
          <li>
            <button className="lang-toggle" onClick={toggleLanguage}>
              {language === 'en' ? '\uD55C\uAD6D\uC5B4' : 'EN'}
            </button>
          </li>
        </ul>
      </nav>
      <div className="container" style={{ paddingTop: '5rem' }}>
        <Link to="/" className="back-link">← {t.blog.backHome}</Link>
        <article className="blog-post-content">
          <div className="blog-date">{post.date}</div>
          <h1>{post.title}</h1>
          <div className="pub-tags" style={{ marginBottom: '2rem' }}>
            {post.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          {post.content.map((block, i) => renderBlock(block, i))}
        </article>
      </div>
    </div>
  )
}

export default BlogPost
