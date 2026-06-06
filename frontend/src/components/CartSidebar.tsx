import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const calculateTotal = () => {
    return cartItems.reduce((total: number, item: any) => {
      const priceStr = String(item.price || item.unitPrice || "0");
      const numericPrice = Number(priceStr.replace(/[^0-9.]/g, ""));
      return total + numericPrice * item.quantity;
    }, 0);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 left-0 h-full w-full sm:w-[400px] bg-white z-[70] transform transition-transform duration-300 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-blue-950 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={24} className="text-amber-500" />
            <h2 className="text-xl font-bold">سلة المشتريات</h2>
          </div>
          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button onClick={clearCart} title="تفريغ السلة" className="p-1.5 hover:bg-red-500/20 text-red-300 rounded-lg transition-colors">
                <Trash2 size={20} />
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingBag size={64} className="opacity-20" />
              <p className="text-lg font-medium">سلتك فارغة حالياً</p>
              <button onClick={onClose} className="text-amber-600 font-bold hover:underline mt-2">استمر في التسوق</button>
            </div>
          ) : (
            cartItems.map((item: any) => {
              const itemId = item.productId || item.id;
              return (
                <div key={itemId} className="flex gap-4 bg-gray-50 p-3 rounded-xl border border-gray-100 shadow-sm relative">
                  <img src={item.imageUrl || item.image || "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=200&q=80"} alt={item.productName || item.title || item.name} className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                  <div className="flex flex-col flex-grow justify-between">
                    <div className="pr-1">
                      <h3 className="font-bold text-blue-950 text-sm line-clamp-2 leading-tight">{item.productName || item.title || item.name}</h3>
                      <span className="text-amber-600 font-bold text-sm block mt-1.5">{item.price || item.unitPrice} ر.س</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 py-1 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity + 1)} 
                          className="text-blue-950 hover:text-amber-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        
                        <span className="font-bold text-sm w-5 text-center">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity - 1)} 
                          className={`text-blue-950 transition-colors ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-amber-600'}`}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(itemId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors absolute top-2 left-2">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="font-bold text-gray-600">الإجمالي:</span>
              <span className="font-bold text-blue-950 text-2xl">{calculateTotal().toLocaleString()} <span className="text-sm">ر.س</span></span>
            </div>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-lg py-3.5 rounded-xl flex justify-center transition-colors shadow-lg shadow-amber-500/30"
            >
              إتمام الطلب
            </Link>
          </div>
        )}
      </div>
    </>
  );
}