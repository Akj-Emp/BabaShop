// routes/cart.js
const express = require('express');
const router = express.Router();

// In-memory cart (for simplicity, in real app use database or session)
let cart = [];

// Get cart items
router.get('/', (req, res) => {
  res.json(cart);
});

// Add to cart
router.post('/', async (req, res) => {
  const { productId, quantity, price } = req.body;
  
  // In a real app, you would fetch product details from database
  const product = {
    id: productId,
    name: `Product ${productId}`,
    price: 10.99 * parseInt(productId),
    quantity: parseInt(quantity)
  };
  
  // Check if product already in cart
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += parseInt(quantity);
  } else {
    cart.push(product);
  }
  
  res.json(cart);
});

// Update cart item quantity
router.put('/:id', (req, res) => {
  const { quantity } = req.body;
  const item = cart.find(item => item.id === req.params.id);
  
  if (item) {
    item.quantity = parseInt(quantity);
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
});

// Remove from cart
router.delete('/:id', (req, res) => {
  cart = cart.filter(item => item.id !== req.params.id);
  res.json(cart);
});

// Calculate total
router.get('/total', (req, res) => {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  res.json({ total });
});

module.exports = router;