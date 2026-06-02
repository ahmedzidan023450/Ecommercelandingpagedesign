import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wrench, ChevronLeft } from 'lucide-react';

export default function SingleBedrooms() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSingle = async () => {
      try {
        setLoading(true);
        const catRes = await fetch(`${apiUrl}/categories`);
        const catData = await catRes.json();
        const categoriesList = catData.items || catData.data || catData || [];
        
        // البحث عن الـ ID الخاص بقسم النفر (ويستبعد النفرين)
        const singleCategory = categoriesList.find((c: any) => 
          ((c.name || c.title || '').includes('نفر') || (c.name || c.title || '').includes('مفرد')) && 
          !(c.name || c.title || '').includes('نفرين')
        );

        const prodRes = await fetch(`${apiUrl}/products?page=1&pageSize=100`);
        const prodData = await prodRes.json();
        const allProducts = prodData.items || prodData.data || prodData || [];

        if (singleCategory) {
          const filtered = allProducts.filter((p: any) => {
            const pCatId = p.categoryId || p.CategoryId || p.category?.id || p.categoryID;
            return Number(pCatId) === Number(singleCategory.id);
          });
          setProducts(filtered);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSingle();
  }, [apiUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-950 mb-4">غرف نوم نفر</h1>
          <p className="text-gray-600 text-lg">أحدث تشكيلات غرف النوم الفردية والعملية.</p>
        </div>

        {loading ? (
          <div className="text-center font-bold text-blue-950 py-12 text-xl">جاري تحميل المنتجات... ⏳</div>
        ) : products.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 max-w-2xl mx-auto">
            <p className="text-xl text-gray-500 font-medium mb-4">لا توجد منتجات متوفرة في هذا القسم حالياً.</p>
            <Link to="/" className="text-amber-600 font-bold hover:underline">العودة للرئيسية</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img src={product.images?.[0]?.url || product.mainImageUrl || product.imageUrl || product.image || "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800&q=80"} alt={product.name || product.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 font-bold px-3 py-1.5 rounded-lg text-sm">{product.price} ر.س</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 line-clamp-1">{product.name || product.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1"><ShieldCheck size={16} className="text-amber-500"/>ضمان مصنعي</span>
                    <span className="flex items-center gap-1"><Wrench size={16} className="text-amber-500"/> توصيل مجاني</span>
                  </div>
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