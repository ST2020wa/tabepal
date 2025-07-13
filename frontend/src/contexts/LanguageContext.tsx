import { createContext, useContext, useEffect, useState } from 'react'
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
  
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      i18n.changeLanguage(savedLang)
      return savedLang
    }
    return 'en'
  })

  const [key, setKey] = useState(0) // 强制重新渲染的 key

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng as Language)
      localStorage.setItem('language', lng)
      setKey(prev => prev + 1) // 强制重新渲染
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const changeLanguage = async (lang: Language) => {
    await i18n.changeLanguage(lang)
  }

  const toggleLanguage = () => {
    const languages: Language[] = ['en', 'zh', 'ja']
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    changeLanguage(languages[nextIndex])
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, toggleLanguage }}>
      <div key={key}>
        {children}
      </div>
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