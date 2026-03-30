import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

function Contact() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="contact" className="section contact">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>{t.contact.title}</h2>
        <p className={`contact-intro scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
          {t.contact.intro}
        </p>

        <div className="contact-info">
          {[
            { icon: '✉️', href: 'mailto:makeryoon1171@gmail.com', text: 'makeryoon1171@gmail.com' },
            { icon: '🔗', href: 'https://github.com/sion1171', text: 'GitHub', external: true },
            { icon: '💼', href: 'https://www.linkedin.com/in/sion-yoon-135181246', text: 'LinkedIn', external: true },
          ].map((item, index) => (
            <div
              key={item.text}
              className={`contact-item scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}
              style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
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
