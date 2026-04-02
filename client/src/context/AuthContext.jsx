import { createContext, useContext, useEffect, useState } from 'react';
import { me } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUserState] = useState(() => {
        const cached = localStorage.getItem('hw_user');
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(true);

    const setUser = (u) => {
        setUserState(u);
        u ? localStorage.setItem('hw_user', JSON.stringify(u)) 
          : localStorage.removeItem('hw_user');
    }

    useEffect(() => {
        me().then(d => {
            if (d.loggedIn) {
                setUser(d.user);
            } else {
                // Backend says not logged in, clear frontend state
                setUser(null);
            }
            setLoading(false);
        }).catch((e) => {
            console.log('auth check failed', e);
            // On error, clear state to be safe
            setUser(null);
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
