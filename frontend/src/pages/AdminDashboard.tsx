import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardOverview from '../components/admin/DashboardOverview';
import OrdersManager from '../components/admin/OrdersManager';
import CategoriesManager from '../components/admin/CategoriesManager';
import ProductsList from '../components/admin/ProductsList';
import AddProductForm from '../components/admin/AddProductForm';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  const [view, setView] = useState<'overview' | 'list' | 'add' | 'orders' | 'categories'>('overview');

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row" dir="rtl">
      {/* القائمة الجانبية */}
      <AdminSidebar view={view} setView={setView} />

      {/* المحتوى المتغير بناءً على الـ View */}
      <main className="flex-grow p-6 md:p-10">
        {view === 'overview' && <DashboardOverview />}
        {view === 'orders' && <OrdersManager />}
        {view === 'categories' && <CategoriesManager />}
        {view === 'list' && <ProductsList />}
        {view === 'add' && <AddProductForm setView={setView} />}
      </main>
    </div>
  );
}