import { useLanguage } from '../contexts/LanguageContext'

const languageLabels: Record<string, string> = {
  en: '切换至中文',
  zh: '日本語に',
  ja: 'Switch to English'
}

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      aria-label="Toggle language"
    >
      {languageLabels[language]}
    </button>
  )
} 