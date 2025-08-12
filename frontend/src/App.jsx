// client/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import axios from 'axios';
import './App.css';

function App() {
  const [cartCount, setCartCount] = useState(0);

  // Function to update cart count
  const updateCartCount = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart');
      const newCount = res.data.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(newCount);
    } catch (err) {
      console.error('Error updating cart count:', err);
    }
  };

  // Initial cart count load
  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <Router>
      <Navbar cartCount={cartCount} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route 
            path="/products/:id" 
            element={<ProductDetails updateCartCount={updateCartCount} />} 
          />
          <Route 
            path="/cart" 
            element={<Cart updateCartCount={updateCartCount} />} 
          />
          // In your App.js routes
          <Route path="/" element={<ProductList updateCartCount={updateCartCount} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;