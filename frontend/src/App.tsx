import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageToggle } from './components/LanguageToggle'
import { useTranslation } from 'react-i18next'
import './i18n/config'

function App() {
  const { t } = useTranslation()

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <header className="p-4 flex justify-end gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </header>
          <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{t('common.welcome')}</h1>
          </main>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App
