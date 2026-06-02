import React, { useState } from "react";
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Menu, X, MapPin, Mail, ChevronLeft, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; 
import CartSidebar from '../components/CartSidebar';
import Login from '../pages/Login';
import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";
import Checkout from "../pages/Checkout";
import AdminDashboard from "../pages/AdminDashboard";
import Register from '../pages/Register';
import UserProfile from "../pages/UserProfile"; 
import Sofas from '../pages/Sofas';
import KidsBedrooms from '../pages/KidsBedrooms';
import SingleBedrooms from '../pages/SingleBedrooms';
import DoubleBedrooms from '../pages/DoubleBedrooms';

export default function App() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); 

  const cartCount = cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  return (
      <div dir="rtl" className="min-h-screen bg-gray-50 font-['Cairo',_sans-serif] text-slate-800 flex flex-col relative overflow-x-hidden">
        
        {/* التوب بار */}
        <div className="bg-blue-950 text-white py-2 px-4 text-sm border-b border-blue-900/50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-amber-500" />
                <span dir="ltr" className="font-semibold">0539404559</span>
              </div>
              
              <div className="hidden sm:flex items-center gap-4 border-r border-blue-900 pr-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-amber-500 font-bold">أهلاً {user?.name || user?.fullName || 'بك'}</span>
                    {user?.email?.toLowerCase() === 'ma7243193@gmail.com' ? (
                      <Link to="/admin" className="text-blue-200 hover:text-white flex items-center gap-1 font-bold"><LayoutDashboard size={14}/> لوحة التحكم</Link>
                    ) : (
                      <Link to="/profile" className="text-blue-200 hover:text-white flex items-center gap-1"><User size={14}/> طلباتي</Link>
                    )}
                    <button onClick={handleLogoutClick} className="text-red-400 hover:text-red-300 flex items-center gap-1"><LogOut size={14}/> خروج</button>
                  </div>
                ) : (
                  <Link to="/login" className="text-blue-200 hover:text-white text-xs font-bold flex items-center gap-1">
                    <User size={14} /> تسجيل الدخول / حساب جديد
                  </Link>
                )}
              </div>
            </div>

            <a href="https://wa.me/966539404559" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 transition-colors px-4 py-1.5 rounded-full font-medium text-xs sm:text-sm">
              <MessageCircle size={16} /><span>اطلب عبر الواتساب</span>
            </a>
          </div>
        </div>

        {/* الهيدر */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <img src="/logo.jpg" alt="لوجو مؤسسة رؤية" className="w-12 h-12 rounded-xl object-contain" />
                <span className="font-bold text-2xl text-blue-950 tracking-tight whitespace-nowrap">مؤسسة رؤية للأثاث</span>
              </Link>
              
              <nav className="hidden lg:flex gap-6 items-center">
                <Link to="/" className="text-blue-950 font-semibold hover:text-amber-600 transition-colors whitespace-nowrap">الرئيسية</Link>
                <Link to="/double-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium whitespace-nowrap">غرف نوم نفرين</Link>
                <Link to="/single-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium whitespace-nowrap">غرف نوم نفر و نص</Link>
                <Link to="/kids-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium whitespace-nowrap">غرف نوم أطفال</Link>
                <Link to="/sofas" className="text-slate-600 hover:text-amber-600 transition-colors font-medium whitespace-nowrap">كنب جاهز و تفصيل حسب الطلب</Link>
              </nav>

              <div className="flex items-center gap-4">
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-blue-950 hover:text-amber-600 transition-colors">
                  <ShoppingCart size={28} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button onClick={toggleMenu} className="lg:hidden text-blue-950 hover:text-amber-600 focus:outline-none">
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full left-0 z-50">
              <nav className="flex flex-col gap-4">
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/" className="text-blue-950 font-bold text-lg border-b border-gray-50 pb-2">الرئيسية</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/double-bedrooms" className="text-slate-600 hover:text-amber-600 font-medium text-lg border-b border-gray-50 pb-2">غرف نوم نفرين</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/single-bedrooms" className="text-slate-600 hover:text-amber-600 font-medium text-lg border-b border-gray-50 pb-2">غرف نوم نفر</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/kids-bedrooms" className="text-slate-600 hover:text-amber-600 font-medium text-lg border-b border-gray-50 pb-2">غرف نوم أطفال</Link>
                <Link onClick={() => setIsMobileMenuOpen(false)} to="/sofas" className="text-slate-600 hover:text-amber-600 font-medium text-lg border-b border-gray-50 pb-2">كنب جاهز و تفصيل حسب الطلب</Link>
                
                {isAuthenticated ? (
                  <>
                    {user?.email?.toLowerCase() === 'ma7243193@gmail.com' ? (
                      <Link onClick={() => setIsMobileMenuOpen(false)} to="/admin" className="text-amber-600 font-bold text-lg border-b border-gray-50 pb-2 flex items-center gap-2"><LayoutDashboard size={18}/> لوحة التحكم للأدمن</Link>
                    ) : (
                      <Link onClick={() => setIsMobileMenuOpen(false)} to="/profile" className="text-amber-600 font-bold text-lg border-b border-gray-50 pb-2 flex items-center gap-2"><User size={18}/> طلباتي السابقة</Link>
                    )}
                    <button onClick={() => { setIsMobileMenuOpen(false); handleLogoutClick(); }} className="text-red-500 font-bold text-lg text-right flex items-center gap-2"><LogOut size={18}/> تسجيل الخروج</button>
                  </>
                ) : (
                  <Link onClick={() => setIsMobileMenuOpen(false)} to="/login" className="text-blue-900 font-bold text-lg flex items-center gap-2"><User size={18}/> تسجيل الدخول</Link>
                )}
              </nav>
            </div>
          )}
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> 
            <Route path="/profile" element={<UserProfile />} /> 
            
            {/* مسارات الأقسام الثابتة */}
            <Route path="/sofas" element={<Sofas />} />
            <Route path="/kids-bedrooms" element={<KidsBedrooms />} />
            <Route path="/single-bedrooms" element={<SingleBedrooms />} />
            <Route path="/double-bedrooms" element={<DoubleBedrooms />} />
          </Routes>
        </main>

        <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-[6px] border-amber-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <img src="/logo.jpg" alt="لوجو مؤسسة رؤية" className="w-12 h-12 rounded-xl object-contain" />
                  <span className="font-bold text-2xl tracking-tight">مؤسسة رؤية للأثاث</span>
                </div>
                <p className="text-blue-200 leading-relaxed mb-6 text-sm">
                  نقدم لكم أرقى تشكيلات غرف النوم والأثاث المنزلي بتصاميم عصرية وكلاسيكية تناسب جميع الأذواق، مع خدمات التوصيل والتركيب الاحترافية.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-6 text-amber-500 border-b border-blue-900 pb-3">أقسام المتجر</h3>
                <ul className="space-y-3 text-sm text-blue-200">
                  <li><Link to="/double-bedrooms" className="hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> غرف نوم نفرين</Link></li>
                  <li><Link to="/single-bedrooms" className="hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> غرف نوم نفر و نص</Link></li>
                  <li><Link to="/kids-bedrooms" className="hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> غرف أطفال</Link></li>
                  <li><Link to="/sofas" className="hover:text-white transition-colors flex items-center gap-2"><ChevronLeft size={16}/> كنب جاهز و تفصيل حسب الطلب</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-6 text-amber-500 border-b border-blue-900 pb-3">تواصل معنا</h3>
                <ul className="space-y-4 text-sm text-blue-200">
                  <li className="flex items-start gap-3">
                    <MapPin size={20} className="text-amber-500 shrink-0" />
                    <span>الرياض، حي المصانع، خلف حراج بن قاسم الجديد</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={20} className="text-amber-500 shrink-0" />
                    <span dir="ltr">0539404559</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={20} className="text-amber-500 shrink-0" />
                    <span>ma7243193@gmail.com</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center text-sm text-blue-300">
            <p>جميع الحقوق محفوظة © 2026 مؤسسة رؤية للأثاث.</p>
          </div>
        </footer>

        <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
  );
}