import React from 'react'
import './CartDD.css'
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartDropdown = () => {
  const { cartItems, subtotal, tax, total, shipping } = useCart();
  
return (
    <div className="cart-dropdown">
      <h4>Your Cart</h4>
{cartItems.length === 0 ? (
        <p className="empty">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item, index) => (
              <li key={index} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </li>
            ))}
          </ul>
<div className="price-summary">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Tax: ${tax.toFixed(2)}</p>
            <p>Shipping: ${shipping.toFixed(2)}</p>
            <hr />
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
<Link to="/cart">
            <button className="go-to-cart">Go to Cart</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartDD