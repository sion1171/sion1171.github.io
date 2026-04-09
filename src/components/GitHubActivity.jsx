import { GitHubCalendar } from 'react-github-calendar'
import { useLanguage } from '../context/LanguageContext'

function GitHubActivity() {
  const { t } = useLanguage()

  return (
    <section id="github" className="section github-activity">
      <div className="container">
        <h2>{t.github.title}</h2>
        <div className="github-calendar-wrapper">
          <GitHubCalendar
            username="sion1171"
            year={2026}
            colorScheme="dark"
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
