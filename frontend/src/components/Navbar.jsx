// client/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHome, FaBox, FaUserCog } from 'react-icons/fa';
import './Navbar.css'; // We'll create this CSS file next

const Navbar = ({ cartCount }) => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaHome /> ShopEasy
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              <FaBox /> Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cart" className="nav-links">
              <FaShoppingCart /> Cart ({cartCount})
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/admin" className="nav-links">
              <FaUserCog /> Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;