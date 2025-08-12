// client/src/pages/ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

const ProductList = ({ updateCartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
        
        // Initialize quantities
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(value, 100)) // Limit between 1-100
    }));
  };

  const addToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId,
        quantity: quantities[productId] || 1
      });
      
      if (updateCartCount) {
        await updateCartCount();
      }
      
      alert('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list-container">
      <h1 className="product-list-title">Our Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <Link to={`/products/${product._id}`} className="product-image-link">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.onerror = null;
                  // e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                }}
              />
            </Link>
            
            <div className="product-info">
              <Link to={`/products/${product._id}`} className="product-title">
                {product.name.length > 50 
                  ? `${product.name.substring(0, 50)}...` 
                  : product.name}
              </Link>
              
              <p className="product-description">
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </p>
              
              <div className="product-price">
                <span className="price-amount">${product.price.toFixed(2)}</span>
                {product.stock > 0 ? (
                  <span className="in-stock">In Stock</span>
                ) : (
                  <span className="out-of-stock">Out of Stock</span>
                )}
              </div>
              
              {product.stock > 0 && (
                <div className="product-actions">
                  <div className="quantity-selector">
                    <label>Qty:</label>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product._id] || 1}
                      onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <button 
                    onClick={() => addToCart(product._id)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;