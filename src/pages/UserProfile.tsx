import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Eye, X, Phone, MapPin, Mail, Edit2, Save, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { token, user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";
  
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '', address: '' });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`${apiUrl}/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEditForm({
          fullName: data.fullName || data.name || user?.fullName || user?.name || '',
          phone: data.phoneNumber || data.phone || '',
          address: data.address || data.city || ''
        });
      })
      .catch(err => console.error("Error fetching profile:", err));

    fetch(`${apiUrl}/user/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.items || data.data || data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [apiUrl, token, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const payload = {
        fullName: editForm.fullName,
        phoneNumber: editForm.phone
      };

      const response = await fetch(`${apiUrl}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('فشل تحديث البيانات');

      alert('تم تحديث بياناتك بنجاح! ✅');
      setProfile({ ...profile, fullName: editForm.fullName, phoneNumber: editForm.phone });
      setIsEditing(false);
    } catch (error) {
      alert('حدث خطأ أثناء تحديث البيانات، يرجى المحاولة لاحقاً.');
      console.error(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const renderOrderStatus = (status: any) => {
    const s = String(status);
    switch(s) {
      case '6': case 'Cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14}/> ملغي</span>;
      case '4': case 'Completed': case 'Delivered': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> مكتمل</span>;
      case '3': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14}/> تم الشحن</span>;
      case '2': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Package size={14}/> جاري التجهيز</span>;
      case '1': return <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> تم التأكيد</span>;
      case '5': return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><X size={14}/> مسترجع</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> قيد المعالجة</span>;
    }
  };

  if (!token) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4" dir="rtl">
        <h2 className="text-2xl font-bold text-blue-950 mb-4">يجب تسجيل الدخول أولاً!</h2>
        <Link to="/login" className="text-amber-600 font-bold hover:underline">الذهاب لتسجيل الدخول</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 relative">
          <div className="absolute top-6 left-6">
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors">
                <Edit2 size={16} /> تعديل البيانات
              </button>
            ) : (
              <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-sm font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition-colors">
                <X size={16} /> إلغاء
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-right mt-8 md:mt-0">
            <div className="w-20 h-20 bg-blue-100 text-blue-950 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner flex-shrink-0">
              {profile?.fullName?.charAt(0) || profile?.name?.charAt(0) || user?.fullName?.charAt(0) || user?.name?.charAt(0) || 'ع'}
            </div>
            
            <div className="flex-grow w-full">
              {!isEditing ? (
                <>
                  <h1 className="text-2xl font-bold text-blue-950 mb-2">مرحباً، {profile?.fullName || profile?.name || user?.fullName || user?.name || 'عميلنا العزيز'}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                    <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <Mail size={16} className="text-amber-500" /> {profile?.email || user?.email || 'غير متوفر'}
                    </span>
                    {(profile?.phoneNumber || profile?.phone) && (
                      <span className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Phone size={16} className="text-amber-500" /> {profile.phoneNumber || profile.phone}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md mx-auto md:mx-0 text-right">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">الاسم بالكامل</label>
                    <input type="text" required value={editForm.fullName} onChange={(e) => setEditForm({...editForm, fullName: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">رقم الجوال</label>
                    <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500 outline-none text-left" dir="ltr" placeholder="05xxxxxxxx" />
                  </div>
                  <button type="submit" disabled={updateLoading} className="w-full flex items-center justify-center gap-2 bg-blue-950 text-white font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors mt-2">
                    {updateLoading ? 'جاري الحفظ...' : <><Save size={18} /> حفظ التعديلات</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-blue-950 mb-6 flex items-center gap-2">
          <Package className="text-amber-500" /> سجل الطلبات ({orders.length})
        </h2>

        {loading ? (
          <div className="text-center font-bold text-blue-950 py-8">جاري تحميل طلباتك... ⏳</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-2xl border border-gray-100">
            <p className="text-gray-500 font-medium mb-4">لم تقم بإجراء أي طلبات حتى الآن.</p>
            <Link to="/" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-bold transition-colors">ابدأ التسوق</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-blue-950 text-lg">طلب #{order.id}</span>
                    {renderOrderStatus(order.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    تاريخ الطلب: {new Date(order.createdAt || order.orderDate || Date.now()).toLocaleDateString('ar-EG')}
                  </p>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 sm:border-r border-gray-100 pt-4 sm:pt-0 sm:pr-6 w-full sm:w-auto">
                  <div className="text-right sm:text-left">
                    <p className="text-sm text-gray-500 mb-1">الإجمالي</p>
                    <p className="text-xl font-black text-amber-600">{order.totalAmount || 0} ر.س</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl font-bold text-sm transition-colors"
                  >
                    <Eye size={16} /> التفاصيل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-blue-950/40 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-blue-950">تفاصيل الطلب #{selectedOrder.id}</h2>
                <p className="text-sm text-gray-500 mt-1">تاريخ الطلب: {new Date(selectedOrder.createdAt || selectedOrder.orderDate || Date.now()).toLocaleDateString('ar-EG')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-grow">
              <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">المنتجات المطلوبة:</h3>
              <div className="space-y-4">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden">
                          {item.image || item.imageUrl ? (
                            <img src={item.image || item.imageUrl} alt={item.productName || item.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package size={24} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-blue-950 text-sm md:text-base">{item.productName || item.name || `منتج رقم ${item.productId}`}</h4>
                          <p className="text-sm text-gray-500 mt-1">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-black text-amber-600">
                        {(item.price || 0) * item.quantity} ر.س
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4 text-sm font-medium">لا توجد تفاصيل للمنتجات في هذا الطلب.</p>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex justify-between items-center">
              <span className="text-gray-600 font-bold">الإجمالي النهائي:</span>
              <span className="text-2xl font-black text-blue-950">{selectedOrder.totalAmount || 0} <span className="text-lg text-amber-600">ر.س</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}