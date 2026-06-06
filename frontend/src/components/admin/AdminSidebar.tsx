import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, FolderPlus, Activity, LogOut } from 'lucide-react';

type ViewType = 'overview' | 'list' | 'add' | 'orders' | 'categories';

// 2. استخدام النوع للـ view والـ setView
export default function AdminSidebar({ view, setView }: { view: string, setView: (v: ViewType) => void }) {
    // باقي الكود زي ما هو ...  
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <aside className="w-full md:w-64 bg-blue-950 text-white flex-shrink-0 flex flex-col">
            <div className="p-6 border-b border-blue-900">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <LayoutDashboard className="text-amber-500" /> الإدارة
                </h2>
            </div>
            <nav className="p-4 space-y-2 flex-grow">
                <button onClick={() => setView('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'overview' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Activity size={20} /> نظرة عامة</button>
                <button onClick={() => setView('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'orders' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><ShoppingCart size={20} /> إدارة الطلبات</button>
                <button onClick={() => setView('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'categories' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><FolderPlus size={20} /> إدارة الأقسام</button>
                <button onClick={() => setView('list')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'list' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><Package size={20} /> إدارة المنتجات</button>
                <button onClick={() => setView('add')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${view === 'add' ? 'bg-amber-500 text-white' : 'hover:bg-blue-900 text-blue-200'}`}><PlusCircle size={20} /> إضافة منتج جديد</button>
            </nav>
            <div className="p-4 border-t border-blue-900">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-bold">
                    <LogOut size={20} /> تسجيل الخروج
                </button>
            </div>
        </aside>
    );
}