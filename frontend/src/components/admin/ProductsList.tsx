import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { Package, Edit, Trash2, X } from 'lucide-react';

export default function ProductsList() {
    const queryClient = useQueryClient();
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productToDelete, setProductToDelete] = useState<any>(null);

    const { data: products = [] } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await apiClient.get('/api/products?page=1&pageSize=50');
            return res.data.items || res.data || [];
        }
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await apiClient.get('/api/categories');
            return res.data.items || res.data || [];
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setEditingProduct(null);
                setProductToDelete(null);
            }
        };
        if (editingProduct || productToDelete) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editingProduct, productToDelete]);

    const updateMutation = useMutation({
        mutationFn: async (payload: any) => {
            const formData = new FormData();
            formData.append('Name', payload.name);
            formData.append('Price', payload.price.toString());
            formData.append('CategoryId', payload.categoryId.toString());
            formData.append('Description', payload.description || 'وصف المنتج');
            formData.append('StockQuantity', payload.stockQuantity?.toString() || payload.stock?.toString() || '10');
            if (payload.image) formData.append('ImageUrl', payload.image);
            return await apiClient.put(`/api/admin/products/${payload.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        },
        onSuccess: () => {
            toast.success('تم التعديل بنجاح! ✅');
            setEditingProduct(null);
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'حدث خطأ أثناء حفظ التعديلات');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => await apiClient.delete(`/api/admin/products/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success('تم الحذف بنجاح');
            setProductToDelete(null);
        },
        onError: () => {
            toast.error('حدث خطأ أثناء الحذف');
            setProductToDelete(null);
        }
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        
        let extractedCategoryId = editingProduct.categoryId;
        if (typeof editingProduct.category === 'object' && editingProduct.category !== null) {
            extractedCategoryId = editingProduct.category.id;
        } else if (editingProduct.category) {
            extractedCategoryId = editingProduct.category;
        }

        updateMutation.mutate({
            id: editingProduct.id,
            name: editingProduct.name || editingProduct.title,
            price: Number(editingProduct.price),
            categoryId: Number(extractedCategoryId),
            image: editingProduct.image || editingProduct.imageUrl,
            description: editingProduct.description,
            stockQuantity: editingProduct.stockQuantity || editingProduct.stock
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {editingProduct && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setEditingProduct(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setEditingProduct(null)} className="absolute top-4 left-4 text-gray-400"><X size={24} /></button>
                        <h2 className="text-2xl font-bold mb-6">تعديل المنتج</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input type="text" required value={editingProduct.name || editingProduct.title || ''} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" required value={editingProduct.price || ''} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                                    <select 
                                        value={
                                            typeof editingProduct.category === 'object' 
                                                ? editingProduct.category?.id 
                                                : editingProduct.category || editingProduct.categoryId || ''
                                        } 
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} 
                                        className="w-full border rounded-xl px-4 py-3 bg-white"
                                        required
                                    >
                                        <option value="" disabled>اختر القسم...</option>
                                        {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>)}
                                    </select>
                            </div>
                            <input type="url" value={editingProduct.image || editingProduct.imageUrl || ''} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="w-full border rounded-xl px-4 py-3" dir="ltr" />
                            <button type="submit" disabled={updateMutation.isPending} className="w-full bg-amber-500 text-white font-bold py-3.5 rounded-xl">{updateMutation.isPending ? 'جاري...' : 'حفظ'}</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">تأكيد الحذف</h3>
                        <p className="text-gray-600 mb-6">
                            هل أنت متأكد من رغبتك في حذف المنتج <span className="font-bold text-amber-600">"{productToDelete.name || productToDelete.title}"</span>؟ لا يمكن التراجع عن هذا الإجراء.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => deleteMutation.mutate(productToDelete.id)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {deleteMutation.isPending ? 'جاري الحذف...' : 'نعم، احذف'}
                            </button>
                            <button
                                onClick={() => setProductToDelete(null)}
                                disabled={deleteMutation.isPending}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold py-2 px-4 rounded-xl transition-colors disabled:opacity-50"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2"><Package className="text-amber-500" /> المنتجات الحالية ({products.length})</h2>
            </div>
            <table className="w-full text-right">
                <thead className="bg-gray-50 text-gray-600 text-sm font-bold"><tr><th className="p-4">كود المنتج</th><th className="p-4">المنتج</th><th className="p-4">السعر</th><th className="p-4">الإجراءات</th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                    {products.map((p: any) => (
                        <tr key={p.id}>
                            <td className="p-4 font-bold text-gray-500">{p.sku || '-'}</td>
                            <td className="p-4 font-bold flex items-center gap-3">
                                <img src={p.image || p.imageUrl || p.images?.[0]?.url || "https://via.placeholder.com/50"} className="w-12 h-12 rounded-lg object-cover border" />
                                {p.name || p.title}
                            </td>
                            <td className="p-4 text-amber-600 font-bold">{p.price}</td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => setEditingProduct(p)} className="p-2 text-blue-600"><Edit size={18} /></button>
                                <button onClick={() => setProductToDelete(p)} className="p-2 text-red-500"><Trash2 size={18} /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}