import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export function Login() {
    const { t } = useTranslation()
    const {login} = useAuth();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        try{
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || "Login failed");
            }            
            login(data.token, data.user)
        }catch(error){
            console.error("login error", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md animate-slide-in">
                <header className="text-center font-semibold text-3xl mb-6 text-gray-800 dark:text-gray-100">{t('auth.login')}</header>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('auth.email')}</label>
                        <input 
                            type="email" 
                            placeholder={t('auth.emailPlaceholder')} 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('auth.password')}</label>
                        <input 
                            type="password" 
                            placeholder={t('auth.passwordPlaceholder')} 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    <button 
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105" 
                        onClick={handleLogin}
                    >
                        {t('auth.login')}
                    </button>
                    <div className="text-center mt-4 text-gray-600 dark:text-gray-400">
                        {t('auth.noAccount')}
                        <Link to="/signup" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 ml-1 font-medium">
                            {t('auth.signup')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 