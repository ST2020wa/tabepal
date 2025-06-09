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
            <header className="text-wrap font-semibold text-2xl mb-4">{t('auth.signup')}</header>
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
                <div className="flex items-center gap-2">
                    <span className="w-32">{t('auth.confirmPassword')}:</span>
                    <input 
                        type="password" 
                        placeholder="Confirm password" 
                        value={confirmedPassword} 
                        onChange={(e) => setConfimedPassword(e.target.value)}
                        className="px-2 py-1 flex-1 border-b border-gray-300"
                    />
                </div>
                {passwordErr && <div className="text-red-500 text-sm">{passwordErr}</div>}
                <button 
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-900 text-white rounded-3xl hover:from-indigo-700 hover:to-indigo-900 transition-colors duration-200" 
                    onClick={handleSignup}
                >
                    {t('auth.signup')}
                </button>
                <div className="text-center mt-4">
                    {t('auth.hasAccount')} 
                    <Link to="/login" className="text-blue-500 hover:text-blue-600 ml-1">
                        {t('auth.login')}
                    </Link>
                </div>
            </div>
        </div>
    )
} 