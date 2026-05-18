import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, PlusCircle, Trash2, Edit, Save, X, TrendingUp, ShoppingBag, Link as LinkIcon, Upload, Settings, Eye, EyeOff } from 'lucide-react';

export default function AdminDashboard() {
  const [view, setView] = useState<'list' | 'add' | 'settings'>('list');
  
  // حالات تحديد نوع الإدخال (رابط أو ملف) لكل فورم بشكل مستقل
  const [productImgType, setProductImgType] = useState<'link' | 'file'>('link');
  const [heroImgType, setHeroImgType] = useState<'link' | 'file'>('link');

  // فورم إضافة منتج جديد
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'home',
    description: '',
    image: 'https://images.unsplash.com/photo-1762606368623-81bb2d5f5778?q=80'
  });

  // مصفوفة المنتجات الافتراضية المربوطة بالـ localStorage
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "غرفة نوم عصرية متكاملة", price: "4,500 ر.س", category: "home", image: "https://images.unsplash.com/photo-1762606368623-81bb2d5f5778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
      { id: 2, title: "سرير خشبي بتصميم مبسط", price: "2,200 ر.س", category: "home", image: "https://images.unsplash.com/photo-1768253843445-49fa5f4a801f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
      { id: 3, title: "غرفة نوم رئيسية فاخرة", price: "6,800 ر.س", category: "home", image: "https://images.unsplash.com/photo-1772563214602-3c6434766700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" },
    ];
  });

  // إعدادات الواجهة الرئيسية
  const [homeSettings, setHomeSettings] = useState(() => {
    const saved = localStorage.getItem('homeSettings');
    return saved ? JSON.parse(saved) : {
      heroTitle: "غرف نوم وطني من المصنع مباشرة",
      heroSubtitle: "توصيل مجاني في الرياض | الدفع عند الاستلام | ضمان مصنعي على جميع منتجاتنا.",
      heroImage: "https://images.unsplash.com/photo-1640109478916-f445f8f19b11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      featuredCount: 6,
      showFeatures: true
    };
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('homeSettings', JSON.stringify(homeSettings));
  }, [products, homeSettings]);

  // دالة تحويل الملفات المرفوعة إلى مسار نصي Base64 ليحفظ في الـ localStorage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'product') {
          setNewProduct({ ...newProduct, image: reader.result as string });
        } else {
          setHomeSettings({ ...homeSettings, heroImage: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      title: newProduct.title,
      price: Number(newProduct.price).toLocaleString() + " ر.س",
      category: newProduct.category,
      image: newProduct.image
    };
    setProducts([productToAdd, ...products]);
    alert('تم إضافة المنتج وتخصيصه للقسم بنجاح! ✅');
    setNewProduct({ title: '', price: '', category: 'home', description: '', image: 'https://images.unsplash.com/photo-1762606368623-81bb2d5f5778?q=80' });
    setView('list');
  };

  const getCategoryName = (cat: string) => {
    const categories: Record<string, string> = {
      home: "الصفحة الرئيسية",
      double: "غرفة نوم نفرين",
      single: "غرفة نوم نفر",
      kids: "غرف نوم أطفال",
      sofas: "كنب تفصيل"
    };
    return categories[cat] || "الصفحة الرئيسية";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-950 text-white flex-shrink-0">
        <div className="p-6 border-b border-blue-900"><h2 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard className="text-amber-500" /> لوحة التحكم</h2></div>
        <nav className="p-4 space-y-2">
          <button onClick={() => setView('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'list' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Package size={20} /> إدارة المنتجات</button>
          <button onClick={() => setView('add')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'add' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><PlusCircle size={20} /> إضافة منتج جديد</button>
          <button onClick={() => setView('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'settings' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Settings size={20} /> إعدادات الرئيسية</button>
        </nav>
      </aside>

      <main className="flex-grow p-6 md:p-10">
        {/* View: List */}
        {view === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center"><h2 className="text-xl font-bold text-blue-950">المنتجات الحالية ({products.length})</h2></div>
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-600 text-sm font-bold uppercase">
                <tr><th className="px-6 py-4">اسم المنتج</th><th className="px-6 py-4">القسم المستهدف</th><th className="px-6 py-4">السعر</th><th className="px-6 py-4">الإجراءات</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p: any) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-blue-950">{p.title}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{getCategoryName(p.category)}</td>
                    <td className="px-6 py-4 text-amber-600 font-bold">{p.price}</td>
                    <td className="px-6 py-4"><button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* View: Add Product */}
        {view === 'add' && (
          <div className="max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 bg-blue-950 text-white flex justify-between items-center"><h2 className="text-xl font-bold">إضافة منتج جديد</h2><X className="cursor-pointer" onClick={() => setView('list')} /></div>
            <form className="p-8 space-y-6" onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2"><label className="block text-gray-700 font-bold mb-2">اسم المنتج</label><input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" /></div>
                
                <div>
                  <label className="block text-gray-700 font-bold mb-2">تحديد القسم المعروض فيه</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                    <option value="home">الصفحة الرئيسية (تشكيلتنا المميزة)</option>
                    <option value="double">غرفة نوم نفرين</option>
                    <option value="single">غرفة نوم نفر</option>
                    <option value="kids">غرف نوم أطفال</option>
                    <option value="sofas">كنب تفصيل</option>
                  </select>
                </div>

                <div><label className="block text-gray-700 font-bold mb-2">السعر (ر.س)</label><input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" /></div>
                
                {/* الجزء المطور لاختيار طريقة رفع صورة المنتج */}
                <div className="col-span-2 space-y-3">
                  <label className="block text-gray-700 font-bold">طريقة إضافة صورة المنتج</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setProductImgType('link')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${productImgType === 'link' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      <LinkIcon size={16} /> إضافة رابط (URL)
                    </button>
                    <button type="button" onClick={() => setProductImgType('file')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${productImgType === 'file' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      <Upload size={16} /> رفع من الجهاز
                    </button>
                  </div>

                  {productImgType === 'link' ? (
                    <input type="url" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="https://example.com/product.jpg" />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center hover:bg-gray-100/50 transition-colors relative">
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'product')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      <Upload className="mx-auto text-gray-400 mb-2" size={28} />
                      <span className="text-sm text-gray-600 block">اضغط هنا أو اسحب صورة المنتج لرفعها</span>
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors">حفظ وإضافة المنتج</button>
            </form>
          </div>
        )}

        {/* View: Settings */}
        {view === 'settings' && (
          <div className="space-y-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-blue-950 mb-4 flex items-center gap-2"><Settings className="text-amber-500" /> إعدادات الواجهة الرئيسية</h2>
            
            {/* 1️⃣ نصوص البانر */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-blue-950 border-b pb-2">1️⃣ تعديل نصوص البانر الرئيسي</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold mb-2">العنوان الرئيسي</label><input type="text" value={homeSettings.heroTitle} onChange={(e) => setHomeSettings({...homeSettings, heroTitle: e.target.value})} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500" /></div>
                <div><label className="block text-sm font-bold mb-2">العنوان الفرعي</label><input type="text" value={homeSettings.heroSubtitle} onChange={(e) => setHomeSettings({...homeSettings, heroSubtitle: e.target.value})} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500" /></div>
              </div>
              <button onClick={() => { localStorage.setItem('homeSettings', JSON.stringify(homeSettings)); alert('تم حفظ النصوص بنجاح! 📝'); }} className="bg-blue-950 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-900">حفظ النصوص فقط</button>
            </div>

            {/* 2️⃣ صورة الخلفية (مضاف إليها خيار الرفع أو اللينك) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-blue-950 border-b pb-2">2️⃣ صورة خلفية البانر (Hero Image)</h3>
              
              <div className="flex gap-4 mb-2">
                <button type="button" onClick={() => setHeroImgType('link')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${heroImgType === 'link' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                  <LinkIcon size={14} /> رابط (URL)
                </button>
                <button type="button" onClick={() => setHeroImgType('file')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${heroImgType === 'file' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                  <Upload size={14} /> رفع من الجهاز
                </button>
              </div>

              {heroImgType === 'link' ? (
                <div><label className="block text-sm font-bold mb-2">رابط الصورة الحالي</label><input type="url" value={homeSettings.heroImage} onChange={(e) => setHomeSettings({...homeSettings, heroImage: e.target.value})} className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500" /></div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center hover:bg-gray-100/50 transition-colors relative">
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'hero')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-600 block">اضغط هنا لاختيار صورة بانر جديدة من جهازك</span>
                </div>
              )}

              <button onClick={() => { localStorage.setItem('homeSettings', JSON.stringify(homeSettings)); alert('تم حفظ صورة البانر بنجاح! 🖼️'); }} className="bg-blue-950 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-900">حفظ الصورة فقط</button>
            </div>

            {/* 3️⃣ التحكم في العرض والعدد */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-bold text-blue-950 border-b pb-2">3️⃣ التحكم في عرض العناصر</h3>
              <div className="flex flex-wrap gap-8 items-center">
                <div><label className="block text-sm font-bold mb-2">عدد المنتجات المعروضة</label><input type="number" min="1" max="12" value={homeSettings.featuredCount} onChange={(e) => setHomeSettings({...homeSettings, featuredCount: Number(e.target.value)})} className="w-32 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-amber-500" /></div>
                <div><label className="block text-sm font-bold mb-2">حالة قسم "المميزات"</label><button type="button" onClick={() => setHomeSettings({...homeSettings, showFeatures: !homeSettings.showFeatures})} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${homeSettings.showFeatures ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>{homeSettings.showFeatures ? 'ظاهر للعملاء' : 'مخفي الآن'}</button></div>
              </div>
              <button onClick={() => { localStorage.setItem('homeSettings', JSON.stringify(homeSettings)); alert('تم حفظ إعدادات العرض بنجاح! ⚙️'); }} className="bg-blue-950 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-900">حفظ خيارات العرض فقط</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}