import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { CartItem } from '../context/CartContext';

const Payment = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isScreenshotUploaded, setIsScreenshotUploaded] = useState(false);
  const [transactionId, setTransactionId] = useState<string>(''); // New state for transaction ID
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false); // New state for cash on delivery

  // Derived state to check if payment details are provided
  const isPaymentDetailsProvided = isScreenshotUploaded || transactionId.trim().length > 0;

  // Handle Cash on Delivery change
  const handleCashOnDeliveryChange = () => {
    // If Cash on Delivery is already selected, don't allow deselection
    // User must select the other option to change
    if (!isCashOnDelivery) {
      setIsCashOnDelivery(true);
      setTransactionId('');
      setIsScreenshotUploaded(false);
    }
  };

  // Handle Online Payment selection
  const handleOnlinePaymentSelect = () => {
    setIsCashOnDelivery(false);
  };

  // Handle Transaction ID change
  const handleTransactionIdChange = (value: string) => {
    setTransactionId(value);
    if (value.trim().length > 0) {
      setIsCashOnDelivery(false);
    }
  };

  // Handle Screenshot change
  const handleScreenshotChange = (value: boolean) => {
    setIsScreenshotUploaded(value);
    if (value) {
      setIsCashOnDelivery(false);
    }
  };

  // 🔁 Fetch vendor cart items
  useEffect(() => {
    const fetchCart = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;

      try {
        const res = await axios.get(`https://peghouse.in/api/cart/${userId}`);
        setItems(res.data.items || []);
      } catch (err) {
        console.error('Cart fetch error:', err);
      }
    };

    fetchCart();
  }, []);

  const orderTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate 35% fee on Drinks only
  const drinksFee = items.reduce((sum, item) => {
    const isDrink = item.productId?.category === 'Drinks';
    if (isDrink) {
      return sum + item.price * item.quantity * 0.35;
    }
    return sum;
  }, 0);

  const deliveryCharges = 100.0;
  const platform = 12.0;
  const gst = 18.0;
  const gstAmount = (orderTotal + drinksFee) * gst / 100;
  const total = orderTotal + drinksFee + deliveryCharges + platform + gstAmount;

  // Validation: Check if exactly one payment method is selected
  const isOnlinePaymentValid = isScreenshotUploaded || transactionId.trim().length > 0;
  const isFormValid = (isOnlinePaymentValid && !isCashOnDelivery) || (isCashOnDelivery && !isOnlinePaymentValid);

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderId = localStorage.getItem('latestOrderId');
    if (!orderId) return alert('No order ID found. Please place an order first.');

    if (!isFormValid) {
      return alert('Please either provide payment details (transaction ID or screenshot) or select Cash on Delivery.');
    }

    try {
      // Send the request to backend
      const res = await axios.put(
        `https://peghouse.in/api/orders/${orderId}/pay`,
        {
          screenshotUploaded: isScreenshotUploaded,
          paymentProof: isScreenshotUploaded ? 'placeholder.jpg' : '', // Send a dummy payment proof
          transactionId: transactionId || null,
          isCashOnDelivery, // Send the cash on delivery status
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (res.data.message === 'Payment status updated successfully') {
        navigate('/order-success');
      } else {
        console.error("Payment failed:", res.data);
        alert('Payment failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Payment error:', err instanceof Error && err.hasOwnProperty('response') 
        ? (err as any).response?.data 
        : err);
      alert('Something went wrong while submitting payment.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center shadow-md">
        <button onClick={() => navigate('/checkout')} className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold text-center flex-1">Payment</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">Select Payment Method</h2>
          <div className="flex flex-col gap-3">
            <label className={`flex items-center p-3 border rounded-lg ${!isCashOnDelivery ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={!isCashOnDelivery}
                onChange={handleOnlinePaymentSelect}
                className="w-4 h-4 mr-3 accent-blue-600"
              />
              <span className="font-medium">Online Payment</span>
            </label>
            
            <label className={`flex items-center p-3 border rounded-lg ${isCashOnDelivery ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={isCashOnDelivery}
                onChange={handleCashOnDeliveryChange}
                className="w-4 h-4 mr-3 accent-blue-600"
              />
              <span className="font-medium">Cash on Delivery</span>
            </label>
          </div>
        </div>
        
        {/* QR Section - Only visible if online payment is selected */}
        {!isCashOnDelivery && (
        <div className="mb-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Scan QR to Pay</h2>
          <img
              src="/qr.jpg"
            alt="Admin QR Code"
            className="mx-auto w-48 h-48 object-contain border border-gray-200 rounded-lg shadow"
          />
          <p className="text-sm text-gray-500 mt-2">Use any UPI app to scan & pay</p>
        </div>
        )}

        {/* Online Payment Details - Only visible if online payment is selected */}
        {!isCashOnDelivery && (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            
            {/* Transaction ID input */}
            <div className="mb-4">
              <label htmlFor="transactionId" className="block text-gray-700 mb-2">Enter Transaction ID</label>
          <input
                id="transactionId"
            type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Transaction ID"
            value={transactionId}
                onChange={(e) => handleTransactionIdChange(e.target.value)}
          />
        </div>

            {/* Screenshot upload section */}
            <div className="mb-4">
              <h3 className="text-gray-700 mb-2">Payment Screenshot (OPTIONAL)</h3>
          <a
            href="https://drive.google.com/drive/folders/1i09WZAT0qd57MV9KMecAI6Rdvcon7TUF?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            UPLOAD PAYMENT SCREENSHOT HERE
          </a>
          <div className="mt-4">
            <input
              type="checkbox"
              id="paymentScreenshotCheckbox"
              checked={isScreenshotUploaded}
                  onChange={() => handleScreenshotChange(!isScreenshotUploaded)}
            />
            <label
              htmlFor="paymentScreenshotCheckbox"
              className="ml-2 text-gray-700"
            >
              I have Entered the Transaction ID or Uploaded the Payment Screenshot
            </label>
          </div>
        </div>

            {/* Visual indicator showing payment details status */}
            <div className={`text-sm mt-2 ${isPaymentDetailsProvided ? 'text-green-600' : 'text-gray-500'}`}>
              {isPaymentDetailsProvided 
                ? '✓ Payment details provided' 
                : ''}
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Cancellation Policy</h3>
          <p className="text-gray-600 text-sm">
            Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{orderTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drinks Service Fee (35%)</span>
              <span className="font-semibold">₹{drinksFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">₹{deliveryCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-semibold">₹{platform.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GST (18%)</span>
              <span className="font-semibold">₹{gstAmount.toFixed(2)}</span>
            </div>
            <div className="pt-3 mt-1 border-t">
              <div className="flex justify-between items-center">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-xl font-semibold">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePaymentSubmit}
          className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${
            isFormValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isFormValid}
        >
          Submit Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
