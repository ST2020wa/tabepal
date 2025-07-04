import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from "react"
import { useTranslation } from "react-i18next"

export function Signup() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfimedPassword]=useState("")
    const [passwordErr, setPasswordErr]=useState("")

    const handleSignup = async () => {
        console.log(password, email)
        if(password !== confirmedPassword){
            setPasswordErr(t('auth.passwordMismatch'));
            return;
        }
        setPasswordErr("");      
        try{
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if(!response.ok){
                throw new Error(data.error || "Login failed");
            }else{
                toast.success(t('auth.signupSuccess'));
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        }catch(error){
            console.error("login error", error);
            toast.error(error instanceof Error ? error.message : "Signup failed");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md animate-slide-in">
                <header className="text-center font-semibold text-3xl mb-6 text-gray-800">{t('auth.signup')}</header>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">{t('auth.email')}</label>
                        <input 
                            type="email" 
                            placeholder="输入邮箱地址" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">{t('auth.password')}</label>
                        <input 
                            type="password" 
                            placeholder="输入密码" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">{t('auth.confirmPassword')}</label>
                        <input 
                            type="password" 
                            placeholder="确认密码" 
                            value={confirmedPassword} 
                            onChange={(e) => setConfimedPassword(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    {passwordErr && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{passwordErr}</div>}
                    <button 
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105" 
                        onClick={handleSignup}
                    >
                        {t('auth.signup')}
                    </button>
                    <div className="text-center mt-4 text-gray-600">
                        {t('auth.hasAccount')} 
                        <Link to="/login" className="text-blue-500 hover:text-blue-600 ml-1 font-medium">
                            {t('auth.login')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
} 