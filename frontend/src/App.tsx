import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// المكونات العامة
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ProtectedRoute from './components/ProtectedRoute';

// استيراد جميع الصفحات
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SingleBedrooms from './pages/SingleBedrooms';
import DoubleBedrooms from './pages/DoubleBedrooms';
import KidsBedrooms from './pages/KidsBedrooms';
import Sofas from './pages/Sofas';
import WardrobeRooms from './pages/WardrobeRooms';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      <Toaster position="top-center" reverseOrder={false} />
      {/* الناف بار (Navbar) العلوي */}
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

      {/* سلة المشتريات الجانبية */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* مساحة عرض الصفحات المتغيرة (Routes) */}
      <main className="flex-grow">
        <Routes>
          {/* الصفحات العامة */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* الأقسام */}
          <Route path="/single-bedrooms" element={<SingleBedrooms />} />
          <Route path="/double-bedrooms" element={<DoubleBedrooms />} />
          <Route path="/kids-bedrooms" element={<KidsBedrooms />} />
          <Route path="/sofas" element={<Sofas />} />
          <Route path="/wardrobe-rooms" element={<WardrobeRooms />} />
          
          {/* تفاصيل المنتج والطلب */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/:id/:slug" element={<ProductDetails />} />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['Customer']}>
              <Checkout />
            </ProtectedRoute>
          } />
          
          {/* صفحات الحساب والإدارة */}
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['Customer', 'Admin']}>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* تذييل الصفحة (Footer) */}
      <Footer />
    </div>
  );
}

export default App;
