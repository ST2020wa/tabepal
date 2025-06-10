import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}
interface User {
    id: number
    email: string
    name: string
  }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null)

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
    
    const login = (token: string, user: User) =>{
        localStorage.setItem('token', token);
        setUser(user)
        setIsLoggedIn(true);
    };
    const logout = () =>{
        localStorage.removeItem('token');
        setUser(null) 
        setIsLoggedIn(false);
    };
    return (
        <AuthContext.Provider value={{isLoggedIn, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider')
    }    
    return context;
}