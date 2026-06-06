import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/axiosConfig';
import { PlusCircle, Link as LinkIcon, Upload } from 'lucide-react';
type ViewType = 'overview' | 'list' | 'add' | 'orders' | 'categories';

// 2. بنستخدم النوع ده في تعريف الـ props
export default function AddProductForm({ setView }: { setView: (v: ViewType) => void }) {
    // باقي الكود زي ما هو ...
    const queryClient = useQueryClient();
    const [productImgType, setProductImgType] = useState<'link' | 'file'>('link');
    const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', description: '', image: '', stock: 10 });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await apiClient.get('/api/categories');
            return res.data.items || res.data || [];
        }
    });

    const addMutation = useMutation({
        mutationFn: async (formData: FormData) => await apiClient.post('/api/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
        onSuccess: () => {
            toast.success('تم إضافة المنتج بنجاح! ✅');
            setNewProduct({ title: '', price: '', category: '', description: '', image: '', stock: 10 });
            setImageFile(null);
            setView('list');
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result as string });
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Name', newProduct.title);
        formData.append('Price', newProduct.price.toString());
        formData.append('CategoryId', newProduct.category || (categories[0]?.id?.toString() || ''));
        formData.append('Description', newProduct.description || 'وصف المنتج');
        formData.append('StockQuantity', newProduct.stock.toString());

        if (productImgType === 'file' && imageFile) formData.append('Images', imageFile);
        else if (productImgType === 'link' && newProduct.image) formData.append('ImageUrl', newProduct.image);

        addMutation.mutate(formData);
    };

    return (
        <div className="max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-50"><h2 className="text-xl font-bold flex items-center gap-2"><PlusCircle className="text-amber-500" /> إضافة منتج جديد</h2></div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1 md:col-span-3">
                        <label className="block text-gray-700 font-bold mb-2">اسم المنتج</label>
                        <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full border rounded-xl px-4 py-3" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">القسم</label>
                        <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full border rounded-xl px-4 py-3 bg-white" required>
                            <option value="" disabled>اختر القسم...</option>
                            {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>)}
                        </select>
                    </div>
                    <div><label className="block font-bold mb-2">السعر</label><input type="number" required value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border rounded-xl px-4 py-3" /></div>
                    <div><label className="block font-bold mb-2">الكمية</label><input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} className="w-full border rounded-xl px-4 py-3" /></div>
                    <div className="col-span-1 md:col-span-3 space-y-3">
                        <label className="block font-bold">الصورة</label>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => setProductImgType('link')} className={`flex-1 py-2 rounded-xl border flex justify-center gap-2 ${productImgType === 'link' ? 'bg-blue-950 text-white' : 'bg-gray-50'}`}><LinkIcon size={16} /> رابط</button>
                            <button type="button" onClick={() => setProductImgType('file')} className={`flex-1 py-2 rounded-xl border flex justify-center gap-2 ${productImgType === 'file' ? 'bg-blue-950 text-white' : 'bg-gray-50'}`}><Upload size={16} /> رفع</button>
                        </div>
                        {productImgType === 'link' ? (
                            <input type="url" required value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full border rounded-xl px-4 py-3" dir="ltr" />
                        ) : (
                            <div className="border-2 border-dashed rounded-xl p-4 text-center relative">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {newProduct.image ? <div className="text-emerald-600 font-bold"><img src={newProduct.image} className="w-20 h-20 object-cover rounded-lg mx-auto mb-2" />تم الاختيار</div> : <Upload className="mx-auto text-gray-400" size={28} />}
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit" disabled={addMutation.isPending} className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl">{addMutation.isPending ? 'جاري الحفظ...' : 'حفظ وإضافة المنتج'}</button>
            </form>
        </div>
    );
}