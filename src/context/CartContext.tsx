import React, { createContext, useState, useContext } from 'react';

// 1. بنعمل الـ Context نفسه (زي صندوق فاضي هنحط فيه الداتا)
export const CartContext = createContext<any>(null);

// 2. بنعمل الـ Provider (الموزع اللي هيلف الموقع كله ويديله الداتا دي)
export function CartProvider({ children }: { children: React.ReactNode }) {
  
  // بنخزن المنتجات اللي العميل بيختارها في مصفوفة فاضية كبداية
  const [cartItems, setCartItems] = useState<any[]>([]);

  // دالة الإضافة للسلة
  const addToCart = (product: any) => {
    setCartItems(prev => {
      // بندور: هل المنتج ده موجود أصلاً في السلة قبل كده؟
      const existing = prev.find(item => item.id === product.id);
      
      if (existing) {
        // لو موجود، بنزود الكمية بتاعته 1 بدل ما نضيفه كمنتج جديد متكرر
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // لو مش موجود، بنضيفه للسلة من الصفر ونديله كمية مبدئية = 1
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // دالة الحذف النهائي للمنتج من السلة بناءً على الـ id بتاعه
  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // دالة تقليل الكمية (لو العميل عايز يقلل حتة من منتج ضافه بالغلط)
  const decreaseQuantity = (id: number) => {
    setCartItems(prev => prev.map(item => {
      // لو المنتج هو اللي بندور عليه، وكميته أكبر من 1، نقصها 1
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }));
  };

  // بنرجع الـ Provider وبنديله الداتا والدوال دي عشان يوزعها
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

// 3. بنعمل Custom Hook عشان لما نحب نستخدم السلة في أي صفحة نكتب useCart() وبس
export const useCart = () => useContext(CartContext);