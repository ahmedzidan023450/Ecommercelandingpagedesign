import React from "react";
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Wrench, 
  ShieldCheck, 
  Truck,
  Instagram,
  Twitter,
  Facebook,
  MapPin,
  Mail,
  ChevronLeft
} from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";

const products = [
  {
    id: 1,
    title: "غرفة نوم عصرية متكاملة",
    price: "4,500 ر.س",
    image: "https://images.unsplash.com/photo-1762606368623-81bb2d5f5778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwZnVybml0dXJlJTIwc2V0fGVufDF8fHx8MTc3ODAwMjM4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "سرير خشبي بتصميم مبسط",
    price: "2,200 ر.س",
    image: "https://images.unsplash.com/photo-1768253843445-49fa5f4a801f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwd29vZGVuJTIwYmVkfGVufDF8fHx8MTc3ODAwMjM4OHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "غرفة نوم رئيسية فاخرة",
    price: "6,800 ر.س",
    image: "https://images.unsplash.com/photo-1772563214602-3c6434766700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwbWFzdGVyJTIwYmVkcm9vbSUyMGJlZHxlbnwxfHx8fDE3NzgwMDIzODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "طقم غرفة نوم أطفال",
    price: "3,100 ر.س",
    image: "https://images.unsplash.com/photo-1769690398773-7bd5122ab719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwYmVkcm9vbSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzgwMDIzODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    title: "دولاب ملابس حديث",
    price: "1,850 ر.س",
    image: "https://images.unsplash.com/photo-1769690398694-9c5d5ca4b4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1vZGVybiUyMHdhcmRyb2JlJTIwYmVkcm9vbXxlbnwxfHx8fDE3NzgwMDIzODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 6,
    title: "طقم سرير كلاسيكي فخم",
    price: "7,500 ر.س",
    image: "https://images.unsplash.com/photo-1712172424737-fb0e5bb99e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGFzc2ljJTIwbHV4dXJ5JTIwYmVkJTIwc2V0fGVufDF8fHx8MTc3ODAwMjM4OXww&ixlib=rb-4.1.0&q=80&w=1080",
  }
];

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-['Cairo',_sans-serif] text-slate-800">
      
      {/* Top Bar */}
      <div className="bg-blue-950 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-amber-500" />
            <span dir="ltr" className="font-semibold">+966 50 000 0000</span>
          </div>
          <a 
            href="https://wa.me/966500000000" 
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
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-950 rounded-lg flex items-center justify-center">
                <span className="text-amber-500 font-bold text-xl">ر</span>
              </div>
              <span className="font-bold text-2xl text-blue-950 tracking-tight">مؤسسة رؤية للأثاث</span>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex gap-8">
              <a href="#" className="text-blue-950 font-semibold hover:text-amber-600 transition-colors">الرئيسية</a>
              <a href="#products" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم نفرين</a>
              <a href="#products" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم نفر</a>
              <a href="#products" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">غرف نوم أطفال</a>
              <a href="#products" className="text-slate-600 hover:text-amber-600 transition-colors font-medium">سرائر و دواليب</a>
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 shadow-lg absolute w-full">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-blue-950 font-semibold block py-2 border-b border-gray-50">الرئيسية</a>
              <a href="#products" className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم نفرين</a>
              <a href="#products" className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم نفر</a>
              <a href="#products" className="text-slate-600 font-medium block py-2 border-b border-gray-50">غرف نوم أطفال</a>
              <a href="#products" className="text-slate-600 font-medium block py-2 border-b border-gray-50">سرائر و دواليب</a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc3ODk5NTMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Bedroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-blue-950/80 to-blue-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl text-white">
            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 text-amber-400 font-medium text-sm mb-4 border border-amber-500/30">
              أثاث فاخر بجودة عالية
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              غرف نوم وطني من المصنع مباشرة <br/>
              <span className="text-amber-500">مع تركيب مجاني</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg leading-relaxed">
              توصيل مجاني في الرياض | الدفع عند الاستلام | ضمان مصنعي على جميع منتجاتنا.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#products" 
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-lg font-bold text-lg text-center transition-all shadow-lg shadow-amber-600/30"
              >
                تصفح التشكيلة
              </a>
              <a 
                href="https://wa.me/966500000000" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-4 rounded-lg font-bold text-lg text-center transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                <span>تواصل معنا</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x-reverse md:divide-x divide-gray-100">
            <div className="p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-950">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">خشب تايلندي عالي الجودة</h3>
              <p className="text-gray-500 text-sm leading-relaxed">نستخدم أفضل أنواع الخشب المقاوم للرطوبة والخدش لضمان استدامة الأثاث لسنوات طويلة.</p>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 text-amber-600">
                <Wrench size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">تصاميم مخصصة</h3>
              <p className="text-gray-500 text-sm leading-relaxed">نقدم خدمة التفصيل حسب الطلب والمقاسات التي تناسب مساحتك بكل دقة واحترافية.</p>
            </div>

            <div className="p-6 flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
                <Truck size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">توصيل وتركيب مجاني</h3>
              <p className="text-gray-500 text-sm leading-relaxed">خدمة التوصيل والتركيب مجانية بالكامل داخل مدينة الرياض بأيدي فنيين متخصصين.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">تشكيلتنا المميزة</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              اختر من بين مجموعتنا الواسعة من غرف النوم العصرية والكلاسيكية التي تناسب ذوقك وتلبي احتياجاتك.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <ImageWithFallback 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-950 font-bold px-3 py-1.5 rounded-lg text-sm">
                    {product.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{product.title}</h3>
                  
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-amber-500"/>ضمان مصنعي علي جميع منتجاتنا</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1"><Wrench size={16} className="text-amber-500"/> تركيب مجاني</span>
                  </div>

                  <a 
                    href={`https://wa.me/966500000000?text=أرغب بالاستفسار عن: ${product.title}`}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold transition-colors shadow-md shadow-emerald-500/20"
                  >
                    <MessageCircle size={20} />
                    <span>اطلب الآن عبر الواتساب</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <a href="https://wa.me/966500000000" className="inline-flex items-center gap-2 text-blue-950 font-bold hover:text-amber-600 transition-colors text-lg group">
              <span>هل تبحث عن تصميم مخصص؟ تواصل معنا</span>
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white pt-16 pb-8 border-t-[6px] border-amber-500">
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
                <li><a href="#" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> الرئيسية</a></li>
                <li><a href="#products" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف النوم الرئيسية</a></li>
                <li><a href="#products" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف الأطفال</a></li>
                <li><a href="#products" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> غرف نوم سحاب</a></li>
                <li><a href="#products" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> الدواليب والتخزين</a></li>
                <li><a href="#" className="text-blue-200 hover:text-amber-500 transition-colors text-sm flex items-center gap-2"><ChevronLeft size={14}/> سياسة الضمان والاسترجاع</a></li>
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
                <div className="flex items-center gap-3">
                  <Phone className="text-amber-500 flex-shrink-0" size={20} />
                  <span dir="ltr" className="text-blue-200 font-medium">+966 50 000 0000</span>
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
  );
}
