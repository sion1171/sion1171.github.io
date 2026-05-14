import { useEffect, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

function Giscus() {
  const ref = useRef(null)
  const { theme } = useTheme()
  const { language } = useLanguage()

  useEffect(() => {
    if (!ref.current) return

    ref.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', 'sion1171/sion1171.github.io')
    script.setAttribute('data-repo-id', 'R_kgDOR0VivQ')
    script.setAttribute('data-category', 'General')
    script.setAttribute('data-category-id', 'DIC_kwDOR0Vivc4C9Brd')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light')
    script.setAttribute('data-lang', language === 'ko' ? 'ko' : 'en')

    ref.current.appendChild(script)
  }, [theme, language])

  return <div ref={ref} className="giscus-wrapper" />
}

export default Giscus
