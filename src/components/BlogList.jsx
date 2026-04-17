import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function BlogList() {
  const { t, language, toggleLanguage } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
        <h1 style={{ marginBottom: '0.5rem' }}>{t.blog.title}</h1>
        <p className="blog-subtitle">{t.blog.subtitle}</p>
        <div className="section-divider" />
        <div className="blog-grid">
          {t.blog.posts.map((post) => (
            <Link
              to={`/blog/${post.slug}`}
              key={post.slug}
              className="blog-card"
            >
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-read-time">{Math.max(1, Math.round(post.content.filter(b => typeof b === 'string').join(' ').split(/\s+/).length / 200))} min read</span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <div className="pub-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <span className="blog-read-more">{t.blog.readMore}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogList
