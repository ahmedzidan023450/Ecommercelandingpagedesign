import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { ShieldCheck, Wrench, ChevronLeft } from 'lucide-react';

export default function Sofas() {
  // 1. جلب الأقسام (مكيّشة ومستعدة)
  const { data: categoriesData, isLoading: catsLoading, isError: catsError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/api/categories');
      return res.data.items || res.data.data || res.data || [];
    }
  });

  // 2. جلب كل المنتجات
  const { data: productsData, isLoading: prodsLoading, isError: prodsError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await apiClient.get('/api/products?page=1&pageSize=100');
      return res.data.items || res.data.data || res.data || [];
    }
  });

  // 3. فلترة الكنب بذكاء مع الاحتفاظ بخطة الطوارئ الممتازة بتاعتك
  const sofaProducts = useMemo(() => {
    if (!categoriesData || !productsData) return [];

    // البحث عن قسم الكنب أو المجالس
    const sofasCategories = categoriesData.filter((c: any) =>
      (c.name || c.title || '').includes('كنب') || (c.name || c.title || '').includes('مجالس')
    );

    if (sofasCategories.length === 0) return [];
    
    const categoryIds = sofasCategories.map((c: any) => Number(c.id));

    return productsData.filter((p: any) => {
      // 1. الفحص برقم القسم (الأساسي)
      const pCatId = p.categoryId || p.CategoryId || p.categoryID || p.category?.id;
      const matchById = categoryIds.includes(Number(pCatId));

      // 2. الفحص باسم المنتج (كخطة بديلة)
      const title = (p.name || p.title || '').toLowerCase();
      const matchByName = title.includes('كنب') || title.includes('ركن') || title.includes('صوفا') || title.includes('مجلس');

      // 3. الفحص باسم القسم
      const pCatName = p.categoryName || p.CategoryName || p.category?.name;
      const matchByCategoryName = sofasCategories.some((c: any) => c.name === pCatName);

      return matchById || matchByName || matchByCategoryName;
    });
  }, [categoriesData, productsData]);

  const isLoading = catsLoading || prodsLoading;
  const isError = catsError || prodsError;

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">قسم الكنب والمجالس</h1>
        </div>

        {isLoading ? (
          <div className="text-center font-bold text-blue-950 py-12 text-xl">جاري التحميل... ⏳</div>
        ) : isError ? (
          <div className="text-center bg-red-50 p-12 rounded-3xl border border-red-100 max-w-2xl mx-auto">
            <p className="text-xl text-red-600 font-bold mb-4">عذراً، فشل في جلب البيانات من الخادم. يرجى المحاولة لاحقاً.</p>
          </div>
        ) : sofaProducts.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500 font-medium mb-4">لا توجد منتجات متوفرة في هذا القسم حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sofaProducts.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || product.mainImageUrl || product.imageUrl || product.image || "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80"}
                    alt={product.name || product.title}
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80"; }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 font-bold px-3 py-1.5 rounded-lg text-sm">{product.price} ر.س</div>
                </div>
                <div className="p-6">
                  {product.sku && <div className="text-xs text-gray-400 mb-1 font-bold tracking-wider">{product.sku}</div>}
                  <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{product.name || product.title}</h3>
                  <Link to={`/product/${product.id}${product.sku ? `/${product.sku}` : ''}`} className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3 px-4 flex justify-center gap-2 font-bold transition-colors">
                    <span>عرض التفاصيل</span><ChevronLeft size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}