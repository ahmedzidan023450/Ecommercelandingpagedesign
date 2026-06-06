import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axiosConfig';

// شكل بيانات المستخدم بناءً على الـ API Documentation
interface User {
  userId?: number;
  id?: number;
  fullName?: string;
  name?: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: (redirect?: boolean) => void;
  isAuthenticated: boolean;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = (redirect = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    // توجيه المستخدم لصفحة تسجيل الدخول فقط إذا كان التوجيه مطلوباً
    if (redirect) {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => logout(true);
    window.addEventListener('unauthorized', handleUnauthorized);

    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setLoadingAuth(false);
        return;
      }

      try {
        // الربط بالـ API كما في التوثيق: GET /api/auth/me
        // الـ apiClient بيضيف الـ Bearer token أوتوماتيك
        const response = await apiClient.get('/api/auth/me');

        if (response.status === 200) {
          setToken(storedToken);
          setUser(response.data);
        }
      } catch (error) {
        console.warn("Token expired or invalid.");
        logout(false); // مسح البيانات بدون توجيه إجباري عشان لو كان في صفحة عامة زي الرئيسية
      } finally {
        setLoadingAuth(false);
      }
    };

    verifyToken();

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loadingAuth }}>
      {!loadingAuth ? (
        children
      ) : (
        <div className="min-h-screen flex items-center justify-center text-blue-950 font-bold" dir="rtl">
          جاري التحقق من بيانات الدخول... ⏳
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}