import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Publications() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="publications" className="section publications">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>{t.publications.title}</h2>
        <div className="pub-grid">
          {t.publications.items.map((pub, index) => (
            <article
              key={pub.id}
              className={`pub-card scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
              style={{ transitionDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="pub-year">{pub.year}</div>
              <h3>{pub.title}</h3>
              <p>{pub.description}</p>
              <div className="pub-tags">
                {pub.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
              <div className="pub-links">
                {pub.paper && (
                  <a href={pub.paper} className="pub-link" target="_blank" rel="noopener noreferrer">
                    Paper →
                  </a>
                )}
                {pub.website && (
                  <a href={pub.website} className="pub-link" target="_blank" rel="noopener noreferrer">
                    Website →
                  </a>
                )}
                {pub.github && (
                  <a href={pub.github} className="pub-link" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                )}
                {pub.projectPage && (
                  <Link to={`/project/${pub.projectPage}`} className="pub-link">
                    Details →
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Publications
