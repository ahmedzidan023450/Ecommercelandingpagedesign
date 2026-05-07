import React from "react";
import { Wrench, ShieldCheck, Truck, MessageCircle, ChevronLeft } from "lucide-react";

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

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
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
              {/* تعديل زرار تواصل معنا هنا */}
              <a 
                href="https://wa.me/0000000000000?text=مرحباً مؤسسة رؤية، أريد الاستفسار عن منتجاتكم" 
                target="_blank"
                rel="noopener noreferrer"
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
                  <img 
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
                    <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-amber-500"/>ضمان مصنعي علي كل منتجاتنا</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="flex items-center gap-1"><Wrench size={16} className="text-amber-500"/> تركيب مجاني</span>
                  </div>

                  {/* تعديل زرار المنتجات هنا */}
                  <a 
                    href={`https://wa.me/0000000000000?text=مرحباً، أرغب بالاستفسار عن تفاصيل وسعر هذا المنتج: ${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
            {/* تعديل اللينك اللي تحت خالص هنا */}
            <a 
              href="https://wa.me/00000000000000000?text=مرحباً، أبحث عن تصميم مخصص لغرفة نوم" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-950 font-bold hover:text-amber-600 transition-colors text-lg group"
            >
              <span>هل تبحث عن تصميم مخصص؟ تواصل معنا</span>
              <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}