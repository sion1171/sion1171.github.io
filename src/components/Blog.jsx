import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Blog() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="blog" className="section blog">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
          <span className="section-emoji">✍️</span>{t.blog.title}
        </h2>
        <p className={`blog-subtitle scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
          {t.blog.subtitle}
        </p>
        <div className="section-divider" />
        {t.blog.posts.length === 0 ? (
          <p className={`blog-empty scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
            {t.blog.empty}
          </p>
        ) : (
          <div className="blog-grid">
            {t.blog.posts.map((post, index) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.slug}
                className={`blog-card scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
                style={{ transitionDelay: `${0.05 + index * 0.05}s` }}
              >
                <div className="blog-date">{post.date}</div>
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
        )}
      </div>
    </section>
  )
}

export default Blog
