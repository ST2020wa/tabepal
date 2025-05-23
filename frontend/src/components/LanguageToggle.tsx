import { useLanguage } from '../contexts/LanguageContext'

const languageLabels: Record<string, string> = {
  en: '日本語',
  zh: 'EN',
  ja: '中文'
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle language"
    >
      {languageLabels[language]}
    </button>
  )
} 