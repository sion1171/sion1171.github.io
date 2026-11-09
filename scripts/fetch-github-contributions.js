// Pre-build: fetch the GitHub contribution calendar via the GraphQL API and
// write it to src/data/github-contributions.json.
//
// The page used to fetch this at runtime from a third-party proxy, which
// scrapes github.com/users/<name>/contributions. That page started timing out
// (504) for this account, so the section showed an error. The GraphQL API is
// reliable, but needs a token — so we fetch at build time instead.
//
// Token: GITHUB_TOKEN (set in CI), otherwise `gh auth token`. If no token is
// available or the request fails, the committed snapshot is kept and the
// build continues.
import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const USERNAME = 'sion1171'
const OUT = fileURLToPath(new URL('../src/data/github-contributions.json', import.meta.url))

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4
}

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync('gh auth token', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return null
  }
}

const query = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`

async function main() {
  const token = getToken()
  if (!token) {
    console.warn('[github-contributions] no token — keeping the committed snapshot')
    return
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login: USERNAME } })
  })
  const json = await res.json()
  const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar
  if (!res.ok || !calendar) {
    console.warn(`[github-contributions] fetch failed (${res.status}) — keeping the committed snapshot`, json?.errors ?? '')
    return
  }

  const contributions = calendar.weeks.flatMap(w =>
    w.contributionDays.map(d => ({
      date: d.date,
      count: d.contributionCount,
      level: LEVELS[d.contributionLevel] ?? 0
    }))
  )

  writeFileSync(OUT, JSON.stringify({ total: calendar.totalContributions, contributions }) + '\n')
  console.log(`[github-contributions] ${calendar.totalContributions} contributions, ${contributions.length} days`)
}

main().catch(err => {
  console.warn('[github-contributions] error — keeping the committed snapshot:', err.message)
})
