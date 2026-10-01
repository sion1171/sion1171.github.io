import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../data/translations.js'
import { getStored, setStored } from '../utils/storage'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => getStored('language') === 'ko' ? 'ko' : 'en')

  const t = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ko' : 'en'
    setStored('language', next)
    setLanguage(next)
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
