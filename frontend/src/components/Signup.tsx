import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

export function Signup() {
    const { t } = useTranslation()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSignup = async () => {
        console.log('sign up clicked:', email, password);
        
        // try{
        //     const response = await fetch('http://localhost:4000/api/auth/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email, password })
        //     });
        //     const data = await response.json();
        //     if(!response.ok){
        //         throw new Error(data.error || "Login failed");
        //     }
        //     login(data.token, data.user)
        // }catch(error){
        //     console.error("login error", error);
        // }
    }

    return (
        <div>
            <header className="text-wrap font-bold text-xl">{t('auth.signup')}</header>
            <div className="flex flex-col gap-4 items-center justify-center">
                <div className="flex items-center gap-2">
                    <span>{t('auth.email')}:</span>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span>{t('auth.password')}:</span>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span>{t('auth.confirmPassword')}:</span>
                    <input 
                        type="password" 
                        placeholder="Confirm password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-2 py-1 border rounded"
                    />
                </div>
            </div>
            <button onClick={handleSignup}>{t('auth.signup')}</button>
            <div className="text-wrap">{t('auth.hasAccount')} <Link to="/login">{t('auth.login')}</Link></div>
        </div>
      
    )
  } 