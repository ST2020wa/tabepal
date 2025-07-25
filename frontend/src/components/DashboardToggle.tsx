import { useNavigate } from "react-router-dom"

export function DashboardToggle() {
  const navigate = useNavigate()

  const handleDashboardClick = () => {
    navigate('/dashboard')
  }

  return (
    <button className="w-12 h-12 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center" onClick={handleDashboardClick}>
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
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    </button>
  )
} 