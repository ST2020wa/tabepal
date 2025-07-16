import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import { LanguageToggle } from './components/LanguageToggle'
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
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { DashboardToggle } from './components/DashboardToggle'
import { Dashboard } from './components/Dashboard'
import { store } from './store'
import { Provider } from 'react-redux'

function AppContent() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="flex flex-col justify-between min-h-screen w-screen">
          <header className="w-full p-4 flex justify-end gap-2">
            {!isLoggedIn && <LanguageToggle />}
          </header>
          <main className="w-full p-4 flex-1 flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Routes location={location}>
                    <Route path='/login' element={!isLoggedIn ? <Login/> : <Navigate to="/"/>}></Route>
                    <Route path='/signup' element={!isLoggedIn ? <Signup/> : <Navigate to="/login"/>}></Route>
                    <Route path='/' element={isLoggedIn ? <Inventory/> : <Navigate to="/login"/>}></Route>
                    <Route path='/shoplist' element={isLoggedIn ? <Shoplist/> : <Navigate to="/login"/>}></Route>
                    <Route path='/settings' element={isLoggedIn ? <Settings/> : <Navigate to="/login"/>}></Route>
                    <Route path='/shoplist/:id' element={<ShoplistItem />}></Route>
                    <Route path='/dashboard' element={isLoggedIn ? <Dashboard/> : <Navigate to="/login"/>}></Route>
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>   
          <footer className='flex justify-center w-full gap-4 p-4'>
            {isLoggedIn ? (
              <>
                <ShoplistToggle />
                <HomeToggle />
                <DashboardToggle />
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
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <ToastContainer />
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  )
}

export default App
