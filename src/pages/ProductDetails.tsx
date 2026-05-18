import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ShieldCheck, Wrench, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

// المنتجات متضاف ليها inStock (خليت رقم 2 غير متاح عشان تجرب)
const products = [
  { id: 1, title: "غرفة نوم عصرية متكاملة", price: "4,500 ر.س", inStock: true, image: "https://images.unsplash.com/photo-1762606368623-81bb2d5f5778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "غرفة نوم عصرية بتصميم فريد يجمع بين الأناقة والراحة. مصنوعة من خشب تايلندي عالي الجودة مقاوم للخدش والرطوبة. تتكون من سرير مزدوج، دولاب 6 درف، 2 كمودينو، وتسريحة مع مرآة مضيئة." },
  { id: 2, title: "سرير خشبي بتصميم مبسط", price: "2,200 ر.س", inStock: false, image: "https://images.unsplash.com/photo-1768253843445-49fa5f4a801f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "سرير خشبي صلب بتصميم مبسط (Minimalist) يناسب المساحات العصرية. يتميز بظهر سرير منجد بقماش فاخر قابل للتنظيف، وهيكل خشبي متين يتحمل الأوزان الثقيلة." },
  { id: 3, title: "غرفة نوم رئيسية فاخرة", price: "6,800 ر.س", inStock: true, image: "https://images.unsplash.com/photo-1772563214602-3c6434766700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "طقم غرفة نوم رئيسية (Master Bedroom) بتصميم كلاسيكي فاخر يضفي لمسة من الفخامة الملكية على غرفتك. الخشب معالج بأفضل أنواع الدهانات الإيطالية لضمان بقاء اللون ورونقه لسنوات." },
  { id: 4, title: "طقم غرفة نوم أطفال", price: "3,100 ر.س", inStock: true, image: "https://images.unsplash.com/photo-1769690398773-7bd5122ab719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "غرفة نوم أطفال مبهجة وعملية. مصممة بألوان زاهية وآمنة تماماً للأطفال (دهانات غير سامة). تشمل سرير مفرد، مكتب دراسة مدمج، ودولاب ملابس عملي لتخزين الألعاب والملابس." },
  { id: 5, title: "دولاب ملابس حديث", price: "1,850 ر.س", inStock: true, image: "https://images.unsplash.com/photo-1769690398694-9c5d5ca4b4ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "دولاب ملابس بتصميم عصري (درف سحاب) لتوفير المساحة. مقسم من الداخل بذكاء ليحتوي على أرفف متعددة، أدراج سفلية، ومساحة واسعة لتعليق الملابس الطويلة." },
  { id: 6, title: "طقم سرير كلاسيكي فخم", price: "7,500 ر.س", inStock: true, image: "https://images.unsplash.com/photo-1712172424737-fb0e5bb99e18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", description: "سرير كلاسيكي فخم لمحبي الذوق الرفيع. يأتي مع حفر يدوي دقيق على الخشب، وظهر منجد بالجلد الطبيعي الفاخر. يمثل قطعة فنية حقيقية في غرفة نومك." }
];

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-10">
        <h2 className="text-3xl font-bold text-blue-950 mb-4">عذراً، المنتج غير موجود!</h2>
        <Link to="/" className="text-amber-600 font-bold hover:underline">العودة للرئيسية</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-8 font-medium">
          <ArrowRight size={20} />
          <span>العودة للمنتجات</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            
            <div className="h-[400px] md:h-[600px] relative">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-blue-950 font-bold px-4 py-2 rounded-xl text-lg shadow-lg">
                {product.price}
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col justify-center">
              
              {/* بادج التوفر */}
              {product.inStock ? (
                <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-emerald-600 font-medium text-sm mb-4 w-max border border-emerald-200">
                  متوفر في المخزون
                </span>
              ) : (
                <span className="inline-block py-1 px-3 rounded-full bg-red-50 text-red-600 font-medium text-sm mb-4 w-max border border-red-200">
                  نفدت الكمية (غير متاح)
                </span>
              )}
              
              <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-6 leading-tight">
                {product.title}
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-950"><ShieldCheck size={20}/></div>
                  <span className="font-medium">ضمان مصنعي شامل على الخشب والإكسسوارات</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"><Truck size={20}/></div>
                  <span className="font-medium">توصيل مجاني داخل مدينة الرياض</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Wrench size={20}/></div>
                  <span className="font-medium">التركيب مجاني بأيدي فنيين متخصصين</span>
                </div>
              </div>

              {/* زرار الإضافة */}
              <button 
                onClick={() => {
                  if (product.inStock) {
                    addToCart(product);
                    alert('تمت الإضافة للسلة بنجاح يا هندسة! 🛒');
                  }
                }}
                disabled={!product.inStock}
                className={`w-full rounded-xl py-4 px-6 flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg ${
                  product.inStock 
                  ? 'bg-blue-950 hover:bg-blue-900 text-white shadow-blue-950/20 active:scale-95' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
                }`}
              >
                <ShoppingCart size={24} />
                <span>{product.inStock ? 'أضف إلى السلة' : 'غير متوفر حالياً'}</span>
              </button>
              
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}