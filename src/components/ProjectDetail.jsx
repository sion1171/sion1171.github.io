import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import '../App.css'

function ProjectDetail() {
  const { id } = useParams()
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  const project = t.projects?.[id]

  if (!project) {
    return (
      <div className="project-detail">
        <div className="container">
          <Link to="/" className="back-link">← Back</Link>
          <h1>Project not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="project-detail">
      <div className="container">
        <Link to="/" className="back-link">← Back</Link>

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
              <img key={index} src={img} alt={`${project.title} - ${index + 1}`} className="project-image" />
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
