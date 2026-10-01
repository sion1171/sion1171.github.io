import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { projectMeta } from '../data/routes'
import Navbar from './Navbar'
import '../App.css'

function ProjectDetail() {
  const { id } = useParams()
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const project = t.projects?.[id]
  useDocumentMeta(project ? projectMeta(id, project) : { title: `${t.common.projectNotFound} | Sion Yoon` })

  if (!project) {
    return (
      <div className="project-detail">
        <Navbar />
        <div className="container page-container">
          <Link to="/" className="back-link">← {t.common.back}</Link>
          <h1>{t.common.projectNotFound}</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <Navbar />
      <div className="container page-container">
        <Link to="/" className="back-link">← {t.common.back}</Link>

        <header className="project-header">
          <span className="project-year">{project.year}</span>
          <h1>{project.title}</h1>
          <div className="project-tags">
            {project.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </header>

        <section className="project-content">
          {project.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        {project.images && project.images.length > 0 && (
          <section className="project-images">
            {project.images.map((img, index) => (
              <img key={index} src={img} alt={`${project.title} - ${index + 1}`} className="project-image" loading="lazy" decoding="async" />
            ))}
          </section>
        )}

        {project.youtube && (
          <section className="project-video">
            <h2>Demo</h2>
            <div className="video-container">
              <iframe
                src={project.youtube.replace('watch?v=', 'embed/').split('&')[0]}
                title={project.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default ProjectDetail
