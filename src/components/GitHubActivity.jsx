import { ActivityCalendar } from 'react-activity-calendar'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
// Generated at build time by scripts/fetch-github-contributions.js
import calendar from '../data/github-contributions.json'

const gitHubTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
}

function GitHubActivity() {
  const { t } = useLanguage()
  const { theme } = useTheme()

  return (
    <section id="github" className="section github-activity">
      <div className="container">
        <h2><span className="section-emoji">🟩</span>{t.github.title}</h2>
        <div className="section-divider" />
        <div className="github-calendar-wrapper">
          <ActivityCalendar
            data={calendar.contributions}
            theme={gitHubTheme}
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
