import { useLanguage } from './context/LanguageContext'
import Navbar from './components/Navbar'
import TypeWriter from './components/TypeWriter'
import About from './components/About'
import Publications from './components/Publications'
import Resume from './components/Resume'
import GitHubActivity from './components/GitHubActivity'
import Contact from './components/Contact'
import './App.css'

function App() {
  const { t, language } = useLanguage()

  return (
    <div className="app">
      <Navbar />

      <header className="hero">
        <div className="hero-cover" />
        <div className="hero-icon">👨‍💻</div>
        <div className="hero-content">
          <h1>
            <TypeWriter
              key={language}
              text={t.hero.name}
              speed={80}
            />
          </h1>
          <p>{t.hero.title}</p>
        </div>
      </header>

      <main>
        <About />
        <Publications />
        <Resume />
        <GitHubActivity />
        <Contact />
      </main>

      <footer>
        <p>{t.footer.copyright}</p>
      </footer>
    </div>
  )
}

export default App
