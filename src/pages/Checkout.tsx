import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, CreditCard, User, Phone, MapPin, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { token, isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";

  const [formData, setFormData] = useState({
    recipientName: '',
    phone: '',
    address: '',
    city: 'الرياض',
    notes: '' // ضفناها عشان لو العميل حب يكتب ملاحظة
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isAuthenticated) {
      setError('يجب تسجيل الدخول أولاً لإتمام عملية الشراء.');
      setLoading(false);
      return;
    }

    if (cartItems.length === 0) {
      setError('سلة المشتريات فارغة!');
      setLoading(false);
      return;
    }

    try {
      // 👈 تجهيز البيانات بالأسماء اللي الباك إند طالبها بالمللي
      const payload = {
        recipientName: formData.recipientName,
        phoneNumber: formData.phone,
        shippingAddress: `المستلم: ${formData.recipientName} | الجوال: ${formData.phone} | العنوان: ${formData.city} - ${formData.address}`,
        notes: formData.notes || "الدفع عند الاستلام"
      };

      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`فشل في تسجيل الطلب: ${errorText}`);
      }

      // غالباً الباك إند بيفضي السلة لوحده لما الطلب بيتعمل، 
      // بس إحنا هنفضيها من عندنا في الفرونت إند عشان الشاشة تتحدث.
      clearCart(); 
      setIsSuccess(true);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center bg-gray-50" dir="rtl">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-md">
          <CheckCircle size={44} />
        </div>
        <h1 className="text-3xl font-black text-blue-950 mb-3">تم استلام طلبك بنجاح! 🎉</h1>
        <p className="text-gray-600 max-w-md mb-8 font-medium">
          شكرًا لثقتك بمؤسسة رؤية. جاري مراجعة طلبك وسيتم التواصل معك عبر الهاتف لتأكيد موعد التوصيل والتركيب.
        </p>
        <button onClick={() => navigate('/profile')} className="bg-blue-950 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg">
          متابعة حالة الطلب في حسابي
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-black text-blue-950 mb-10 flex items-center gap-3">
          <CreditCard className="text-amber-500" /> إتمام عملية الشراء
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-6 pb-3 border-b border-gray-50">بيانات التوصيل والشحن</h2>
            
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100 font-bold text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><User size={16}/> اسم المستلم الثنائي</label>
                <input type="text" required value={formData.recipientName} onChange={(e) => setFormData({...formData, recipientName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none" placeholder="مثال: محمد العتيبي" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><Phone size={16}/> رقم الجوال للتواصل</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none text-left" dir="ltr" placeholder="05xxxxxxxx" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المدينة</label>
                  <select value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none bg-white font-semibold text-slate-700">
                    <option value="الرياض">الرياض (متاح تركيب مجاني)</option>
                    <option value="جدة">جدة (شحن فقط)</option>
                    <option value="الدمام">الدمام (شحن فقط)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><MapPin size={16}/> الحي / تفاصيل العنوان</label>
                  <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-950 outline-none" placeholder="مثال: حي الياسمين، شارع الملقا" />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm font-medium mt-4">
                💡 **الدفع عند الاستلام:** جميع طلباتنا يتم دفع قيمتها نقداً أو شبكة للمندوب فور الفحص والاستلام والتركيب في منزلك.
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-950 hover:bg-blue-900 text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-lg shadow-blue-950/20 mt-6 flex items-center justify-center gap-2">
                {loading ? 'جاري تأكيد طلبك... ⏳' : 'تأكيد الطلب والدفع عند الاستلام'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold text-blue-950 mb-6 pb-3 border-b border-gray-50 flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber-500" /> ملخص الطلب
            </h2>

            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto pl-2 mb-6">
              {cartItems.map((item: any) => (
                <div key={item.id || item.productId} className="py-4 flex items-center gap-4">
                  <img src={item.image || item.imageUrl || "https://via.placeholder.com/60"} alt={item.name || item.productName || item.title} className="w-16 h-16 rounded-xl object-cover bg-gray-50 border border-gray-100" />
                  <div className="flex-grow">
                    <h4 className="font-bold text-blue-950 text-sm line-clamp-1">{item.name || item.productName || item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">الكمية: {item.quantity}</p>
                  </div>
                  <span className="font-black text-amber-600 text-sm">{(item.price || item.unitPrice) * item.quantity} ر.س</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm text-gray-600"><span>مجموع المنتجات:</span><span className="font-bold">{cartTotal} ر.س</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>التوصيل والتركيب:</span><span className="text-emerald-600 font-bold">مجاني (داخل الرياض)</span></div>
              <div className="border-t pt-3 flex justify-between text-lg font-black text-blue-950">
                <span>الإجمالي النهائي:</span>
                <span className="text-xl text-amber-600">{cartTotal} ر.س</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}