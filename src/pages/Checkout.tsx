import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowRight, CheckCircle, MapPin, Phone, User } from 'lucide-react';

export default function Checkout() {
  const { cartItems, addToCart } = useCart();
  const navigate = useNavigate();

  // هنا بنخزن بيانات العميل اللي بيكتبها في الفورم
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // دالة حساب الإجمالي
  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => {
      const numericPrice = Number(item.price.replace(/[^0-9]/g, ""));
      return total + numericPrice * item.quantity;
    }, 0);
  };

  // الدالة دي هتتنفذ لما العميل يدوس "تأكيد الطلب"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // عشان الصفحة متعملش ريفريش
    
    // ده الـ Object اللي هتسلمه لزميلك بتاع الباك إند (فيه كل حاجة)
    const orderData = {
      customerInfo: formData,
      orderItems: cartItems,
      totalAmount: calculateTotal()
    };

    console.log("تم تجهيز بيانات الطلب للباك إند:", orderData);
    
    // رسالة نجاح مؤقتة للمستخدم
    alert('تم تأكيد طلبك بنجاح! سيتم التواصل معك قريباً لتأكيد الشحن.');
    
    // بعد الدفع بنرجعه للصفحة الرئيسية
    navigate('/');
  };

  // لو السلة فاضية ودخل هنا بالغلط
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">سلتك فارغة!</h2>
        <Link to="/" className="text-amber-600 font-bold hover:underline">العودة للتسوق</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors mb-8 font-medium">
          <ArrowRight size={20} />
          <span>العودة للتسوق</span>
        </Link>

        <h1 className="text-3xl font-bold text-blue-950 mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* فورم بيانات العميل (بياخد ثلثين الشاشة) */}
          <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              <CheckCircle className="text-amber-500" size={24} />
              بيانات التوصيل
            </h2>

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <User size={18} className="text-blue-950"/> الاسم بالكامل
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="اكتب اسمك الثلاثي"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Phone size={18} className="text-blue-950"/> رقم الجوال
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="مثال: 05xxxxxxxxx"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-950"/> العنوان التفصيلي
                </label>
                <textarea 
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  placeholder="المدينة، الحي، الشارع، رقم المبنى"
                ></textarea>
              </div>
            </form>
          </div>

          {/* ملخص الطلب (بياخد ثلث الشاشة) */}
          <div className="bg-blue-950 text-white p-6 md:p-8 rounded-3xl shadow-lg h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-blue-800 pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-blue-200 line-clamp-1 flex-grow pr-2">{item.title} <span className="text-amber-500 font-bold">(x{item.quantity})</span></span>
                </div>
              ))}
            </div>

            <div className="border-t border-blue-800 pt-4 mb-6">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-amber-500">{calculateTotal().toLocaleString()} ر.س</span>
              </div>
              <p className="text-xs text-blue-300 mt-2 text-center">شامل ضريبة القيمة المضافة والتوصيل</p>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-amber-500/30 active:scale-95"
            >
              تأكيد الطلب
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}