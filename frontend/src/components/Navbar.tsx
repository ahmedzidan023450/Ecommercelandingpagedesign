import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenCart }: { onOpenCart: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(false);
    navigate('/');
  };

  const cartCount = Array.isArray(cartItems) ? cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 0;

  return (
    <nav className="bg-blue-950 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* الشعار */}
          <div className="flex items-center gap-2">
            <Link to="/" className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
              <img src="/favicon.jpeg" alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-amber-500/50" />
              Roya Furniture institution
            </Link>
          </div>

          {/* روابط الأقسام (للشاشات الكبيرة) */}
          <div className="hidden md:flex items-center gap-8 font-bold text-gray-200">
            <Link to="/" className="hover:text-amber-500 transition-colors">الرئيسية</Link>
            <Link to="/single-bedrooms" className="hover:text-amber-500 transition-colors">غرف مفردة</Link>
            <Link to="/double-bedrooms" className="hover:text-amber-500 transition-colors">غرف مزدوجة</Link>
            <Link to="/kids-bedrooms" className="hover:text-amber-500 transition-colors">غرف أطفال</Link>
            <Link to="/sofas" className="hover:text-amber-500 transition-colors">كنب ومجالس</Link>
            <Link to="/wardrobe-rooms" className="hover:text-amber-500 transition-colors">غرف سحاب</Link>
          </div>

          {/* أيقونات المستخدم والسلة */}
          <div className="flex items-center gap-4">
            {/* أيقونة السلة */}
            {user?.role !== 'Admin' && (
              <button onClick={onOpenCart} className="relative p-2 hover:bg-blue-900 rounded-full transition-colors" title="سلة المشتريات">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* أيقونات الحساب (حسب حالة تسجيل الدخول) */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4 border-r border-blue-800 pr-4">
                <Link to={user?.role === 'Admin' ? '/admin' : '/profile'} className="flex items-center gap-2 hover:text-amber-500 font-bold transition-colors">
                  <User size={20} />
                  <span className="max-w-[100px] truncate">
                    {user?.fullName?.split(' ')[0] || user?.name || 'حسابي'}
                  </span>
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-colors" title="تسجيل الخروج">
                  <LogOut size={18} /> خروج
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4 border-r border-blue-800 pr-4">
                <Link to="/login" className="hover:text-amber-500 font-bold transition-colors">تسجيل الدخول</Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold px-4 py-2 rounded-lg transition-colors shadow-md">إنشاء حساب</Link>
              </div>
            )}

            {/* القائمة الجانبية للموبايل */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 hover:bg-blue-900 rounded-lg transition-colors">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل (الروابط الجانبية) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900 border-t border-blue-800 p-4 flex flex-col gap-4 font-bold shadow-inner">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">الرئيسية</Link>
          <Link to="/single-bedrooms" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">غرف مفردة</Link>
          <Link to="/double-bedrooms" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">غرف مزدوجة</Link>
          <Link to="/kids-bedrooms" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">غرف أطفال</Link>
          <Link to="/sofas" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">كنب ومجالس</Link>
          <Link to="/wardrobe-rooms" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">غرف سحاب</Link>

          <hr className="border-blue-800 my-2" />

          {isAuthenticated ? (
            <>
              <Link to={user?.role === 'Admin' ? '/admin' : '/profile'} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-amber-500">
                <User size={20} /> حسابي ({user?.role === 'Admin' ? 'لوحة الإدارة' : 'الملف الشخصي'})
              </Link>
              <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-2 text-red-400 text-right w-full hover:text-red-300">
                <LogOut size={20} /> تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-amber-500">تسجيل الدخول</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-500">إنشاء حساب جديد</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
