import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { useTranslation } from 'react-i18next'
import './i18n/config'
import { SettingsToggle } from './components/SettingsToggle'
import { HomeToggle } from './components/HomeToggle'
import { Login } from './components/Login'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Signup } from './components/Signup'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Inventory } from './components/Inventory'
import { ShoplistToggle } from './components/ShoplistToggle'
import { Shoplist } from './components/Shoplist'
import { Settings } from './components/Settings'
import { ShoplistItem } from './components/Shoplistitem'

function AppContent() {
  const { t } = useTranslation()
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>{t('common.loading')}</div>
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="flex flex-col justify-between min-h-screen w-screen">
          <main className="w-full p-4 flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <Routes>
                <Route path='/login' element={!isLoggedIn ? <Login/> : <Navigate to="/"/>}></Route>
                <Route path='/signup' element={!isLoggedIn ? <Signup/> : <Navigate to="/"/>}></Route>
                <Route path='/' element={isLoggedIn ? <Inventory/> : <Navigate to="/login"/>}></Route>
                <Route path='/shoplist' element={isLoggedIn ? <Shoplist/> : <Navigate to="/login"/>}></Route>
                <Route path='/settings' element={isLoggedIn ? <Settings/> : <Navigate to="/login"/>}></Route>
                <Route path='/shoplist/:id' element={<ShoplistItem />}></Route>
              </Routes>
            </div>
          </main>   
          <footer className='flex justify-center w-full gap-4 p-4'>
            {isLoggedIn ? (
              <>
                <ShoplistToggle />
                <HomeToggle />
                <SettingsToggle />
              </>
            ) : (
              <div className="w-full h-8"></div>
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
        <ToastContainer />
      <AppContent />
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App
