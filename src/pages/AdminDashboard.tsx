import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, Trash2, Edit, X, ShoppingCart, Banknote, FileDown, Clock, XCircle, FolderPlus, Activity, CheckCircle, Truck, LogOut, Link as LinkIcon, Upload, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');

  const [view, setView] = useState<'overview' | 'list' | 'add' | 'orders' | 'categories'>('overview');
  const [productImgType, setProductImgType] = useState<'link' | 'file'>('link');
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any>([]); 
  const [categories, setCategories] = useState<any[]>([]); 
  
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', description: '', image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '' }); 
  
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [stats, setStats] = useState({
    totalUsers: 0, totalOrders: 0, totalProducts: 0, totalRevenue: 0, totalExpenses: 0, netProfit: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchDashboardStats = () => {
    if (!token) return;
    fetch(`${apiUrl}/admin/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setStatsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setStatsLoading(false);
      });
  };

  useEffect(() => {
    fetch(`${apiUrl}/products?page=1&pageSize=50`)
      .then(res => res.json())
      .then(data => setProducts(data.items || data || []))
      .catch(err => console.error(err));

    fetch(`${apiUrl}/categories`)
      .then(res => res.json())
      .then(data => {
        const fetchedCats = data.items || data.data || data || [];
        setCategories(fetchedCats);
        if (fetchedCats.length > 0 && !newProduct.category) {
          setNewProduct(prev => ({ ...prev, category: fetchedCats[0].id.toString() }));
        }
      })
      .catch(err => console.error(err));

    if (token) {
      fetchDashboardStats();
        
      fetch(`${apiUrl}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(data.items || data || []))
        .catch(err => console.error(err));
    } else {
      setStatsLoading(false);
    }
  }, [apiUrl, token, view]);

  const handleExportPDF = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/dashboard/export/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('فشل في تحميل التقرير');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Furniture-Dashboard-Report.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, target: 'product') => {
    const file = e.target.files?.[0];
    if (file) {
      if (target === 'product') {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewProduct({ ...newProduct, image: reader.result as string });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
      try {
        const response = await fetch(`${apiUrl}/admin/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('فشل في حذف المنتج');
        setProducts(products.filter((p: any) => p.id !== id));
        alert('تم الحذف بنجاح');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('Name', newProduct.title);
      formData.append('Price', newProduct.price.toString());
      formData.append('CategoryId', newProduct.category);
      formData.append('Description', newProduct.description || 'وصف المنتج'); 
      formData.append('StockQuantity', '10'); 
      
      if (imageFile) {
        formData.append('Images', imageFile);
      }

      const response = await fetch(`${apiUrl}/admin/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطأ من السيرفر: ${errorText}`);
      }
      
      alert('تم إضافة المنتج بنجاح! ✅');
      setNewProduct({ title: '', price: '', category: categories[0]?.id?.toString() || '', description: '', image: '' });
      setImageFile(null);
      setView('list');
      
      fetch(`${apiUrl}/products?page=1&pageSize=50`)
        .then(res => res.json())
        .then(data => setProducts(data.items || data || []));
        
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { 
        name: editingProduct.name || editingProduct.title, 
        price: Number(editingProduct.price), 
        categoryId: Number(editingProduct.category || editingProduct.categoryId),
        image: editingProduct.image || editingProduct.imageUrl 
      };
      
      const response = await fetch(`${apiUrl}/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('فشل في تعديل المنتج');
      
      alert('تم التعديل بنجاح! ✅');
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload, title: payload.name } : p));
      setEditingProduct(null);
    } catch (error: any) { alert(error.message); } 
    finally { setLoading(false); }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: number) => {
    try {
      const response = await fetch(`${apiUrl}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`فشل تحديث الحالة: ${errText}`);
      }
      
      if (Array.isArray(orders)) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else if (orders && orders.id === orderId) {
        setOrders({ ...orders, status: newStatus });
      }
      
      fetchDashboardStats();
      
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleViewOrderDetails = async (orderSummary: any) => {
    try {
      const res = await fetch(`${apiUrl}/admin/orders/${orderSummary.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const detailedData = await res.json();
      setSelectedOrder({ ...orderSummary, ...detailedData }); 
    } catch {
      alert("تعذر جلب تفاصيل بون الشحن من السيرفر حالياً.");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory.name })
      });
      if (!response.ok) throw new Error('فشل إضافة القسم');
      alert('تم إضافة القسم بنجاح! ✅');
      
      fetch(`${apiUrl}/categories`)
        .then(res => res.json())
        .then(data => setCategories(data.items || data.data || data || []));

      setNewCategory({ name: '' });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا القسم نهائياً؟')) {
      try {
        const response = await fetch(`${apiUrl}/categories/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('فشل في حذف القسم');
        setCategories(categories.filter((c: any) => c.id !== id));
        alert('تم حذف القسم بنجاح');
      } catch (error: any) {
        alert(error.message);
      }
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editingCategory.name }) 
      });

      if (!response.ok) throw new Error('فشل في تعديل القسم');
      
      alert('تم تعديل القسم بنجاح! ✅');
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: editingCategory.name, title: editingCategory.name } : c));
      setEditingCategory(null);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const safeOrdersList = Array.isArray(orders) ? orders : (orders && orders.id ? [orders] : []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row" dir="rtl">
      
      {/* Modals */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onClick={() => setEditingProduct(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
            <h2 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-3">تعديل المنتج</h2>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">اسم المنتج</label>
                <input type="text" required value={editingProduct.name || editingProduct.title || ''} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">السعر</label>
                  <input type="number" required value={editingProduct.price || ''} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">القسم</label>
                  <select value={editingProduct.category || editingProduct.categoryId || ''} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1">رابط الصورة (URL)</label>
                <input type="url" value={editingProduct.image || editingProduct.imageUrl || ''} onChange={(e) => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-left" dir="ltr" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors mt-6 shadow-lg shadow-amber-500/30">
                {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
              </button>
            </form>
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setEditingCategory(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
            <h2 className="text-2xl font-bold text-blue-950 mb-6 border-b pb-3">تعديل القسم</h2>
            <form onSubmit={handleUpdateCategory} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1">اسم القسم</label>
                <input type="text" required value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-950 text-white font-bold py-3.5 rounded-xl hover:bg-blue-900 transition-colors mt-6 shadow-lg shadow-blue-950/30">
                {loading ? 'جاري الحفظ...' : 'تحديث اسم القسم'}
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-blue-950/40 z-[150] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-right">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 bg-gray-50 p-1.5 rounded-xl"><X size={20}/></button>
            
            <h3 className="text-xl font-black text-blue-950 mb-6 border-b pb-3">بون شحن طلب #{selectedOrder.id}</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 font-bold">اسم المستلم:</p>
                <p className="font-bold text-gray-800 text-base">
                  {selectedOrder.recipientName || selectedOrder.customerName || 'غير مسجل'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 font-bold">رقم الجوال:</p>
                <p className="font-mono font-bold text-amber-600 text-lg" dir="ltr">
                  {selectedOrder.phoneNumber || selectedOrder.phone || 'غير متوفر'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 mb-1 font-bold">العنوان التفصيلي:</p>
                <p className="font-semibold text-gray-700 text-sm leading-relaxed">
                  {selectedOrder.shippingAddress || selectedOrder.address || 'العنوان غير متوفر في الطلب'}
                </p>
              </div>
            </div>

            <button onClick={() => setSelectedOrder(null)} className="w-full bg-blue-950 text-white font-bold py-3 rounded-xl mt-6 hover:bg-blue-900 transition-colors">
              إغلاق البون
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-blue-950 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-blue-900">
          <h2 className="text-xl font-bold flex items-center gap-2"><LayoutDashboard className="text-amber-500" /> الإدارة</h2>
        </div>
        <nav className="p-4 space-y-2 flex-grow">
          <button onClick={() => setView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'overview' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Activity size={20} /> نظرة عامة</button>
          <button onClick={() => setView('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'orders' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><ShoppingCart size={20} /> إدارة الطلبات</button>
          <button onClick={() => setView('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'categories' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><FolderPlus size={20} /> إدارة الأقسام</button>
          <button onClick={() => setView('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'list' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Package size={20} /> إدارة المنتجات</button>
          <button onClick={() => setView('add')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'add' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><PlusCircle size={20} /> إضافة منتج جديد</button>
        </nav>
        <div className="p-4 border-t border-blue-900">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold">
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </aside>

      <main className="flex-grow p-6 md:p-10">
        
        {/* View: Overview */}
        {view === 'overview' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2"><Activity className="text-amber-500" /> إحصائيات المعرض</h2>
              <button onClick={handleExportPDF} className="flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                <FileDown size={18} /> تحميل تقرير PDF
              </button>
            </div>
            {statsLoading ? (
              <div className="text-center py-10 font-bold text-blue-950">جاري تحميل الأرقام... ⏳</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><ShoppingCart size={28} /></div>
                  <div><p className="text-sm text-gray-500 font-bold mb-1">الطلبات الحالية</p><h3 className="text-2xl font-black text-blue-950">{stats.totalOrders || 0}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600"><Package size={28} /></div>
                  <div><p className="text-sm text-gray-500 font-bold mb-1">إجمالي المنتجات</p><h3 className="text-2xl font-black text-blue-950">{stats.totalProducts || 0}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><Banknote size={28} /></div>
                  <div><p className="text-sm text-gray-500 font-bold mb-1">الإيرادات</p><h3 className="text-2xl font-black text-blue-950">{stats.totalRevenue || 0} <span className="text-sm font-normal">ر.س</span></h3></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* View: Orders */}
        {view === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                  <ShoppingCart className="text-amber-500" /> إدارة طلبات العملاء ({safeOrdersList.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-600 text-sm font-bold uppercase">
                    <tr>
                      <th className="px-6 py-4">رقم الطلب</th>
                      <th className="px-6 py-4">كود الشحنة</th>
                      <th className="px-6 py-4">اسم العميل</th>
                      <th className="px-6 py-4">عدد المنتجات</th>
                      <th className="px-6 py-4">إجمالي المبلغ</th>
                      <th className="px-6 py-4">حالة الطلب</th>
                      <th className="px-6 py-4 text-center">التفاصيل</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {safeOrdersList.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-gray-500">لا توجد طلبات حتى الآن</td></tr>
                    ) : (
                      safeOrdersList.map((o: any) => {
                        let currentStatus = 0;
                        if (typeof o.status === 'number') currentStatus = o.status;
                        else if (typeof o.status === 'string') {
                          const s = o.status.toLowerCase();
                          if (s === 'pending') currentStatus = 0;
                          else if (s === 'shipped') currentStatus = 3;
                          else if (s === 'completed' || s === 'delivered') currentStatus = 4;
                          else if (s === 'cancelled') currentStatus = 6;
                        }

                        return (
                          <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-blue-950">#{o.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 font-mono">{o.orderNumber || 'غير متوفر'}</td>
                            <td className="px-6 py-4 font-semibold text-gray-800">{o.customerName || o.recipientName || 'عميل المتجر'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{o.itemsCount || 1} قطع</td>
                            <td className="px-6 py-4">
                              <span className="text-amber-600 font-black">{o.totalAmount || 0} ر.س</span>
                              <div className="text-[11px] text-gray-400 font-normal mt-0.5">
                                {o.placedAt ? new Date(o.placedAt).toLocaleDateString('ar-EG') : ''}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <select 
                                value={currentStatus} 
                                onChange={(e) => handleUpdateOrderStatus(o.id, Number(e.target.value))}
                                className={`px-3 py-2 border rounded-xl text-sm font-bold focus:outline-none ${
                                  currentStatus == 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                  currentStatus == 3 ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                                  currentStatus == 4 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                  currentStatus == 6 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 border-gray-200'
                                }`}
                              >
                                <option value="0">قيد المعالجة (0)</option>
                                <option value="3">تم الشحن (3)</option>
                                <option value="4">مكتمل (4)</option>
                                <option value="6">إلغاء الطلب (6)</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button 
                                onClick={() => handleViewOrderDetails(o)} 
                                className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                              >
                                <Eye size={14} /> عرض البيانات
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View: Categories */}
        {view === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2"><FolderPlus className="text-amber-500" /> إضافة قسم جديد</h2>
              <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4">
                <input type="text" required placeholder="مثال: طاولات طعام، أثاث مكتبي..." value={newCategory.name} onChange={(e) => setNewCategory({ name: e.target.value })} className="flex-grow border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
                <button type="submit" disabled={loading} className="bg-blue-950 hover:bg-blue-900 text-white font-bold px-6 py-3 rounded-xl transition-colors shrink-0">
                  {loading ? 'جاري الحفظ...' : 'إضافة القسم'}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50">
                <h2 className="text-xl font-bold text-blue-950">الأقسام الحالية بالمتجر ({categories.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-gray-50 text-gray-600 text-sm font-bold uppercase">
                    <tr><th className="px-6 py-4">رقم القسم</th><th className="px-6 py-4">اسم القسم</th><th className="px-6 py-4">الإجراءات</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.length === 0 ? (
                      <tr><td colSpan={3} className="p-8 text-center text-gray-500">لا توجد أقسام حالياً</td></tr>
                    ) : (
                      categories.map((cat: any) => (
                        <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-blue-950">#{cat.id}</td>
                          <td className="px-6 py-4 text-gray-800 font-bold">{cat.name || cat.title}</td>
                          <td className="px-6 py-4 flex items-center gap-2">
                            <button onClick={() => setEditingCategory({id: cat.id, name: cat.name || cat.title})} title="تعديل القسم" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                            <button onClick={() => handleDeleteCategory(cat.id)} title="حذف القسم" className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View: Add Product */}
        {view === 'add' && (
          <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50">
              <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><PlusCircle className="text-amber-500"/> إضافة منتج جديد</h2>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleAddProduct}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-gray-700 font-bold mb-2">اسم المنتج</label>
                  <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({...newProduct, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-bold mb-2">القسم</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none bg-white">
                    {categories.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-bold mb-2">السعر (رقم فقط)</label>
                  <input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="مثال: 4500" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                
                <div className="col-span-2 space-y-3">
                  <label className="block text-gray-700 font-bold">صورة المنتج</label>
                  <div className="flex gap-4">
                    <button type="button" onClick={() => setProductImgType('link')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${productImgType === 'link' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      <LinkIcon size={16} /> إضافة رابط (URL)
                    </button>
                    <button type="button" onClick={() => setProductImgType('file')} className={`flex-1 py-2 px-4 rounded-xl font-bold border text-sm flex items-center justify-center gap-2 transition-all ${productImgType === 'file' ? 'bg-blue-950 text-white border-blue-950' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
                      <Upload size={16} /> رفع من الجهاز
                    </button>
                  </div>

                  {productImgType === 'link' ? (
                    <input type="url" required value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-left" dir="ltr" placeholder="https://example.com/product.jpg" />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 text-center hover:bg-gray-100/50 transition-colors relative">
                      <input type="file" accept="image/*" required={!newProduct.image} onChange={(e) => handleFileChange(e, 'product')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      {newProduct.image ? (
                        <div className="text-emerald-600 font-bold flex flex-col items-center gap-2">
                          <img src={newProduct.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg shadow" />
                          تم اختيار الصورة بنجاح
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto text-gray-400 mb-2" size={28} />
                          <span className="text-sm text-gray-600 block">اضغط هنا أو اسحب صورة المنتج لرفعها</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={loading} className={`w-full bg-amber-500 text-white font-bold py-4 rounded-xl transition-colors ${loading ? 'opacity-70' : 'hover:bg-amber-600'}`}>
                {loading ? 'جاري الحفظ...' : 'حفظ وإضافة المنتج'}
              </button>
            </form>
          </div>
        )}

        {/* View: List */}
        {view === 'list' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><Package className="text-amber-500"/> المنتجات الحالية ({products.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-600 text-sm font-bold uppercase">
                  <tr><th className="px-6 py-4">الصورة والاسم</th><th className="px-6 py-4">السعر</th><th className="px-6 py-4">الإجراءات</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">لا توجد منتجات مضافة</td></tr>
                  ) : (
                    products.map((p: any) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-blue-950 flex items-center gap-3">
                          <img src={p.image || p.imageUrl || p.images?.[0]?.url || "https://via.placeholder.com/50"} alt={p.name || p.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                          {p.name || p.title}
                        </td>
                        <td className="px-6 py-4 text-amber-600 font-bold">{p.price}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button onClick={() => setEditingProduct(p)} title="تعديل المنتج" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteProduct(p.id)} title="حذف المنتج" className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}