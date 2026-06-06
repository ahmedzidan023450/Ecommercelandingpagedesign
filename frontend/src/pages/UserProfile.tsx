import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle, Eye, X, Phone, MapPin, Mail, Edit2, Save, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', phone: '' });
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orderDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['user-order-details', selectedOrder?.id],
    queryFn: async () => {
      const res = await apiClient.get(`/api/orders/${selectedOrder.id}`);
      return res.data;
    },
    enabled: !!selectedOrder?.id
  });

  // 1. جلب بيانات البروفايل
  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await apiClient.get('/api/user/profile');
      return res.data;
    },
    enabled: !!token,
  });

  // 2. جلب الطلبات
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const res = await apiClient.get('/api/orders');
      return res.data.items || res.data.data || res.data || [];
    },
    enabled: !!token,
  });

  // 3. تحديث البيانات
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: any) => await apiClient.put('/api/user/profile', payload),
    onSuccess: () => {
      toast.success('تم تحديث بياناتك بنجاح! ✅');
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    }
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ fullName: editForm.fullName, phoneNumber: editForm.phone });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedOrder(null);
    };
    if (selectedOrder) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOrder]);

  const renderOrderStatus = (status: any) => {
    const s = String(status);
    switch (s) {
      case '6': case 'Cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14} /> ملغي</span>;
      case '4': case 'Completed': case 'Delivered': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14} /> مكتمل</span>;
      case '3': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14} /> تم الشحن</span>;
      default: return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14} /> قيد المعالجة</span>;
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

        {/* Profile Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 relative">
          {/* التعديل هنا لربط الـ editForm بالبيانات */}
          <div className="absolute top-6 left-6">
            {!isEditing ? (
              <button onClick={() => {
                setEditForm({ fullName: profile?.fullName || user?.fullName || '', phone: profile?.phoneNumber || '' });
                setIsEditing(true);
              }} className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                <Edit2 size={16} /> تعديل البيانات
              </button>
            ) : (
              <button onClick={() => setIsEditing(false)} className="text-gray-400"><X size={24} /></button>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-blue-100 text-blue-950 rounded-2xl flex items-center justify-center text-3xl font-black">
              {profile?.fullName?.charAt(0) || 'ع'}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 w-full">
                <input type="text" value={editForm.fullName} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full border rounded-xl p-3" placeholder="الاسم" />
                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full border rounded-xl p-3" placeholder="الجوال" />
                <button type="submit" className="bg-blue-950 text-white px-6 py-2 rounded-xl font-bold">حفظ</button>
              </form>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{profile?.fullName || 'مرحباً بك'}</h1>
                <p className="text-gray-500">{profile?.email || user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal for Order Details */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-blue-950/40 z-[150] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-3xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedOrder(null)} className="absolute top-4 left-4"><X size={20} /></button>
              <h3 className="text-xl font-black mb-6">طلب {selectedOrder.orderNumber || `#${selectedOrder.id}`}</h3>
              
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-xs text-gray-400 font-bold mb-3">تفاصيل المنتجات:</p>
                  {isLoadingDetails ? (
                    <p className="text-sm font-bold text-blue-900">جاري تحميل المنتجات... ⏳</p>
                  ) : orderDetails?.items?.length > 0 ? (
                    <div className="space-y-3">
                      {orderDetails.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                          <div>
                            <p className="font-bold text-sm text-blue-950">{item.productName || 'منتج غير معروف'}</p>
                            <p className="text-xs font-bold text-gray-500 mt-1">الكمية: {item.quantity}</p>
                          </div>
                          <p className="font-black text-amber-600 text-sm">{item.total || (item.unitPrice * item.quantity)} ر.س</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-bold">لم يتم العثور على منتجات.</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="font-bold">الإجمالي:</span>
                  <span className="font-black text-amber-600">{selectedOrder.totalAmount || selectedOrder.total || 0} ر.س</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <h2 className="text-xl font-bold text-blue-950 mb-6">سجل الطلبات ({orders.length})</h2>
        {ordersLoading ? (
          <p>جاري تحميل الطلبات...</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
                <div>
                  <span className="font-bold">طلب {order.orderNumber || `#${order.id}`}</span>
                  <div className="mt-2">{renderOrderStatus(order.status)}</div>
                </div>
                <button onClick={() => setSelectedOrder(order)} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-bold">
                  <Eye size={16} /> التفاصيل
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}