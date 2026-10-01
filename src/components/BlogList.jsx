import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { blogListMeta } from '../data/routes'
import Navbar from './Navbar'
import BlogCard from './BlogCard'

function BlogList() {
  const { t } = useLanguage()
  useDocumentMeta(blogListMeta(t))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="blog-post">
      <Navbar />
      <div className="container page-container">
        <Link to="/" className="back-link">← {t.blog.backHome}</Link>
        <h1 style={{ marginBottom: '0.5rem' }}>{t.blog.title}</h1>
        <p className="blog-subtitle">{t.blog.subtitle}</p>
        <div className="section-divider" />
        <div className="blog-grid">
          {t.blog.posts.map(post => (
            <BlogCard key={post.slug} post={post} readMore={t.blog.readMore} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlogList
