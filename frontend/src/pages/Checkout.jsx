// client/src/pages/Checkout.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [orderComplete, setOrderComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const [totalRes, cartRes] = await Promise.all([
          axios.get('http://localhost:5000/api/cart/total'),
          axios.get('http://localhost:5000/api/cart')
        ]);
        setTotal(totalRes.data.total);
        setCartItems(cartRes.data);
      } catch (err) {
        console.error('Error fetching cart data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, process payment here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate payment processing
      
      // Clear cart
      setOrderComplete(true);
      await axios.delete('http://localhost:5000/api/cart');
    } catch (err) {
      console.error('Error processing order:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !orderComplete) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your order...</p>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-complete">
        <div className="success-icon">✓</div>
        <h2>Thank you for your order!</h2>
        <p className="order-total">Your payment of <strong>${total.toFixed(2)}</strong> has been processed.</p>
        <p className="confirmation-message">A confirmation email has been sent to your registered email address.</p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="checkout-steps">
          <span className="active">1. Cart</span>
          <span className="active">2. Details</span>
          <span className="active">3. Payment</span>
          <span>4. Complete</span>
        </div>
      </div>

      <div className="checkout-content">
        <div className="order-summary">
          <h2 className="summary-title">Order Summary</h2>
          <div className="order-items">
            {cartItems.map(item => (
              <div key={item.id} className="order-item">
                <div className="item-image">
                  <img 
                    src={item.image || 'https://via.placeholder.com/60'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/60';
                    }}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <h2 className="payment-title">Payment Method</h2>
          <form onSubmit={handleSubmit} className="payment-form">
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'credit' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                />
                <div className="option-content">
                  <span className="option-icon">💳</span>
                  <span>Credit Card</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <div className="option-content">
                  <span className="option-icon">🔵</span>
                  <span>PayPal</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'credit' && (
              <div className="credit-card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456" 
                    pattern="[0-9\s]{13,19}" 
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiration Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY" 
                      pattern="(0[1-9]|1[0-2])\/?([0-9]{2})"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123" 
                      pattern="[0-9]{3,4}" 
                      required 
                    />
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="place-order-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;