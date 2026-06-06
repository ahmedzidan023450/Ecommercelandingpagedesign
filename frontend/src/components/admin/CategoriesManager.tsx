import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { FolderPlus, Edit, Trash2, X } from 'lucide-react';

export default function CategoriesManager() {
    const queryClient = useQueryClient();
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<any>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await apiClient.get('/api/categories');
            return res.data.items || res.data.data || res.data || [];
        }
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setEditingCategory(null);
        };
        if (editingCategory) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [editingCategory]);

    const addMutation = useMutation({
        mutationFn: async (name: string) => await apiClient.post('/api/categories', { name }),
        onSuccess: () => {
            toast.success('تم إضافة القسم بنجاح! ✅');
            setNewCategory('');
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: { id: number, name: string }) => await apiClient.put(`/api/categories/${data.id}`, { name: data.name }),
        onSuccess: () => {
            setEditingCategory(null);
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => await apiClient.delete(`/api/categories/${id}`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] })
    });

    return (
        <div className="space-y-6">
            {editingCategory && (
                <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={() => setEditingCategory(null)}>
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setEditingCategory(null)} className="absolute top-4 left-4 text-gray-400 hover:text-red-500"><X size={24} /></button>
                        <h2 className="text-2xl font-bold text-blue-950 mb-6">تعديل القسم</h2>
                        <form onSubmit={(e) => { e.preventDefault(); updateMutation.mutate(editingCategory); }}>
                            <input type="text" required value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none" />
                            <button type="submit" disabled={updateMutation.isPending} className="w-full bg-blue-950 text-white font-bold py-3.5 rounded-xl mt-6">{updateMutation.isPending ? 'جاري الحفظ...' : 'تحديث'}</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-blue-950 mb-4 flex items-center gap-2"><FolderPlus className="text-amber-500" /> إضافة قسم جديد</h2>
                <form onSubmit={(e) => { e.preventDefault(); if (newCategory.trim()) addMutation.mutate(newCategory); }} className="flex gap-4">
                    <input type="text" required placeholder="مثال: طاولات طعام" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="flex-grow border rounded-xl px-4 py-3 outline-none" />
                    <button type="submit" disabled={addMutation.isPending} className="bg-blue-950 text-white font-bold px-6 py-3 rounded-xl">{addMutation.isPending ? 'جاري...' : 'إضافة'}</button>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-600 text-sm font-bold"><tr><th className="p-4">القسم</th><th className="p-4">الإجراءات</th></tr></thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat: any) => (
                            <tr key={cat.id}>
                                <td className="p-4 font-bold">{cat.name || cat.title}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => setEditingCategory({ id: cat.id, name: cat.name || cat.title })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                                    <button onClick={() => { if (confirm('حذف؟')) deleteMutation.mutate(cat.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}