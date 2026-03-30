import { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setIsOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">Sion Yoon</div>

      <button className="nav-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`}>
        <li><button onClick={() => scrollTo('about')}>{t.nav.about}</button></li>
        <li><button onClick={() => scrollTo('publications')}>{t.nav.publications}</button></li>
        <li><button onClick={() => scrollTo('resume')}>{t.nav.resume}</button></li>
        <li><button onClick={() => scrollTo('contact')}>{t.nav.contact}</button></li>
        <li>
          <button className="lang-toggle" onClick={toggleLanguage}>
            {language === 'en' ? '한국어' : 'EN'}
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
