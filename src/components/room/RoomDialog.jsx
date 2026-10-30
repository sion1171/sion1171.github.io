import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { contactLinks } from '../../data/contact'
import { OBJECT_ICONS } from './roomMap'

function Projects({ t }) {
  return (
    <ul className="room-list">
      {t.publications.items.map(item => (
        <li key={item.id}>
          <span className="room-list-meta">{item.year}</span>
          <strong>{item.title}</strong>
          <span className="room-links">
            {item.projectPage && <Link to={`/project/${item.projectPage}`}>Details</Link>}
            {item.paper && <a href={item.paper} target="_blank" rel="noopener noreferrer">Paper</a>}
            {item.website && <a href={item.website} target="_blank" rel="noopener noreferrer">Website</a>}
            {item.github && <a href={item.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Blog({ t }) {
  return (
    <ul className="room-list">
      {t.blog.posts.map(post => (
        <li key={post.slug}>
          <span className="room-list-meta">{post.date}</span>
          <Link to={`/blog/${post.slug}`}><strong>{post.title}</strong></Link>
          <span>{post.summary}</span>
        </li>
      ))}
    </ul>
  )
}

function Education({ t }) {
  return (
    <>
      <h3 className="room-subtitle">{t.room.educationTitle}</h3>
      <ul className="room-list">
        {t.resume.eduItems.map(edu => (
          <li key={edu.id}>
            <span className="room-list-meta">{edu.period}</span>
            <strong>{edu.degree}</strong>
            <span>{edu.school}</span>
          </li>
        ))}
      </ul>
      <h3 className="room-subtitle">{t.room.experienceTitle}</h3>
      <ul className="room-list">
        {t.resume.expItems.map(item => (
          <li key={item.id}>
            <span className="room-list-meta">{item.period}</span>
            <strong>{item.title}</strong>
            <span>{item.company}</span>
          </li>
        ))}
      </ul>
      <a href="/resume.pdf" className="room-button" download>{t.resume.download}</a>
    </>
  )
}

function Contact() {
  return (
    <ul className="room-list">
      {contactLinks.map(item => (
        <li key={item.text}>
          <a href={item.href} {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {item.icon} {item.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

const CONTENT = { projects: Projects, blog: Blog, education: Education, contact: Contact }

function RoomDialog({ id, onClose }) {
  const { t } = useLanguage()
  const closeRef = useRef(null)
  const Content = CONTENT[id]

  useEffect(() => {
    closeRef.current?.focus()
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="room-dialog-backdrop" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="room-dialog" role="dialog" aria-modal="true" aria-labelledby="room-dialog-title">
        <div className="room-dialog-header">
          <h2 id="room-dialog-title">{OBJECT_ICONS[id]} {t.room.objects[id]}</h2>
          <button ref={closeRef} className="room-close" onClick={onClose} aria-label={t.room.close}>✕</button>
        </div>
        <div className="room-dialog-body">
          <Content t={t} />
        </div>
      </div>
    </div>
  )
}

export default RoomDialog
