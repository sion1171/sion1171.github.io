import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Resume() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="resume" className="section resume">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}><span className="section-emoji">📋</span>{t.resume.title}</h2>
        <div className="section-divider" />

        <div className={`resume-download scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.05s' }}>
          <a href="/resume.pdf" className="btn" download>
            {t.resume.download}
          </a>
        </div>

        <h3 className={`timeline-section-title scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
          {t.resume.experience}
        </h3>
        <div className="timeline">
          {t.resume.expItems.map((item, index) => (
            <div
              key={item.id}
              className={`timeline-item scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
              style={{ transitionDelay: `${0.12 + index * 0.05}s` }}
            >
              <div className="timeline-marker">
                <div className="timeline-dot timeline-dot--experience" />
              </div>
              <div className="timeline-card">
                <span className="timeline-period">{item.period}</span>
                <div className="timeline-header">
                  {item.logo && <img src={item.logo} alt={item.company} className="company-logo" />}
                  <div>
                    <h4 className="timeline-title">{item.title}</h4>
                    <div className="timeline-place">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer">{item.company}</a>
                      ) : (
                        item.company
                      )}
                    </div>
                  </div>
                </div>
                <p className="timeline-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`resume-bottom scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
          <div className="resume-bottom-col">
            <h3>{t.resume.education}</h3>
            {t.resume.eduItems.map(edu => (
              <div key={edu.id} className="resume-card">
                <span className="resume-card-period">{edu.period}</span>
                <h4>{edu.degree}</h4>
                <div className="resume-card-place">{edu.school}</div>
                <p>{edu.description}</p>
              </div>
            ))}
          </div>

          <div className="resume-bottom-col">
            <h3>{t.resume.leadership}</h3>
            {t.resume.leadershipItems.map(item => (
              <div key={item.id} className="resume-card">
                <span className="resume-card-period">{item.period}</span>
                <div className="resume-card-header">
                  {item.logo && <img src={item.logo} alt={item.company} className="company-logo" />}
                  <div>
                    <h4>{item.title}</h4>
                    <div className="resume-card-place">{item.company}</div>
                  </div>
                </div>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resume
