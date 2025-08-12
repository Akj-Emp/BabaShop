// client/src/pages/Cart.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';

const Cart = ({ updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch cart items
        const cartRes = await axios.get('http://localhost:5000/api/cart');
        setCartItems(cartRes.data);
        
        // Fetch all products to get names and images
        const productsRes = await axios.get('http://localhost:5000/api/products');
        setProducts(productsRes.data);
        
        // Calculate total
        const totalRes = await axios.get('http://localhost:5000/api/cart/total');
        setTotal(totalRes.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to get product details by ID
  const getProductDetails = (productId) => {
    return products.find(product => product._id === productId) || {};
  };

  const updateQuantity = async (id, newQuantity) => {
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    try {
      await axios.put(`http://localhost:5000/api/cart/${id}`, { quantity });
      const res = await axios.get('http://localhost:5000/api/cart');
      setCartItems(res.data);
      updateCartCount();
      
      const totalRes = await axios.get('http://localhost:5000/api/cart/total');
      setTotal(totalRes.data.total);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`);
      const res = await axios.get('http://localhost:5000/api/cart');
      setCartItems(res.data);
      updateCartCount();
      
      const totalRes = await axios.get('http://localhost:5000/api/cart/total');
      setTotal(totalRes.data.total);
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-section">
            {cartItems.map(item => {
              const product = getProductDetails(item.id);
              return (
                <div key={item.id} className="cart-item">
                  <div className="item-image-container">
                    <img 
                      src={product.image || 'https://via.placeholder.com/150'} 
                      alt={product.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{product.name || 'Product'}</h3>
                    <p className="item-price">${item.price.toFixed(2)}</p>
                    
                    <div className="quantity-controls">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, e.target.value)}
                        className="quantity-input"
                      />
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="order-summary">
            <div className="summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">${total.toFixed(2)}</span>
              </div>
              
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
              
              <Link to="/" className="continue-shopping-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;