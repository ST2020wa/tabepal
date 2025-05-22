import './App.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <header className="p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <main className="container mx-auto p-4">
          hello world
        </main>
      </div>
    </ThemeProvider>
  )
}

export default App
