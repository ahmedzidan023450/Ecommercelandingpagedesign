import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Package } from 'lucide-react';

export default function ManageProducts() {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // دالة جلب المنتجات من السيرفر
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/products?page=1&pageSize=50`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.items || data || []);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // دالة مسح منتج
  const handleDelete = async (id: number) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج نهائياً؟")) return;
    
    try {
      const res = await fetch(`${apiUrl}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert("تم الحذف بنجاح");
        fetchProducts(); // تحديث الجدول بعد الحذف
      } else {
        alert("حدث خطأ أثناء الحذف");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) return <div className="p-8 text-center text-blue-950 font-bold">جاري تحميل المنتجات... ⏳</div>;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
          <Package className="text-amber-500" />
          إدارة المنتجات
        </h2>
        <span className="bg-blue-50 text-blue-950 px-4 py-2 rounded-lg font-bold">
          العدد الكلي: {products.length}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-4 font-semibold text-sm rounded-tr-lg">الصورة</th>
              <th className="p-4 font-semibold text-sm">اسم المنتج</th>
              <th className="p-4 font-semibold text-sm">السعر</th>
              <th className="p-4 font-semibold text-sm rounded-tl-lg text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">لا توجد منتجات حالياً.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3">
                    <img src={product.images?.[0] || product.image || "https://via.placeholder.com/50"} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="p-3 font-bold text-blue-950">{product.name}</td>
                  <td className="p-3 text-amber-600 font-bold">{product.price} ر.س</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" title="تعديل">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title="حذف">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}