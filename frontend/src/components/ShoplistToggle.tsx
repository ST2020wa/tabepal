import { useNavigate } from "react-router-dom"

export function ShoplistToggle() {
    const navigate = useNavigate()

    const handleShoplistClick = () => {
        navigate('/shoplist')
    }

    return (
        <button className="w-12 h-12 p-2 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all duration-200 flex items-center justify-center" onClick={handleShoplistClick}>
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
            </svg>
        </button>
    )
}