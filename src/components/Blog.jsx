import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import BlogCard from './BlogCard'

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
          <>
            <div className="blog-grid">
              {t.blog.posts.slice(0, 2).map((post, index) => (
                <BlogCard
                  key={post.slug}
                  post={post}
                  readMore={t.blog.readMore}
                  className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
                  style={{ transitionDelay: `${0.05 + index * 0.05}s` }}
                />
              ))}
            </div>
            <div className={`blog-view-all scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
              <Link to="/blog" className="btn">{t.blog.viewAll}</Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Blog
