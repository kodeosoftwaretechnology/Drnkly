import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '../context/CartContext';


const Cart = () => {
  const navigate = useNavigate();
  const { items, setItems: setContextItems, clearCart: clearContextCart } = useCart();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const prevItemsRef = useRef<any[]>([]);

  // No local items state, use context items
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});
  const userId = localStorage.getItem('userId');
  
  // Track item being deleted for confirmation modal
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Shop Closed Modal
  const [showShopClosed, setShowShopClosed] = useState(false);

  // Coupon state
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showOldMonkModal, setShowOldMonkModal] = useState(false);

  // Initialize Facebook Pixel
  useEffect(() => {
    // Add Facebook Pixel base code
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '1232437498289481');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
    
    // Add noscript pixel
    const noscript = document.createElement('noscript');
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.src = 'https://www.facebook.com/tr?id=1232437498289481&ev=PageView&noscript=1';
    noscript.appendChild(img);
    document.body.appendChild(noscript);
    
    // Track ViewCart event
    if (window && (window as any).fbq) {
      (window as any).fbq('track', 'ViewCart');
    }
    
    // Clean up on unmount
    return () => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      if (noscript.parentNode) {
        document.body.removeChild(noscript);
      }
    };
  }, []);

  // Highlight effect for newly added/updated items
  useEffect(() => {
    const prevItems = prevItemsRef.current;
    // Find newly added or updated item
    for (const item of items) {
      const prev = prevItems.find(p => p.productId === item.productId);
      if (!prev || prev.quantity !== item.quantity) {
        setHighlightedId(item.productId);
        setTimeout(() => setHighlightedId(null), 1500);
        break;
      }
    }
    prevItemsRef.current = items;
  }, [items]);

  // Fetch cart items and sync with context
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) {
        toast.error('User not logged in');
        clearContextCart(); // Clear context cart if user is not logged in
        return;
      }

      try {
        const res = await axios.get(`https://peghouse.in/api/cart/${userId}`);
        const populatedItems = res.data.items.map((item: any) => ({
          ...item,
          category: item.productId?.category || null
        }));

        // Update the cart context with the fetched items
        const contextItems = res.data.items.map((item: any) => ({
          id: item.productId?._id || item.productId,
          productId: item.productId?._id || item.productId,
          name: item.productId?.name || item.name,
          price: Number(item.productId?.price || item.price),
          image: item.productId?.image || item.image,
          category: item.productId?.category || null,
          quantity: Number(item.quantity)
        }));
        setContextItems(contextItems);

        // If no items in cart, clear context
        if (res.data.items.length === 0) {
          clearContextCart();
        }

        // Debug: Log each product's category
        console.log('Fetched Cart Items:', res.data.items.length);
      } catch (error) {
        toast.error('Failed to load cart');
        console.error(error);
        clearContextCart();
      }
    };

    fetchCart();
  }, [userId, setContextItems, clearContextCart, location.search]); // Added location.search to refresh when URL changes

  // Update quantity in backend
  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      if (quantity <= 0) {
        setItemToDelete(productId);
        setShowDeleteConfirm(true);
        setIsLoading(prev => ({ ...prev, [productId]: false }));
        return;
      }

      const res = await axios.put('https://peghouse.in/api/cart/update', {
        userId,
        productId,
        quantity,
      });

      const updatedItems = res.data.cart.items.map((item: any) => ({
        ...item,
        category: item.productId?.category || null,
        name: item.productId?.name || item.name,
        image: item.productId?.image || item.image,
        price: item.productId?.price || item.price,
        productId: item.productId?._id || item.productId,
        quantity: item.quantity
      }));

      // setItems(updatedItems); // Remove local state update
      
      // Update the cart context with the updated items
      const contextItems = res.data.cart.items.map((item: any) => ({
        id: item.productId?._id || item.productId,
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || item.name,
        price: Number(item.productId?.price || item.price),
        image: item.productId?.image || item.image,
        category: item.productId?.category || null,
        quantity: Number(item.quantity)
      }));
      setContextItems(contextItems);

      // If no items left, clear context
      if (res.data.cart.items.length === 0) {
        clearContextCart();
      }
      
      // Track Add/Remove from Cart events for Facebook Pixel
      if (window && (window as any).fbq) {
        (window as any).fbq('track', 'UpdateCart', {
          content_type: 'product',
          content_ids: [productId],
          contents: [{ id: productId, quantity: quantity }],
          currency: 'INR'
        });
      }
      
      toast.success('Quantity updated');
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    setShowDeleteConfirm(false);
    setIsLoading(prev => ({ ...prev, [productId]: true }));
    
    try {
      const res = await axios.delete('https://peghouse.in/api/cart/remove', {
        data: { userId, productId },
      });
      
      const updatedItems = res.data.cart.items.map((item: any) => ({
        ...item,
        category: item.productId?.category || null,
        name: item.productId?.name || item.name,
        image: item.productId?.image || item.image,
        price: item.productId?.price || item.price,
        productId: item.productId?._id || item.productId,
        quantity: item.quantity
      }));
      
      // setItems(updatedItems); // Remove local state update
      
      // Update the cart context with the updated items
      const contextItems = res.data.cart.items.map((item: any) => ({
        id: item.productId?._id || item.productId,
        productId: item.productId?._id || item.productId,
        name: item.productId?.name || item.name,
        price: Number(item.productId?.price || item.price),
        image: item.productId?.image || item.image,
        category: item.productId?.category || null,
        quantity: Number(item.quantity)
      }));
      setContextItems(contextItems);

      // If no items left, clear context
      if (res.data.cart.items.length === 0) {
        clearContextCart();
      }
      
      // Track Remove from Cart event for Facebook Pixel
      if (window && (window as any).fbq) {
        (window as any).fbq('track', 'RemoveFromCart', {
          content_type: 'product',
          content_ids: [productId],
          currency: 'INR'
        });
      }
      
      toast.success('Item removed');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error('Error removing item:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Cancel delete confirmation
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  // Fix total and drinksFee calculations to always use numbers
  // Base total
  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  // Drinks Fee (20%)
  const drinksFee = items.reduce((sum, item) => {
    const category = item?.category;
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    if (category === 'Drinks') {
      return sum + price * quantity * 0.20;
    }
    return sum;
  }, 0);

  let shipping = total > 500 ? 0 : 100;

  const platformFee = 12;
  const gst = (total + drinksFee) * 0.18;
  // Update finalTotal to include discount
  const finalTotal = total + drinksFee + shipping + platformFee + gst - discountAmount;

  // Helper to check if Indian time is between 2:00 AM and 10:00 AM
  function isShopClosed() {
    // Get current time in Asia/Kolkata
    const now = new Date();
    // Convert to IST (Asia/Kolkata, UTC+5:30)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const ist = new Date(utc + istOffset);
    const hours = ist.getHours();
    // 2:00 <= hours < 10:00
    return hours >= 2 && hours < 10;
  }

 // Coupon logic (mock)
const handleApplyCoupon = async () => {
  setCouponError('');
  const code = couponCode.trim().toUpperCase();

  try {
    const res = await axios.get(`https://peghouse.in/api/coupons/${code}`);

    if (res.data && res.data.code === code) {
      // 10% off on all products (keep same logic)
      const discount = total * 0.10;
      setDiscountAmount(discount);
      setAppliedCoupon(code);
      setShowCouponModal(false);
      toast.success('Coupon applied! 10% off on all products.');
      // Store coupon info in localStorage
      localStorage.setItem('appliedCoupon', code);
      localStorage.setItem('discountAmount', discount.toString());
    } else {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('discountAmount');
    }
  } catch (error) {
    setCouponError('Invalid coupon code');
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem('appliedCoupon');
    localStorage.removeItem('discountAmount');
    console.error('Coupon check failed:', error);
  }
};

  // Add effect to load coupon info from localStorage on mount
  useEffect(() => {
    const coupon = localStorage.getItem('appliedCoupon');
    const discount = parseFloat(localStorage.getItem('discountAmount') || '0');
    if (coupon) setAppliedCoupon(coupon);
    if (discount) setDiscountAmount(discount);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-1 py-1 sm:px-1 lg:px-1">
        <div className="flex justify-center mb-2">
          <div
            className="cursor-pointer inline-block"
            onClick={() => navigate('/dashboard')}
          >
            <img
              src="/finallogo.png"
              alt="Drnkly Logo"
              className="h-16 sm:h-24 md:h-32 lg:h-40 mx-auto object-contain"
            />
          </div>
        </div>

        <div className="flex items-center mb-6">
          <ShoppingCart className="h-8 w-8 text-gray-900 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900 mr-4">Your Cart</h1>
          {/* Small Apply Coupon Button in header */}
          <button
            onClick={() => setShowCouponModal(true)}
            className="ml-2 px-3 py-1 text-sm border border-orange-500 text-orange-600 rounded hover:bg-orange-50 transition-colors disabled:opacity-60"
            disabled={!!appliedCoupon}
          >
            {appliedCoupon ? `Coupon: ${appliedCoupon}` : 'Apply Coupon'}
          </button>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="text-yellow-500 mr-3" size={24} />
                <h3 className="text-lg font-medium">Remove Item?</h3>
              </div>
              <p className="mb-6 text-gray-600">Are you sure you want to remove this item from your cart?</p>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => itemToDelete && removeFromCart(itemToDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <button
                  onClick={() => navigate('/products')}
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item: any) => {
                const itemId = item.productId;
                const itemLoading = isLoading[itemId] || false;
                
                return (
                  <div
                    key={itemId}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6 mb-6 transition-all duration-500 ${highlightedId === item.productId ? 'ring-2 ring-[#cd6839] bg-orange-50' : ''}`}
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-contain rounded-md bg-white"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">
                          Category: {item.category || 'N/A'}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          ₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                        </p>

                        {item.category === 'Drinks' && (
                          <p className="text-sm text-red-600 mt-1">
                            + ₹{(Number(item.price) * Number(item.quantity) * 0.20).toFixed(2)} Service Fee (20%)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center mt-4 sm:mt-0 justify-between sm:justify-end sm:space-x-6">
                      <div className="flex items-center">
                        <button
                          className="p-2 rounded-l-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-300"
                          onClick={() => updateQuantity(itemId, Number(item.quantity) - 1)}
                          disabled={itemLoading}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-5 w-5 text-gray-700" />
                        </button>
                        <span className="px-4 py-2 font-medium text-center bg-white border-t border-b border-gray-300 min-w-[40px]">
                          {itemLoading ? '...' : item.quantity}
                        </span>
                        <button
                          className="p-2 rounded-r-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-300"
                          onClick={() => updateQuantity(itemId, Number(item.quantity) + 1)}
                          disabled={itemLoading}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                      <button
                        className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors ml-4"
                        onClick={() => {
                          setItemToDelete(itemId);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={itemLoading}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5 mr-1" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {items.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-b-lg">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900 font-medium">₹{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Service Fee (20%)</span>
                <span className="text-gray-900 font-medium">₹{drinksFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900 font-medium">₹{shipping.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-600">Platform Fee</span>
                <span className="text-gray-900 font-medium">₹{platformFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-600">GST (18%)</span>
                <span className="text-gray-900 font-medium">₹{gst.toFixed(2)}</span>
              </div>

              {/* Coupon Discount */}
              {discountAmount > 0 && (
                <div className="flex justify-between mb-6">
                  <span className="text-green-600">Coupon Discount ({appliedCoupon})</span>
                  <span className="text-green-600">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between mb-6 text-lg font-semibold">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>

              

              <button
  onClick={() => {
    if (isShopClosed()) {
      setShowShopClosed(true);
      return;
    }

    // ❌ Restriction: Prevent checkout if only free Old Monk 180ml is in cart
    const onlyFreeOldMonkInCart = items.length === 1 &&
      items[0].name?.toLowerCase().includes('old monk') &&
      items[0].price === 0 &&
      items[0].quantity === 1;

   if (onlyFreeOldMonkInCart) {
  setShowOldMonkModal(true);
  return;
}


    // ✅ Facebook Pixel tracking
    if (window && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_type: 'product',
        contents: items.map(item => ({
          id: item.productId,
          quantity: Number(item.quantity)
        })),
        num_items: items.length,
        currency: 'INR',
        value: finalTotal
      });
    }

    // ✅ Navigate to checkout
    navigate('/checkout');
  }}
  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
>
  Proceed to Checkout
</button>

            </div>
          )}
        </div>
       {showOldMonkModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
      <div className="flex flex-col items-center mb-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-bold mt-2">Required</h3>
      </div>
      <p className="mb-6 text-gray-700">
        You cannot proceed with only the free <strong>Old Monk</strong>.<br />
        Please add at least one other product to your cart.
      </p>
      <button
        onClick={() => {
          setShowOldMonkModal(false);
          navigate('/products'); // 👈 Navigate to products page
        }}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Got it
      </button>
    </div>
  </div>
)}



        {/* Shop Closed Modal */}
        {showShopClosed && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
              <div className="flex flex-col items-center mb-4">
                <AlertTriangle className="text-yellow-500 mb-2" size={32} />
                <h3 className="text-lg font-bold mb-2">Shop Closed</h3>
              </div>
              <p className="mb-6 text-gray-700">
                Orders are not accepted between 2:00 AM to 10:00 AM.<br />
                You can place your order after 10:00 AM.<br />
                Thank you
              </p>
              <button
                onClick={() => setShowShopClosed(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Apply Coupon</h3>
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                placeholder="Enter coupon code"
                className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3"
                disabled={!!appliedCoupon}
              />
              {couponError && <p className="text-red-600 mb-2">{couponError}</p>}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  disabled={!!appliedCoupon}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <p style={{ display: 'none' }}>
          Sound file should be placed at: {process.env.PUBLIC_URL}/notification-sound.mp3
        </p> */}
      </div>
    </div>
  );
};

export default Cart;
