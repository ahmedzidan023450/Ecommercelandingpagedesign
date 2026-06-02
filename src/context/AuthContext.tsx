import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// شكل بيانات المستخدم اللي راجعة من الباك إند
// ضفت شوية احتمالات زي id و name عشان نمشي مع أي مسمى الباك إند بيبعته
interface User {
  userID?: number;
  id?: number;
  fullName?: string;
  name?: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loadingAuth: boolean; // عشان نعرف لو لسة بنتأكد من التوكن
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // بيبدأ بـ true لحد ما نتأكد

  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";

  // التعديل: أول ما الموقع يفتح، بنروح نتأكد من التوكن عن طريق GET /api/auth/me
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      
      if (!storedToken) {
        setLoadingAuth(false);
        return; // مفيش توكن، يبقى مش مسجل دخول
      }

      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          // التوكن سليم، الباك إند رجع بيانات العميل الفريش
          const userData = await response.json();
          setToken(storedToken);
          // بنحفظ الداتا، سواء الباك إند باعتها مباشرة أو جوه أوبجكت اسمه data أو user
          setUser(userData.data || userData.user || userData); 
        } else {
          // التوكن منتهي أو غير صالح، بنطرده أوتوماتيك
          console.warn("Token expired or invalid. Logging out.");
          logout();
        }
      } catch (error) {
        console.error("Error verifying auth token:", error);
        // لو مفيش نت أو السيرفر واقع، بنمشيه باللي في اللوكال ستوريدج مؤقتاً
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } finally {
        setLoadingAuth(false); // خلصنا تأكيد
      }
    };

    verifyToken();
  }, [apiUrl]);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loadingAuth }}>
      {/* مش بنعرض الموقع غير لما نتأكد من هوية اليوزر الأول عشان ميحصلش فلاش */}
      {!loadingAuth ? children : <div className="min-h-screen flex items-center justify-center text-blue-950 font-bold" dir="rtl">جاري التحقق من بيانات الدخول... ⏳</div>}
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