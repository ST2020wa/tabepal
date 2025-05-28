import { createContext, useContext, useState } from "react";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] =useState<User | null>(null);

    const login = (token: string, userData: User) =>{
        localStorage.setItem('token', token);
        setUser(userData);
        setIsLoggedIn(true);
    };
    const logout = () =>{
        localStorage.removeItem('token');
        setUser(null);
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