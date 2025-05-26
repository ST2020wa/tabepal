import { useTranslation } from "react-i18next"

export function Login() {
    const { t } = useTranslation()

    return (
        <div>
            <header className="text-wrap">{t('auth.login')}</header>
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Log in</button>
            <div className="text-wrap">{t('auth.noAccount')}<a href="#"> {t('auth.signup')}</a></div>
        </div>
      
    )
  } 