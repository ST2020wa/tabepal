import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { LanguageToggle } from "./LanguageToggle"

export function Settings() {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-12 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 flex flex-col gap-8">
      {/* 用户名标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
          {user?.name || "User"}
        </h1>
        <p className="text-gray-400 text-sm">{user?.email}</p>
      </div>

      {/* 设置项 */}
      <div className="flex flex-col gap-6">
        {/* 语言切换 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-200 font-medium">Language</span>
          <LanguageToggle />
        </div>
        {/* 明暗模式切换 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-200 font-medium">Theme</span>
          <button
            onClick={toggleTheme}
            className={`
              px-4 py-2 border
              ${theme === 'dark'
                ? 'bg-gray-800 text-white hover:bg-gray-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
              transition
            `}
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        {/* 登出 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-200 font-medium">Logout</span>
          <button className="text-red-500 hover:text-red-600 cursor-pointer text-sm " onClick={logout}>Logout</button>
        </div>
      </div>
    </div>
  )
}