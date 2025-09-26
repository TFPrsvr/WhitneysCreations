import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import './CartDD.css'

const Cart = () => {
  const { cartItems, removeFromCart, subtotal, tax, total, shipping, updateQuantity } = useCart();
  const [quantities, setQuantities] = useState({});

  const { addToCart } = useCart();

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      name: "Custom Hoodie",
      price: 45.99,
    };
    addToCart(newItem);
  };

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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
      <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4 py-12">
        <h1 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-md">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Your cart is empty</h3>
            <p className="text-white font-semibold text-lg mb-6 drop-shadow-md">Add some awesome designs to get started!</p>
            <Link 
              to="/products"
              className="btn-gradient-primary inline-block px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              🛍️ Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Cart Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">🎨</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-lg font-bold text-gray-900">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                      >
                        <span className="text-lg">✕</span>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">${shipping.toFixed(2)}</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Shipping Options */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Shipping Options</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="shipping" value="standard" defaultChecked className="text-blue-600" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Standard Shipping</span>
                          <span className="font-semibold">$5.99</span>
                        </div>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="shipping" value="express" className="text-blue-600" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Express Shipping</span>
                          <span className="font-semibold">$12.99</span>
                        </div>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="radio" name="shipping" value="overnight" className="text-blue-600" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">Overnight Shipping</span>
                          <span className="font-semibold">$24.99</span>
                        </div>
                        <p className="text-sm text-gray-600">Next business day</p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <button className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2">
                  <span className="text-xl">🛒</span>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Cart;
