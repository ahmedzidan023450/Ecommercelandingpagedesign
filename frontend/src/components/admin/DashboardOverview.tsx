import React from 'react';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { Activity, FileDown, ShoppingCart, Package, Banknote } from 'lucide-react';

export default function DashboardOverview() {
    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await apiClient.get('/api/admin/dashboard/stats');
            return res.data;
        }
    });

    const handleExportPDF = async () => {
        try {
            const response = await apiClient.post('/api/admin/dashboard/export/pdf', {}, { responseType: 'blob' });
            const url = window.URL.createObjectURL(response.data);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Furniture-Dashboard-Report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error: any) { toast.error('فشل في تحميل التقرير'); }
    };

    if (isLoading) return <div className="text-center py-10 font-bold text-blue-950">جاري تحميل الأرقام... ⏳</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2"><Activity className="text-amber-500" /> إحصائيات المعرض</h2>
                <button onClick={handleExportPDF} className="flex items-center gap-2 bg-blue-950 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
                    <FileDown size={18} /> تحميل تقرير PDF
                </button>
            </div>
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
        </div>
    );
}