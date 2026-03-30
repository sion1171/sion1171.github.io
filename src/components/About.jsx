import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function About() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="about" className="section about">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>{t.about.title}</h2>
        <div className={`about-content scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.15s' }}>
          <div className="about-image">
            <img src="/profile.jpg" alt="Sion" className="profile-image" />
          </div>
          <div className="about-text">
            {t.about.greeting && <h3>{t.about.greeting}</h3>}
            <p>{t.about.intro}</p>
            {t.about.example && <p>{t.about.example}</p>}
            <div className="skills">
              <h4>{t.about.skills}</h4>
              <ul>
                {t.about.skillsList.map(skill => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
