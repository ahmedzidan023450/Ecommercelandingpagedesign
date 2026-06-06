import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { ShoppingCart, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  // جلب تفاصيل المنتج من السيرفر
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/products/${id}`);
      return res.data;
    },
    enabled: !!id // ميعملش الطلب إلا لو في ID
  });

  // التحكم في الكمية والصورة المختارة يدوياً
  const [quantity, setQuantity] = useState(1);
  const [selectedThumb, setSelectedThumb] = useState<string | null>(null);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-blue-950 font-bold" dir="rtl">جاري تحميل تفاصيل الغرفة... ⏳</div>;
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
        <p className="text-2xl text-red-600 font-bold">المنتج غير موجود أو حدث خطأ في السيرفر</p>
        <button onClick={() => navigate('/')} className="text-blue-950 underline font-bold">العودة للرئيسية</button>
      </div>
    );
  }

  // --- استنتاج الصور بذكاء (بدون useEffect) ---
  const fallbackImg = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80";

  // تجميع كل الصور المتاحة (سواء كانت مصفوفة كائنات أو نصوص)
  const productImages = product.images?.length > 0
    ? product.images.map((img: any) => img.url || img)
    : [product.imageUrl || product.image || fallbackImg];

  // الصورة النشطة: إما اللي العميل داس عليها، أو أول صورة من السيرفر كافتراضي
  const activeImage = selectedThumb || productImages[0];

  const handleAddToCart = () => {
    // إرسال ID المنتج والكمية لـ Context السلة
    addToCart(product.id || Number(id), quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* زر العودة */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-blue-950 transition-colors mb-8 font-bold">
          <ArrowRight size={20} />
          <span>رجوع</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">

            {/* قسم معرض الصور (Image Gallery) */}
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 h-[400px] flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name || product.title || 'غرفة أثاث'}
                  className="w-full h-full object-contain"
                  onError={(e: any) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                />
              </div>

              {/* عرض الصور المصغرة لو الغرفة ليها أكتر من صورة */}
              {productImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {productImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedThumb(img)}
                      className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === img ? 'border-amber-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img
                        src={img}
                        alt={`صورة مصغرة ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e: any) => { e.target.onerror = null; e.target.src = fallbackImg; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* قسم تفاصيل المنتج */}
            <div className="flex flex-col">
              <div className="text-gray-400 text-sm font-bold mb-2 tracking-widest uppercase">
                {product.sku && `SKU: ${product.sku}`}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-blue-950 mb-4">{product.name || product.title}</h1>
              <p className="text-3xl font-extrabold text-amber-600 mb-6">{product.price} ر.س</p>

              <div className="prose prose-blue text-gray-600 mb-8 max-w-none leading-relaxed">
                <p>{product.description || "غرفة نوم عصرية بتصميم فريد ومميز تناسب جميع الأذواق، مصنوعة من أجود أنواع الخشب."}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <ShieldCheck className="text-amber-500" size={24} />
                  <span className="font-medium">ضمان مصنعي لمدة 5 سنوات</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <Wrench className="text-amber-500" size={24} />
                  <span className="font-medium">توصيل وتركيب مجاني داخل الرياض</span>
                </div>
              </div>

              {user?.role !== 'Admin' && (
                <>
                  {/* اختيار الكمية */}
                  <div className="flex items-center gap-4 mb-8">
                    <span className="font-bold text-gray-700">الكمية:</span>
                    <div className="flex items-center bg-gray-100 rounded-xl border border-gray-200">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-xl hover:bg-gray-200 rounded-r-xl transition-colors">-</button>
                      <span className="px-6 py-2 font-bold bg-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-xl hover:bg-gray-200 rounded-l-xl transition-colors">+</button>
                    </div>
                  </div>

                  <div className="mt-auto pt-8 border-t border-gray-100">
                    <button
                      className="w-full bg-blue-950 hover:bg-blue-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg shadow-blue-950/20"
                      onClick={handleAddToCart} >
                      <ShoppingCart size={24} />
                      أضف إلى السلة
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}