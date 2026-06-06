import React, { createContext, useContext, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axiosConfig';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // 1. جلب السلة (GET /api/cart) - مكيّشة بـ React Query
  const { data: cartItems = [], refetch: fetchCart } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await apiClient.get('/api/cart');
      const data = res.data;
      if (data && Array.isArray(data.items)) return data.items;
      if (data && Array.isArray(data.data)) return data.data;
      if (Array.isArray(data)) return data;
      return [];
    },
    enabled: isAuthenticated && user?.role === 'Customer'
  });

  // حساب الإجمالي
  const cartTotal = cartItems.reduce((total: number, item: any) => {
    const price = item.price || item.unitPrice || 0;
    const qty = item.quantity || 1;
    return total + (price * qty);
  }, 0);

  // 2. إضافة للسلة (POST /api/cart)
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }) => {
      return await apiClient.post('/api/cart', { productId, quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("تمت الإضافة للسلة بنجاح! 🛒");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "حدث خطأ أثناء الإضافة للسلة");
    }
  });

  // 3. تعديل الكمية (PUT /api/cart/{productId})
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }) => {
      return await apiClient.put(`/api/cart/${productId}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: () => {
      toast.error("فشل تحديث الكمية. حاول مرة أخرى.");
    }
  });

  // 4. حذف منتج (DELETE /api/cart/{productId})
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      return await apiClient.delete(`/api/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  // 5. تفريغ السلة (DELETE /api/cart)
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return await apiClient.delete('/api/cart');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  });

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      addToCart: (productId: number, quantity: number) => {
        if (!isAuthenticated) {
          toast.error("يرجى تسجيل الدخول أولاً لإضافة المنتج للسلة!");
          // تحويل لصفحة الدخول
          navigate('/login');
          return;
        }
        addToCartMutation.mutate({ productId, quantity });
      },
      removeFromCart: (productId: number) => removeFromCartMutation.mutate(productId),
      updateQuantity: (productId: number, quantity: number) => updateQuantityMutation.mutate({ productId, quantity }),
      clearCart: () => clearCartMutation.mutate(),
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);