import { Link } from 'react-router-dom'
import { readingTime } from '../utils/readingTime'

function BlogCard({ post, readMore, className = '', style }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`blog-card ${className}`} style={style}>
      <div className="blog-meta">
        <span className="blog-date">{post.date}</span>
        <span className="blog-read-time">{readingTime(post)} min read</span>
      </div>
      <h3>{post.title}</h3>
      <p>{post.summary}</p>
      <div className="pub-tags">
        {post.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
      <span className="blog-read-more">{readMore}</span>
    </Link>
  )
}

export default BlogCard
