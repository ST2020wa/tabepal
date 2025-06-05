import { useState } from "react"
import { useTranslation } from "react-i18next"

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
            <header className="text-wrap">{t('auth.signup')}</header>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input type="password" placeholder="Confirm password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignup}>{t('auth.signup')}</button>
            <div className="text-wrap">{t('auth.noAccount')}<a href="#"> {t('auth.signup')}</a></div>
        </div>
      
    )
  } 