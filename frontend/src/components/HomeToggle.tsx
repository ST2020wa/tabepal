import { useNavigate } from "react-router-dom"

export function HomeToggle() {
  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate('/')
  }

  return (
    <button className="w-12 h-12 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center" onClick={handleHomeClick}>
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </button>
  )
} 