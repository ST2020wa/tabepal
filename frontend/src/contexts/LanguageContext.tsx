import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

type Language = 'en' | 'zh' | 'ja'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) return savedLang
    return 'en'
  })

  const changeLanguage = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const toggleLanguage = () => {
    const languages: Language[] = ['en', 'zh', 'ja']
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    changeLanguage(languages[nextIndex])
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 