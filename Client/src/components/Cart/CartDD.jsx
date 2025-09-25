import React, { useState } from 'react'
import './CartDD.css'
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartDropdown = () => {
  const { cartItems, subtotal, tax, total, shipping, removeFromCart, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setQuantities({...quantities, [itemId]: newQuantity});
    if (updateQuantity) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const addToWishlist = (item) => {
    // Wishlist functionality to be implemented
    console.log('Added to wishlist:', item);
  };

return (
    <div className="cart-dropdown bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-md w-80">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900">Your Cart</h4>
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
          {cartItems.length} items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🛒</div>
          <p className="text-gray-500 font-medium">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="max-h-80 overflow-y-auto space-y-3 mb-4">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h5>
                    <p className="text-xs text-gray-600 mb-2">{item.description || "Custom design product"}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity || 1) - 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {quantities[item.id] || item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (quantities[item.id] || item.quantity || 1) + 1)}
                          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          ${((item.price * (quantities[item.id] || item.quantity || 1))).toFixed(2)}
                        </div>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="text-xs text-red-600 font-medium">
                            🏷️ {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => addToWishlist(item)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
                      >
                        💝 Add to Wishlist
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-semibold">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Link to="/cart" className="block mt-4">
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg">
              🛒 Go to Cart
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartDD