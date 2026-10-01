import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { scrollToSection, scrollToTop } from '../utils/scroll'

const SECTIONS = ['about', 'publications', 'resume', 'blog', 'contact']

// `home` renders section links (scroll targets); subpages get a brand link home + toggles only
function Navbar({ home = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  const scrollTo = (id) => {
    scrollToSection(id)
    setIsOpen(false)
  }

  const toggles = (
    <>
      <li>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? t.common.darkMode : t.common.lightMode}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </li>
      <li>
        <button
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label={t.common.switchLanguage}
          lang={language === 'en' ? 'ko' : 'en'}
        >
          {language === 'en' ? '한국어' : 'EN'}
        </button>
      </li>
    </>
  )

  if (!home) {
    return (
      <nav className="navbar">
        <Link to="/" className="nav-brand">Sion Yoon</Link>
        <ul className="nav-links nav-links--compact">{toggles}</ul>
      </nav>
    )
  }

  return (
    <nav className="navbar">
      <button className="nav-brand" onClick={scrollToTop}>
        Sion Yoon
      </button>

      <button
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t.common.closeMenu : t.common.openMenu}
        aria-expanded={isOpen}
        aria-controls="nav-links"
      >
        ☰
      </button>

      <ul id="nav-links" className={`nav-links ${isOpen ? 'open' : ''}`}>
        {SECTIONS.map(id => (
          <li key={id}><button onClick={() => scrollTo(id)}>{t.nav[id]}</button></li>
        ))}
        {toggles}
      </ul>
    </nav>
  )
}

export default Navbar
