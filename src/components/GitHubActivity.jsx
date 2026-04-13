import { GitHubCalendar } from 'react-github-calendar'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

function GitHubActivity() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  return (
    <section id="github" className="section github-activity">
      <div className="container">
        <h2><span className="section-emoji">🟩</span>{t.github.title}</h2>
        <div className="section-divider" />
        <div className="github-calendar-wrapper">
          <GitHubCalendar
            username="sion1171"
            year={2026}
            colorScheme={theme}
            blockSize={13}
            blockMargin={4}
            fontSize={14}
            labels={{
              totalCount: t.github.totalCount
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default GitHubActivity
