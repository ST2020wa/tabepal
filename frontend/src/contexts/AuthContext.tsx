import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // check log in status from localStorage
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('token');
            }
        }
    }, []);
    
    const login = (token: string) =>{
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };
    const logout = () =>{
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };
    return (
        <AuthContext.Provider value={{isLoggedIn, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider')
    }
    //console.log(context);
    
    return context;
}