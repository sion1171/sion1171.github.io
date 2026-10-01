import { createContext, useContext, useState } from 'react'
import { translations } from '../data/translations.js'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const t = translations[language]

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en')
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
