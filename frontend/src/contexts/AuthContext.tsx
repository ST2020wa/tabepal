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
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                setUser(user);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []);
    
    const login = (token: string, user: User) =>{
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user)
        setIsLoggedIn(true);
    };
    const logout = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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