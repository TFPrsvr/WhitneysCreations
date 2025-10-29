import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const OrderHistory = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3002/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Order fetch error:', error);
      
      // For now, show sample data if API fails (for development)
      if (error.response?.status === 401) {
        setError('Please log in to view your orders');
      } else {
        setError('Orders API not yet available. Showing sample data for development.');
        
        // Sample order data for development
        setOrders([
          {
            _id: 'sample1',
            orderNumber: 'ORD-2024-001',
            status: 'delivered',
            total: 34.99,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                name: 'Custom T-Shirt',
                quantity: 2,
                price: 15.99,
                variant: { size: 'L', color: 'Black' },
                emoji: '👕'
              }
            ],
            shippingAddress: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zip: '12345'
            },
            trackingNumber: 'TR123456789'
          },
          {
            _id: 'sample2',
            orderNumber: 'ORD-2024-002',
            status: 'processing',
            total: 27.99,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                name: 'Custom Mug',
                quantity: 1,
                price: 12.99,
                variant: { size: '11oz', color: 'White' },
                emoji: '☕'
              },
              {
                name: 'Sticker Pack',
                quantity: 3,
                price: 4.99,
                variant: { size: 'Small', color: 'Mixed' },
                emoji: '🌟'
              }
            ],
            shippingAddress: {
              street: '456 Oak Ave',
              city: 'Sample City',
              state: 'NY',
              zip: '67890'
            }
          },
          {
            _id: 'sample3',
            orderNumber: 'ORD-2024-003',
            status: 'pending',
            total: 45.99,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            items: [
              {
                name: 'Custom Hoodie',
                quantity: 1,
                price: 39.99,
                variant: { size: 'M', color: 'Navy' },
                emoji: '👔'
              }
            ],
            shippingAddress: {
              street: '789 Pine St',
              city: 'Test Town',
              state: 'TX',
              zip: '54321'
            }
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-16 bg-white rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please log in to view your orders</h2>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-white border-t-yellow-400 rounded-full animate-spin mb-4"></div>
            <p className="text-white font-semibold text-lg drop-shadow-md">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
      <div className="w-full px-8">
      <h1 className="text-lg font-bold text-white mb-4 drop-shadow-md">Order History</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-2 text-red-700 mb-3 text-xs">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1.5">No orders yet</h3>
          <p className="text-gray-700 text-sm mb-4 font-semibold">Start creating and ordering some amazing designs!</p>
          <a
            href="/products"
            className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Order #{order.orderNumber || order._id?.slice(-8)}
                    </h3>
                    <p className="text-gray-900 font-semibold text-xs">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">
                      ${order.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="border-t border-gray-100 pt-2">
                    <h4 className="font-medium text-gray-900 mb-1.5 text-xs">Items ({order.items.length})</h4>
                    <div className="space-y-1.5">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-lg">{item.emoji || '👕'}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-xs">{item.name || 'Custom Design'}</p>
                              <p className="text-[10px] font-semibold text-gray-900">
                                {item.variant && `${item.variant.size}, ${item.variant.color}`}
                              </p>
                              <p className="text-[10px] font-semibold text-gray-900">Qty: {item.quantity || 1}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900 text-xs">
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.shippingAddress && (
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <h4 className="font-bold text-gray-900 mb-1 drop-shadow-sm text-xs">Shipping Address</h4>
                    <p className="text-gray-900 font-semibold text-[10px]">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="border-t border-gray-100 pt-2 mt-2">
                    <h4 className="font-bold text-gray-900 mb-1 drop-shadow-sm text-xs">Tracking Information</h4>
                    <p className="text-gray-900 font-semibold text-[10px]">Tracking Number: {order.trackingNumber}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    className="text-primary-600 hover:text-primary-700 font-medium text-xs"
                  >
                    {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                  </button>

                  <div className="flex space-x-1.5">
                    {order.status === 'delivered' && (
                      <button className="px-2 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-[10px]">
                        Reorder
                      </button>
                    )}
                    {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                      <button className="px-2 py-1 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-[10px]">
                        Cancel Order
                      </button>
                    )}
                    <button className="px-2 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-[10px]">
                      Download Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-3 mt-4">
        <h2 className="text-base font-bold mb-2" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Need Help?</h2>
        <p className="text-xs mb-3">Have questions about your orders or need support?</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <a
            href="/contact"
            className="bg-white text-primary-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center text-xs"
          >
            Contact Support
          </a>
          <a
            href="/"
            className="bg-white text-primary-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center text-xs"
          >
            Create New Design
          </a>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrderHistory;