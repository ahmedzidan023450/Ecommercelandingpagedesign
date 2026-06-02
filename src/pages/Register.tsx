import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Shield, ArrowRight } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    adminCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // التأكد من تطابق كلمة المرور
    if (formData.password !== formData.confirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // بنبعت الداتا بنفس المسميات اللي في الـ API بالظبط
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'حدث خطأ أثناء إنشاء الحساب.');
      }

      alert('تم إنشاء الحساب بنجاح! 🎉 يمكنك تسجيل الدخول الآن.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-950 mb-2">حساب جديد</h2>
          <p className="text-gray-500">انضم إلينا واستمتع بتجربة تسوق مميزة</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* الاسم الكامل */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <User size={20} />
            </div>
            <input 
              type="text" 
              name="fullName"
              required 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="الاسم الكامل" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
            />
          </div>

          {/* الإيميل */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <Mail size={20} />
            </div>
            <input 
              type="email" 
              name="email"
              required 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="البريد الإلكتروني" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          {/* رقم الجوال */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <Phone size={20} />
            </div>
            <input 
              type="tel" 
              name="phoneNumber"
              required 
              value={formData.phoneNumber} 
              onChange={handleChange} 
              placeholder="رقم الجوال (مثال: 0539404559)" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          {/* كلمة المرور */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              name="password"
              required 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="كلمة المرور" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type="password" 
              name="confirmPassword"
              required 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              placeholder="تأكيد كلمة المرور" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-left"
              dir="ltr"
            />
          </div>

          {/* كود الأدمن (اختياري) */}
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-amber-500">
              <Shield size={20} />
            </div>
            <input 
              type="text" 
              name="adminCode"
              value={formData.adminCode} 
              onChange={handleChange} 
              placeholder="كود الإدارة (اختياري، اتركه فارغاً للعملاء)" 
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl py-3.5 pr-12 pl-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-amber-700/50"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-950 text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 transition-colors ${loading ? 'opacity-70' : 'hover:bg-blue-900 shadow-lg shadow-blue-950/30'}`}
          >
            {loading ? 'جاري إنشاء الحساب...' : (
              <><span>إنشاء حساب</span><ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-amber-600 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}