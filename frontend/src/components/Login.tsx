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
            login(data.token)
        }catch(error){
            console.error("login error", error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <header className="text-wrap font-semibold text-2xl mb-4">{t('auth.login')}</header>
            <div className="flex flex-col gap-4 w-full max-w-md">
                <div className="flex items-center gap-2">
                    <span className="w-32">{t('auth.email')}:</span>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-2 py-1 flex-1 border-b border-gray-300"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-32">{t('auth.password')}:</span>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-2 py-1 flex-1 border-b border-gray-300"
                    />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-3xl hover:from-indigo-700 hover:to-indigo-900 transition-colors duration-200" onClick={handleLogin} >
                    {t('auth.login')}
                </button>
                <div className="text-center mt-4">
                    {t('auth.noAccount')}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-600 ml-1">
                        {t('auth.signup')}
                    </Link>
                </div>
            </div>
        </div>
    )
} 