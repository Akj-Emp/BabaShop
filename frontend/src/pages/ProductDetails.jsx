// client/src/pages/ProductDetails.js
import './ProductDetails.css';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = ({ updateCartCount }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await axios.post('http://localhost:5000/api/cart', {
        productId: id,
        quantity: parseInt(quantity) || 1
      });
      
      // Update cart count in navbar
      if (updateCartCount) {
        await updateCartCount();
      }
      
      alert('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-details">
      <img 
        src={product.image} 
        alt={product.name}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/300?text=No+Image';
        }}
      />
      <h2>{product.name}</h2>
      <p className="description">{product.description}</p>
      <p className="price">Price: ${product.price.toFixed(2)}</p>
      <div className="quantity-selector">
        <label>Quantity:</label>
        <input 
          type="number" 
          min="1" 
          max={product.stock}
          value={quantity} 
          onChange={(e) => setQuantity(Math.max(1, e.target.value))}
        />
      </div>
      <button 
        onClick={addToCart} 
        disabled={isAddingToCart}
        className="add-to-cart-btn"
      >
        {isAddingToCart ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default ProductDetails;