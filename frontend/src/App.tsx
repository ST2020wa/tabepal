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
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Signup } from './components/Signup'

function AppContent() {
  const { t } = useTranslation()
  const { isLoggedIn, logout } = useAuth();

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="flex flex-col justify-between min-h-screen w-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-red-500">
          <header className="w-full p-4 flex justify-end gap-2 border border-green-500">
            <LanguageToggle />
            {isLoggedIn && <button onClick={logout}>{t('common.logout')}</button>}
          </header>
          <main className="w-full p-4 border border-orange-500">
          <Routes>
                <Route path='/login' element={!isLoggedIn ? <Login/> : <Navigate to="/"/>}></Route>
                <Route path='/signup' element={!isLoggedIn ? <Signup/> : <Navigate to="/"/>}></Route>
                <Route path='/' element={isLoggedIn ? <>{t('common.welcome')} 😊</> : <Navigate to="/login"/>}></Route>
              </Routes>
            {/* {isLoggedIn ? <>{t('common.welcome')} 😊</> : <Login />} */}
          </main>   
          <footer className='flex justify-between w-full p-4 border border-blue-500'>
            {isLoggedIn ? (
              <>
                <HomeToggle />
                <ThemeToggle />
                <UserInfoToggle />
              </>
            ) : (
              <div className="w-full h-8">not logged in</div>
            )}
          </footer>
        </div>
      </ThemeProvider>
    </LanguageProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
        <AuthProvider>
      <AppContent />
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
