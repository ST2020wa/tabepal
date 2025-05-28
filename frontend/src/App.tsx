import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeToggle } from './components/ThemeToggle'
import { LanguageToggle } from './components/LanguageToggle'
import { useTranslation } from 'react-i18next'
import './i18n/config'
import { UserInfoToggle } from './components/UserInfo'
import { HomeToggle } from './components/HomeToggle'
import { Login } from './components/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function App() {
  const { t } = useTranslation()

  const {isLoggedIn} = useAuth();

  return (
    <AuthProvider>
    <LanguageProvider>
      <ThemeProvider>
        <div className="flex flex-col justify-between min-h-screen w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-red-500">
          <header className="w-full p-4 flex justify-end gap-2 border border-green-500">
            <LanguageToggle />
          </header>
          <main className="w-full p-4 border border-orange-500">
            <Login />
            {/* <h1 className="text-2xl font-bold">{t('common.welcome')}</h1> */}
          </main>
          <footer className='flex justify-between w-full p-4 border border-blue-500'>
            {isLoggedIn ? (
              <>
              logged in placeholder
                <HomeToggle />
                <ThemeToggle />
                <UserInfoToggle />
              </>
            ) : (
              <div className="w-full h-8"></div>
            )}
          </footer>
        </div>
      </ThemeProvider>
    </LanguageProvider>
    </AuthProvider>
  )
}

export default App
