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
      <div className="min-h-screen bg-gray-50 pt-20 page-container">
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
      <div className="min-h-screen bg-gray-50 pt-20 page-container">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 page-container">
      <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Order History</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-600 text-lg mb-8">Start creating and ordering some amazing designs!</p>
          <a
            href="/products"
            className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Order #{order.orderNumber || order._id?.slice(-8)}
                    </h3>
                    <p className="text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      ${order.total?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-2xl">{item.emoji || '👕'}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name || 'Custom Design'}</p>
                              <p className="text-sm text-gray-600">
                                {item.variant && `${item.variant.size}, ${item.variant.color}`}
                              </p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900">
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {order.shippingAddress && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-gray-600">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                    </p>
                  </div>
                )}

                {order.trackingNumber && (
                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tracking Information</h4>
                    <p className="text-gray-600">Tracking Number: {order.trackingNumber}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                  </button>
                  
                  <div className="flex space-x-3">
                    {order.status === 'delivered' && (
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                        Reorder
                      </button>
                    )}
                    {['pending', 'processing'].includes(order.status?.toLowerCase()) && (
                      <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                        Cancel Order
                      </button>
                    )}
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
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
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="text-lg mb-6">Have questions about your orders or need support?</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/contact"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-center"
          >
            Contact Support
          </a>
          <a
            href="/"
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-center"
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