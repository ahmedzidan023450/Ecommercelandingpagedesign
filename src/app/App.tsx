import React from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  Phone, MessageCircle, Menu, X, Instagram, 
  Twitter, Facebook, MapPin, Mail, ChevronLeft
} from "lucide-react";

// استيراد الصفحات بتاعتنا
import Home from "../pages/Home";
import DoubleBedrooms from "../pages/DoubleBedrooms";
import SingleBedrooms from "../pages/SingleBedrooms";
import KidsBedrooms from "../pages/KidsBedrooms";
import BedsAndWardrobes from "../pages/BedsAndWardrobes";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <BrowserRouter>
      <div dir="rtl" className="min-h-screen bg-gray-50 font-['Cairo',_sans-serif] text-slate-800 flex flex-col">
        
        {/* Top Bar - الشريط الأزرق اللي فوق */}
        <div className="bg-blue-950 text-white py-2 px-4 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            {/* تعديل الرقم فوق */}
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-amber-500" />
              <span dir="ltr" className="font-semibold">0000000000000</span>
            </div>
            {/* تعديل زرار الواتس اللي في التوب بار */}
            <a 
              href="https://wa.me/00000000000000000?text=مرحباً، أريد التواصل معكم بخصوص الأثاث" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 transition-colors px-4 py-1.5 rounded-full font-medium text-xs sm:text-sm"
            >
              <MessageCircle size={16} />
              <span>اطلب عبر الواتساب</span>
            </a>
          </div>
        </div>

        {/* Main Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              
              {/* Logo */}
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
                  <span className="text-amber-500 font-bold text-xl">ر</span>
                </div>
                <span className="font-bold text-2xl text-blue-950 tracking-tight">مؤسسة رؤية للأثاث</span>
              </Link>

              {/* Desktop Menu */}
              <nav className="hidden md:flex gap-8">
                <Link to="/" className="text-blue-950 font-semibold hover:text-amber-600 transition-colors">الرئيسية</Link>
                <Link to="/double-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم نفرين</Link>
                <Link to="/single-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم نفر</Link>
                <Link to="/kids-bedrooms" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم أطفال</Link>
                <Link to="/beds-wardrobes" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">سرائر و دواليب</Link>
              </nav>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={toggleMenu}
                  className="text-blue-950 hover:text-amber-600 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full">
              <div className="flex flex-col gap-4">
                <Link to="/" onClick={toggleMenu} className="text-blue-950 font-semibold block py-2 border-b border-gray-50">الرئيسية</Link>
                <Link to="/double-bedrooms" onClick={toggleMenu} className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم نفرين</Link>
                <Link to="/single-bedrooms" onClick={toggleMenu} className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم نفر</Link>
                <Link to="/kids-bedrooms" onClick={toggleMenu} className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم أطفال</Link>
                <Link to="/beds-wardrobes" onClick={toggleMenu} className="text-slate-600 font-medium block py-2 border-b border-gray-50">سرائر و دواليب</Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/double-bedrooms" element={<DoubleBedrooms />} />
            <Route path="/single-bedrooms" element={<SingleBedrooms />} />
            <Route path="/kids-bedrooms" element={<KidsBedrooms />} />
            <Route path="/beds-wardrobes" element={<BedsAndWardrobes />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-[6px] border-amber-500 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              
              {/* Brand Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <span className="text-blue-950 font-bold text-xl">ر</span>
                  </div>
                  <span className="font-bold text-2xl text-white tracking-tight">مؤسسة رؤية للأثاث</span>
                </div>
                <p className="text-blue-200 text-sm leading-relaxed mb-6">
                  نقدم لك أرقى تصاميم غرف النوم بجودة تفوق التوقعات وبأسعار من المصنع مباشرة. راحتك تبدأ من هنا.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-amber-500 transition-colors text-white">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-amber-500 transition-colors text-white">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center hover:bg-amber-500 transition-colors text-white">
                    <Facebook size={18} />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white">روابط سريعة</h4>
                <ul className="space-y-3">
                  <li><Link to="/" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> الرئيسية</Link></li>
                  <li><Link to="/double-bedrooms" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف النوم الرئيسية</Link></li>
                  <li><Link to="/kids-bedrooms" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف الأطفال</Link></li>
                  <li><Link to="/single-bedrooms" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف نوم سحاب</Link></li>
                  <li><Link to="/beds-wardrobes" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> الدواليب والتخزين</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2">
                <h4 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
                  تواصل معنا
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-amber-500 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <span className="block font-bold text-white mb-1">المعرض الرئيسي</span>
                      <span className="text-blue-200 text-sm">الرياض، طريق الملك عبدالله، حي الواحة، المملكة العربية السعودية</span>
                    </div>
                  </div>
                  {/* تعديل الرقم في الفوتر هنا */}
                  <div className="flex items-center gap-3">
                    <Phone className="text-amber-500 flex-shrink-0" size={20} />
                    <span dir="ltr" className="text-blue-200 font-medium">0000000000000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="text-amber-500 flex-shrink-0" size={20} />
                    <span className="text-blue-200">info@royafurniture.com</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-8 border-t border-blue-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-blue-300">
              <p>جميع الحقوق محفوظة © 2026 مؤسسة رؤية للأثاث.</p>
              <p>صنع بكل إتقان في المملكة العربية السعودية</p>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}