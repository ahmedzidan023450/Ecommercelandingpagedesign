import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, ChevronLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  // إعداد الـ Mutation لإرسال بيانات تسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      // apiClient بيستخدم الـ Base URL اللي في الـ .env تلقائياً
      const res = await apiClient.post('/api/auth/login', credentials);
      return res.data;
    },
    onSuccess: (data) => {
      // حفظ البيانات والتوكن في الـ Context
      login(data.data, data.data.accessToken);
      toast.success('تم تسجيل الدخول بنجاح! 👋');

      // التوجيه الذكي بناءً على الإيميل
      const userRole = data.data.role;

      // التوجيه الذكي بناءً على صلاحية المستخدم من الباك إند
      if (userRole === 'Admin' || userRole === 'admin') {
        navigate('/admin'); // يودي الأدمن للوحة التحكم
      } else {
        navigate('/'); // يودي العميل العادي للرئيسية
      }
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  // استخراج الخطأ لعرضه في الواجهة
  const errorMessage = loginMutation.isError
    ? (loginMutation.error as any)?.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
    : '';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8" dir="rtl">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center mb-4 text-white">
          <LogIn size={36} />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-950">مرحباً بعودتك!</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-blue-900/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-100 font-bold">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none text-left"
                dir="ltr"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none text-left"
                dir="ltr"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-950 hover:bg-blue-900 focus:outline-none transition-colors ${loginMutation.isPending ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loginMutation.isPending ? 'جاري التحقق...' : 'تسجيل الدخول'}
              {!loginMutation.isPending && <ChevronLeft size={20} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟ <Link to="/register" className="font-bold text-amber-600 hover:text-amber-500 transition-colors">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}