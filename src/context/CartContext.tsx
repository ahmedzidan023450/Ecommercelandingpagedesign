import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { token, isAuthenticated } = useAuth(); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5150/api";

  // 1. جلب السلة (GET /api/cart)
  const fetchCart = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // بنحاول نجيب الداتا من أكتر من مكان حسب شكل استجابة السيرفر
        setCartItems(data.items || data.data || data || []); 
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, token]);

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.price || item.unitPrice || 0;
    const qty = item.quantity || 1;
    return total + (price * qty);
  }, 0);

  // 2. إضافة للسلة (POST /api/cart) - بياخد الـ ID والكمية
  const addToCart = async (productId: number, quantity: number = 1) => {
    if (!isAuthenticated || !token) {
      alert("يرجى تسجيل الدخول أولاً لإضافة المنتج للسلة!");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity }) // مبعوتة بالظبط زي السويجر
      });
      
      if (res.ok) {
        fetchCart(); 
        alert("تمت الإضافة للسلة بنجاح! 🛒");
      } else {
        const errTxt = await res.text();
        throw new Error(errTxt);
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);
      alert("لم نتمكن من إضافة المنتج: " + err.message);
    }
  };

  // 3. تعديل الكمية (PUT /api/cart/{productId})
  // 🔹 دالة تعديل الكمية (مؤمنة بالكامل للباك إند)
  const updateQuantity = async (productId: number, newQuantity: number) => {
      if (!token) return;
      if (newQuantity < 1) return;
      
      // تحديث فوري للشاشة عشان العميل ميستناش
      const previousItems = [...cartItems];
      setCartItems(cartItems.map(item => (item.productId || item.id) === productId ? { ...item, quantity: newQuantity } : item));

      try {
        // 👈 السر هنا: بعتنا الكمية في الرابط ?quantity= وكمان في الـ body عشان السيرفر ميقراهاش بصفر ويمسح المنتج
        const res = await fetch(`${apiUrl}/cart/${productId}?quantity=${newQuantity}`, {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ quantity: newQuantity }) 
        });
        
        if (!res.ok) {
          // لو السيرفر رفض، نرجع الرقم زي ما كان
          setCartItems(previousItems);
        } else {
          // لو نجح، نسحب السلة من جديد للتأكيد
          fetchCart();
        }
      } catch (err) {
        setCartItems(previousItems);
      }
  };

  // 4. حذف منتج معين (DELETE /api/cart/{productId})
  const removeFromCart = async (productId: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/cart/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCart();
      } else {
        throw new Error("Failed to remove item");
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  // 5. تفريغ السلة (DELETE /api/cart)
  const clearCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Error clearing entire cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, loading, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);