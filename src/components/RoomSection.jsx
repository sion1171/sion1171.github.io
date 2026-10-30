import { Suspense, lazy } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { useScrollAnimation } from '../hooks/useScrollAnimation'

// The animated preview (canvas + pixel font) loads separately so the home page stays light
const RoomPreview = lazy(() => import('./room/RoomPreview'))

function RoomSection() {
  const { t } = useLanguage()
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="room" className="section room-section">
      <div className="container" ref={ref}>
        <h2 className={`scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
          <span className="section-emoji">🕹️</span>{t.roomPreview.title}
        </h2>
        <p className={`blog-subtitle scroll-hidden ${isVisible ? 'scroll-visible' : ''}`}>
          {t.roomPreview.subtitle}
        </p>
        <div className="section-divider" />
        <div className={`room-preview-slot scroll-hidden ${isVisible ? 'scroll-visible' : ''}`} style={{ transitionDelay: '0.1s' }}>
          <Suspense fallback={null}>
            <RoomPreview />
          </Suspense>
        </div>
      </div>
    </section>
  )
}

export default RoomSection
