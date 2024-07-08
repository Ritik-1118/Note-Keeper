import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    searchedTitle?: string | null;
    login: (userId: string) => void;
    logout: () => void;
    searchedText: (text: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
        return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false;
    });

    const [userId, setUserId] = useState<string | null>(() => {
        return localStorage.getItem('userId');
    });
    const [searchedTitle, setSearchedTitle] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    useEffect(() => {
        if (userId) {
            localStorage.setItem('userId', userId);
        } else {
            localStorage.removeItem('userId');
        }
    }, [userId]);

    const login = (id: string) => {
        setIsLoggedIn(true);
        setUserId(id);
    };

    const logout = () => {
        console.log("logout called")
        setIsLoggedIn(false);
        setUserId(null);
    };
    
    const searchedText = (text:string) => {
        setSearchedTitle(text);
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout, searchedText, searchedTitle }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
