import { useNavigate } from "react-router-dom"

export function SettingsToggle() {

  const navigate = useNavigate()

const handleSettingsClick = () => {
    navigate('/settings')
}

  return (
    <button className="w-12 h-12 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center" onClick={handleSettingsClick}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </button>
  )
} 