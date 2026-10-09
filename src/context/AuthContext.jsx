/**
 * AuthContext.jsx
 * Global Authentication state and role-based Route Guard.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(() => {
        try {
            const cached = localStorage.getItem('srr_user');
            return cached ? JSON.parse(cached) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem('srr_token'));
    const [loading, setLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Reset logout flag once navigation to home has settled
    useEffect(() => {
        if (isLoggingOut && location.pathname === '/') {
            setIsLoggingOut(false);
        }
    }, [location.pathname, isLoggingOut]);

    // Verify session on mount
    useEffect(() => {
        let isMounted = true;

        async function verifySession() {
            const storedToken = localStorage.getItem('srr_token');
            if (!storedToken) {
                if (isMounted) {
                    setUser(null);
                    setLoading(false);
                }
                return;
            }

            try {
                const res = await api.get('/api/auth/me');
                if (isMounted && res.success && res.data) {
                    setUser(res.data);
                    localStorage.setItem('srr_user', JSON.stringify(res.data));
                }
            } catch {
                if (isMounted) {
                    localStorage.removeItem('srr_token');
                    localStorage.removeItem('srr_user');
                    setUser(null);
                    setToken(null);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        verifySession();

        const handleUnauthorized = () => {
            if (isMounted) {
                setUser(null);
                setToken(null);
            }
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            isMounted = false;
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (username, password) => {
        const res = await api.post('/api/auth/login', { username, password });
        if (res.success && res.data) {
            const { token: newToken, user: userData } = res.data;
            localStorage.setItem('srr_token', newToken);
            localStorage.setItem('srr_user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
            return userData;
        }
        throw new Error(res.message || 'Login failed');
    };

    const logout = () => {
        setIsLoggingOut(true);
        localStorage.removeItem('srr_token');
        localStorage.removeItem('srr_user');
        setUser(null);
        setToken(null);
        navigate('/', { replace: true });
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, isLoggingOut, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

/**
 * ProtectedRoute component with Role-based access control.
 */
export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading, isLoggingOut } = useAuth();
    const location = useLocation();

    // If an intentional logout is in progress, do not redirect to /login
    if (isLoggingOut) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-semibold">Verifying credentials...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check:
    // Support matching 'reception' and 'receptionist' interchangeably
    const userRole = user.role === 'reception' ? 'receptionist' : user.role;
    const normalizedAllowedRoles = allowedRoles.map((r) => (r === 'reception' ? 'receptionist' : r));

    if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(userRole) && !normalizedAllowedRoles.includes(user.role)) {
        // Redirect to user's assigned dashboard
        if (user.role === 'student') return <Navigate to="/student" replace />;
        if (user.role === 'teacher') return <Navigate to={`/teacher/${user.subject?.toLowerCase() || 'physics'}`} replace />;
        if (user.role === 'reception') return <Navigate to="/receptionist" replace />;
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        return <Navigate to="/" replace />;
    }

    return children;
}
