import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wrench, ChevronLeft } from 'lucide-react';

export default function Sofas() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);

        // 1. هنجيب الأقسام عشان نعرف رقم (ID) قسم الكنب
        const catRes = await fetch(`${apiUrl}/categories`);
        const catData = await catRes.json();
        const categories = catData.items || catData.data || catData || [];

        // بنبحث عن القسم باسمه في الداشبورد
        const targetCat = categories.find((c: any) => 
          (c.name || '').includes('كنب') || (c.name || '').includes('مجالس')
        );

        if (!targetCat) {
          setLoading(false);
          return;
        }

        // 2. محاولة رقم 1: بعض سيرفرات .NET بترجع منتجات القسم جواه مباشرة
        const singleCatRes = await fetch(`${apiUrl}/categories/${targetCat.id}`);
        const singleCatData = await singleCatRes.json();
        
        if (singleCatData.products && Array.isArray(singleCatData.products) && singleCatData.products.length > 0) {
          setProducts(singleCatData.products);
          setLoading(false);
          return;
        }

        // 3. محاولة رقم 2: لو مرجعهاش، هنجيب كل المنتجات ونفلتر بالـ ID اللي اخترناه في الداشبورد!
        const prodRes = await fetch(`${apiUrl}/products?page=1&pageSize=100`);
        const prodData = await prodRes.json();
        const allProducts = prodData.items || prodData.data || prodData || [];

        const filtered = allProducts.filter((p: any) => {
          // 1. الفحص برقم القسم (الأساسي)
          const pCatId = p.categoryId || p.CategoryId || p.categoryID || p.category?.id;
          const matchById = targetCat && pCatId != null && Number(pCatId) === Number(targetCat.id);
          
          // 2. الفحص باسم المنتج (كخطة بديلة لو الباك إند مبعتش الـ ID)
          const title = (p.name || p.title || '').toLowerCase();
          const matchByName = title.includes('كنب') || title.includes('ركن') || title.includes('صوفا') || title.includes('مجلس');

          return matchById || matchByName; // لو طابق ده أو ده، هيعرضه غصب عنه
        });
        setProducts(filtered);

          // لو الباك إند باعت اسم القسم كـ نص مش رقم
          const pCatName = p.categoryName || p.CategoryName || p.category?.name;
          if (pCatName && pCatName === targetCat.name) {
            return true;
          }

          return false;
        });

        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">قسم الكنب والمجالس</h1>
        </div>

        {loading ? (
          <div className="text-center font-bold text-blue-950 py-12 text-xl">جاري التحميل... ⏳</div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500 font-medium mb-4">لا توجد منتجات متوفرة في هذا القسم حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img src={product.images?.[0]?.url || product.mainImageUrl || product.imageUrl || product.image || "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80"} alt={product.name || product.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 font-bold px-3 py-1.5 rounded-lg text-sm">{product.price} ر.س</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{product.name || product.title}</h3>
                  <Link to={`/product/${product.id}`} className="w-full bg-blue-950 hover:bg-blue-900 text-white rounded-xl py-3 px-4 flex justify-center gap-2 font-bold transition-colors">
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