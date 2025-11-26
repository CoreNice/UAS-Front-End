import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';

export interface User {
    _id?: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    avatarUrl?: string | null;
    created_at?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    register: (name: string, email: string, password: string, passwordConfirm: string) => Promise<{ success: boolean; message?: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; message?: string }>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const verifyTokenRef = useRef<(tokenToVerify: string) => Promise<boolean>>();

    verifyTokenRef.current = async (tokenToVerify: string) => {
        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${tokenToVerify}` },
            });

            if (!response.ok) {
                console.error('Token verification failed: Invalid response');
                return false;
            }

            const userData = await response.json();
            setUser(userData);
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    };

    useEffect(() => {
        const loadAuth = async () => {
            const savedToken = localStorage.getItem('auth_token');
            const savedUser = localStorage.getItem('auth_user');
            console.log('Loaded auth from storage:', { savedToken, savedUser });
            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);

                    if (verifyTokenRef.current) {
                        const isValid = await verifyTokenRef.current(savedToken);
                        if (isValid) {
                            setToken(savedToken);
                        } else {
                            console.warn('Stored token is invalid');
                            localStorage.removeItem('auth_token');
                            localStorage.removeItem('auth_user');
                            setToken(null);
                            setUser(null);
                        }
                    }
                } catch (error) {
                    console.error('Failed to parse saved user data:', error);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                    setToken(null);
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        loadAuth();
    }, []);

    const logout = useCallback(async () => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        try {
            if (token) {
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } catch (error) {
            console.error('Logout request failed:', error);
        }

        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    }, [token]);

    const resetInactivityTimer = useCallback(() => {
        if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
        }

        if (!token || !user) return;

        inactivityTimeoutRef.current = setTimeout(() => {
            console.log('Auto-logout due to inactivity');
            logout();
        }, 15 * 60 * 1000);
    }, [token, user, logout]);

    useEffect(() => {
        if (!token || !user) return;

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        const handler = () => resetInactivityTimer();

        events.forEach((event) => {
            window.addEventListener(event, handler);
        });

        resetInactivityTimer();

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handler);
            });
        };
    }, [token, user, resetInactivityTimer]);

    const register = async (
        name: string,
        email: string,
        password: string,
        passwordConfirm: string
    ): Promise<{ success: boolean; message?: string }> => {
        if (password !== passwordConfirm) {
            return { success: false, message: 'Passwords do not match' };
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, password_confirmation: passwordConfirm }),
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || data.errors?.email?.[0] || 'Registration failed',
                };
            }

            return { success: true, message: 'Registration successful. Please log in.' };
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const login = async (
        email: string,
        password: string
    ): Promise<{ success: boolean; message?: string }> => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || 'Login failed' };
            }

            const newToken = data.token;
            const newUser = data.user;

            setToken(newToken);
            setUser(newUser);
            localStorage.setItem('auth_token', newToken);
            localStorage.setItem('auth_user', JSON.stringify(newUser));

            return { success: true };
        } catch (error) {
            return { success: false, message: 'Network error. Please try again.' };
        }
    };

    const updateProfile = async (
        data: Partial<User>
    ): Promise<{ success: boolean; message?: string }> => {
        if (!token) {
            return { success: false, message: 'Not authenticated' };
        }

        try {
            const formData = new FormData();
            if (data.name) formData.append('name', data.name);
            if (data.avatarUrl) formData.append('avatarUrl', data.avatarUrl);

            const response = await fetch(`${API_URL}/profile/update`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || 'Update failed' };
            }

            const result = await response.json();
            const updatedUser = result.user || result;
            setUser(updatedUser);
            localStorage.setItem('auth_user', JSON.stringify(updatedUser));

            return { success: true, message: 'Profile updated successfully' };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, message: 'Network error' };
        }
    };

    const refreshUser = async () => {
        if (!token) return;
        if (verifyTokenRef.current) {
            await verifyTokenRef.current(token);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!user && !!token,
                register,
                login,
                logout,
                updateProfile,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
