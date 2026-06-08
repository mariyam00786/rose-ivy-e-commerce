import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const { user } = useAuth();

  // Load guest cart from localStorage on boot
  useEffect(() => {
    if (!user) {
      const guestCart = localStorage.getItem('guest_cart');
      if (guestCart) {
        try {
          setCartItems(JSON.parse(guestCart));
        } catch (e) {
          setCartItems([]);
        }
      }
    } else {
      fetchMemberCart();
    }
  }, [user]);

  // Sync member cart
  const fetchMemberCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCartItems(data.items || []);
    } catch (err) {
      console.error('Error fetching member cart:', err);
    }
  };

  // Sync guest cart to member cart upon successful login
  const syncCartOnLogin = async () => {
    const guestCart = localStorage.getItem('guest_cart');
    if (!guestCart) return;

    try {
      const parsed = JSON.parse(guestCart);
      if (parsed.length > 0) {
        const { data } = await api.post('/cart/sync', { items: parsed });
        setCartItems(data.items || []);
        localStorage.removeItem('guest_cart');
        toast.success('Your cart was synced successfully! 🌸');
      }
    } catch (err) {
      console.error('Error syncing guest cart:', err);
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (items) => {
    setCartItems(items);
    localStorage.setItem('guest_cart', JSON.stringify(items));
  };

  // Add Item
  const addToCart = async (product, qty = 1) => {
    const quantity = Number(qty);
    const price = product.salePrice !== undefined && product.salePrice !== null ? product.salePrice : product.price;

    // Optimistic UI update
    const optimisticItems = [...cartItems];
    const existingIndex = optimisticItems.findIndex(item => {
      const itemId = item.productId?._id || item.productId?.id || item.productId;
      return itemId?.toString() === product._id?.toString();
    });

    if (existingIndex >= 0) {
      optimisticItems[existingIndex].quantity += quantity;
    } else {
      optimisticItems.push({
        productId: product,
        quantity,
        price
      });
    }

    if (!user) {
      // Guest path
      saveGuestCart(optimisticItems);
      toast.success('Added to cart (guest) 🌸');
    } else {
      // Member path
      try {
        await api.post('/cart', { productId: product._id, quantity });
        await fetchMemberCart();
        toast.success('Added to cart 🌸');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not add to cart');
      }
    }
  };

  // Update quantity
  const updateQuantity = async (productId, qty) => {
    const quantity = Number(qty);
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (!user) {
      const updated = cartItems.map(item => {
        const itemId = item.productId?._id || item.productId?.id || item.productId;
        return itemId?.toString() === productId?.toString()
          ? { ...item, quantity }
          : item;
      });
      saveGuestCart(updated);
    } else {
      try {
        await api.put('/cart', { productId, quantity });
        await fetchMemberCart();
      } catch (err) {
        toast.error('Could not update quantity');
      }
    }
  };

  // Remove Item
  const removeFromCart = async (productId) => {
    if (!user) {
      const updated = cartItems.filter(item => {
        const itemId = item.productId?._id || item.productId?.id || item.productId;
        return itemId?.toString() !== productId?.toString();
      });
      saveGuestCart(updated);
      toast.info('Removed from cart');
    } else {
      try {
        await api.delete(`/cart/${productId}`);
        await fetchMemberCart();
        toast.info('Removed from cart');
      } catch (err) {
        toast.error('Could not remove item');
      }
    }
  };

  // Clear Cart
  const clearCart = async () => {
    setCartItems([]);
    setDiscountCode('');
    setDiscountAmount(0);
    if (!user) {
      localStorage.removeItem('guest_cart');
    } else {
      try {
        await api.delete('/cart');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Coupon Discount check
  const applyDiscount = async (code) => {
    if (!code || code.trim() === '') return;
    
    // Simulate/verify coupon locally for guests, or fetch from backend for logged in users
    const cleanCode = code.toUpperCase().trim();
    
    // Simple verification
    let discount = 0;
    if (cleanCode === 'WELCOME10') {
      if (cartTotal >= 100) {
        discount = Math.round(cartTotal * 0.1);
        setDiscountCode('WELCOME10');
        setDiscountAmount(discount);
        toast.success('10% Welcome discount applied!');
      } else {
        toast.warning('Min order of AED 100 required for WELCOME10');
      }
    } else if (cleanCode === 'ROSE20') {
      if (cartTotal >= 300) {
        discount = Math.round(cartTotal * 0.2);
        setDiscountCode('ROSE20');
        setDiscountAmount(discount);
        toast.success('20% Rose discount applied!');
      } else {
        toast.warning('Min order of AED 300 required for ROSE20');
      }
    } else if (cleanCode === 'DXB50') {
      if (cartTotal >= 200) {
        discount = 50;
        setDiscountCode('DXB50');
        setDiscountAmount(discount);
        toast.success('AED 50 discount applied!');
      } else {
        toast.warning('Min order of AED 200 required for DXB50');
      }
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeDiscount = () => {
    setDiscountCode('');
    setDiscountAmount(0);
    toast.info('Coupon removed');
  };

  // Counts & totals
  const cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  
  const cartTotal = cartItems.reduce((sum, item) => {
    const p = item.productId;
    const price = p?.salePrice !== undefined && p?.salePrice !== null ? p.salePrice : (p?.price || item.price || 0);
    return sum + price * Number(item.quantity || 0);
  }, 0);

  // Free delivery on orders over AED 350, otherwise AED 35 delivery fee
  const deliveryFee = cartTotal >= 350 || cartTotal === 0 ? 0 : 35;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      deliveryFee,
      discountCode,
      discountAmount,
      grandTotal,
      applyDiscount,
      removeDiscount,
      syncCartOnLogin,
      fetchMemberCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
