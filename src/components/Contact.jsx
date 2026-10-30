import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { contactLinks } from '../data/contact'

function Contact() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="contact" className="section contact">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}><span className="section-emoji">💬</span>{t.contact.title}</h2>
        <div className="section-divider" />
        <p className={`contact-intro scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.05s' }}>
          {t.contact.intro}
        </p>

        <div className="contact-info">
          {contactLinks.map((item, index) => (
            <div
              key={item.text}
              className={`contact-item scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
              style={{ transitionDelay: `${0.1 + index * 0.05}s` }}
            >
              <span className="contact-icon">{item.icon}</span>
              <a
                href={item.href}
                {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.text}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Contact
