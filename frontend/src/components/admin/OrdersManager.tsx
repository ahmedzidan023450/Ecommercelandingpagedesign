import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { ShoppingCart, Eye, X } from 'lucide-react';

export default function OrdersManager() {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    const { data: orderDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ['admin-order-details', selectedOrder?.id],
        queryFn: async () => {
            const res = await apiClient.get(`/api/admin/orders/${selectedOrder.id}`);
            return res.data;
        },
        enabled: !!selectedOrder?.id
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedOrder(null);
        };
        if (selectedOrder) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedOrder]);

    const { data: orders = [] } = useQuery({
        queryKey: ['admin-orders'],
        queryFn: async () => {
            const res = await apiClient.get('/api/admin/orders');
            return res.data.items || res.data || [];
        }
    });

    const getStatusValue = (statusStr: string | number) => {
        if (typeof statusStr === 'number') return statusStr;
        const map: Record<string, number> = {
            "Pending": 0, "Confirmed": 1, "Processing": 2, 
            "Shipped": 3, "Delivered": 4, "Cancelled": 5, "Refunded": 6
        };
        return map[statusStr] ?? 0;
    };

    const updateStatusMutation = useMutation({
        mutationFn: async (data: { orderId: number, status: number }) => await apiClient.patch(`/api/admin/orders/${data.orderId}/status`, { status: data.status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة الطلب.');
        }
    });

    const safeOrdersList = Array.isArray(orders) ? orders : (orders && (orders as any).id ? [orders] : []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {selectedOrder && (
                <div className="fixed inset-0 bg-blue-950/40 z-[150] flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white rounded-3xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedOrder(null)} className="absolute top-4 left-4"><X size={20} /></button>
                        <h3 className="text-xl font-black mb-6">بون شحن {selectedOrder.orderNumber || `#${selectedOrder.id}`}</h3>
                        <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
                            <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-xs text-gray-400 font-bold">اسم المستلم:</p><p className="font-bold">{selectedOrder.recipientName || selectedOrder.customerName}</p></div>
                            <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-xs text-gray-400 font-bold">رقم الجوال:</p><p className="font-mono font-bold text-amber-600" dir="ltr">{selectedOrder.phoneNumber || selectedOrder.phone}</p></div>
                            <div className="bg-gray-50 p-4 rounded-2xl"><p className="text-xs text-gray-400 font-bold">العنوان:</p><p className="font-semibold text-sm">{selectedOrder.shippingAddress || selectedOrder.address}</p></div>

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
                                    <p className="text-sm text-gray-500 font-bold">لا توجد منتجات مسجلة.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart className="text-amber-500" /> إدارة الطلبات</h2></div>
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-sm font-bold"><tr><th className="p-4">رقم</th><th className="p-4">العميل</th><th className="p-4">المبلغ</th><th className="p-4">الحالة</th><th className="p-4">تفاصيل</th></tr></thead>
                <tbody>
                    {safeOrdersList.map((o: any) => (
                        <tr key={o.id} className="border-t border-gray-50">
                            <td className="p-4 font-bold">{o.orderNumber || `#${o.id}`}</td>
                            <td className="p-4">{o.customerName || o.recipientName}</td>
                            <td className="p-4 text-amber-600 font-black">{o.totalAmount || o.total} ر.س</td>
                            <td className="p-4">
                                <select value={getStatusValue(o.status)} onChange={(e) => updateStatusMutation.mutate({ orderId: o.id, status: Number(e.target.value) })} className="px-3 py-2 border rounded-xl text-sm font-bold bg-gray-50 outline-none">
                                    <option value="0">قيد المعالجة</option><option value="3">تم الشحن</option><option value="4">مكتمل</option><option value="5">إلغاء</option>
                                </select>
                            </td>
                            <td className="p-4"><button onClick={() => setSelectedOrder(o)} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold flex gap-1"><Eye size={14} /> عرض</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}