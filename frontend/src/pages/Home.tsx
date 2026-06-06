import React from 'react';
import { Link } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { ShieldCheck, Truck, ChevronLeft, Wrench, RefreshCw } from 'lucide-react';

export default function Home() {
  // إعدادات البانر
  const homeSettings = {
    heroTitle: "غرف نوم وطني من المصنع مباشرة",
    heroSubtitle: "توصيل مجاني في الرياض | الدفع عند الاستلام | ضمان مصنعي على جميع منتجاتنا.",
    heroImage: "https://images.unsplash.com/photo-1640109478916-f445f8f19b11?q=80"
  };

  // استخدام useInfiniteQuery السحرية للـ Pagination
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['latest-products'],
    initialPageParam: 1, // البداية من الصفحة الأولى
    queryFn: async ({ pageParam = 1 }) => {
      // apiClient بيتكفل بالـ BaseURL والـ Headers تلقائياً
      const res = await apiClient.get(`/api/products?page=${pageParam}&pageSize=6`);
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      // هنا بنفهم المكتبة إزاي تعرف إن في صفحة تانية ولا لأ
      const currentPage = lastPage?.page || allPages.length;
      const totalPages = lastPage?.totalPages;

      // لو وصلنا لآخر صفحة حسب الباك إند
      if (totalPages && currentPage >= totalPages) return undefined;

      const items = lastPage?.items || lastPage?.data || lastPage || [];
      // لو العناصر اللي رجعت أقل من 6، يبقى مفيش تاني
      if (items.length < 6) return undefined;

      // لو لسه في منتجات، بنقوله يزود رقم الصفحة 1 للطلبة اللي جاية
      return currentPage + 1;
    }
  });

  // تجميع كل المنتجات من كل الصفحات اللي اتفتحت في مصفوفة واحدة
  const products = data?.pages.flatMap(page => page?.items || page?.data || page || []) || [];

  return (
    <div className="bg-gray-50 min-h-screen" dir="rtl">

      {/* 1. قسم البانر الرئيسي (Hero Section) */}
      <section className="relative h-[85vh] bg-blue-950 flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={homeSettings.heroImage} alt="Furniture" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {homeSettings.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
            {homeSettings.heroSubtitle}
          </p>
          <div className="flex justify-center gap-4">
            <a href="#latest-products" className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg shadow-amber-500/30">
              تسوق الآن
            </a>
          </div>
        </div>
      </section>

      {/* 2. مميزات المعرض (Features) */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0"><ShieldCheck size={28} /></div>
              <div><h3 className="font-bold text-blue-950 text-lg">ضمان مصنعي</h3><p className="text-gray-500 text-sm">جودة مضمونة وتدوم طويلاً</p></div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><Truck size={28} /></div>
              <div><h3 className="font-bold text-blue-950 text-lg">توصيل مجاني</h3><p className="text-gray-500 text-sm">داخل مدينة الرياض</p></div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0"><Wrench size={28} /></div>
              <div><h3 className="font-bold text-blue-950 text-lg">تركيب مجاني</h3><p className="text-gray-500 text-sm">بواسطة فريقنا المتخصص</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. قسم أحدث المنتجات */}
      <section id="latest-products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-blue-950 mb-2">تشكيلاتنا المميزة</h2>
            <p className="text-gray-500">اكتشف أحدث غرف النوم والكنب المضافة مؤخراً</p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center font-bold text-blue-950 py-12 text-xl">جاري تحميل المنتجات... ⏳</div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 text-gray-500 font-medium">
            لا توجد منتجات حالياً، سيتم إضافة المنتجات قريباً!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product: any) => (
                <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group border border-gray-100">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.imageUrl ||
                        product.image ||
                        "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80"
                      }
                      alt={product.name || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-blue-950 font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm">
                      {product.price} ر.س
                    </div>
                  </div>

                  <div className="p-6">
                    {product.sku && <div className="text-xs text-gray-400 mb-1 font-bold tracking-wider">{product.sku}</div>}
                    <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{product.name || product.title}</h3>
                    <Link
                      to={`/product/${product.id}${product.sku ? `/${product.sku}` : ''}`}
                      className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-bold transition-colors shadow-md shadow-blue-950/20"
                    >
                      <span>عرض التفاصيل</span>
                      <ChevronLeft size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* زرار عرض المزيد */}
            {hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="bg-white border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'جاري التحميل...' : 'عرض المزيد من المنتجات'}
                  {!isFetchingNextPage && <RefreshCw size={18} />}
                </button>
              </div>
            )}
          </>
        )}
      </section>

    </div>
  );
}