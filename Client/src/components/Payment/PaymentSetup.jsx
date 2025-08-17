import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const PaymentSetup = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // Payment providers configuration
  const paymentProviders = [
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Global payment processing with 135+ currencies',
      logo: '💳',
      status: 'ready',
      fees: '2.9% + 30¢',
      features: ['Credit Cards', 'Digital Wallets', 'Bank Transfers', 'International'],
      supported: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Popular digital wallet and payment platform',
      logo: '🅿️',
      status: 'ready',
      fees: '2.9% + fixed fee',
      features: ['PayPal Account', 'Credit Cards', 'Pay in 4', 'International'],
      supported: true
    },
    {
      id: 'square',
      name: 'Square',
      description: 'Comprehensive payment and business tools',
      logo: '⬜',
      status: 'coming-soon',
      fees: '2.6% + 10¢',
      features: ['Credit Cards', 'Digital Wallets', 'In-person', 'Invoicing'],
      supported: false
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      description: 'Seamless payments on Apple devices',
      logo: '🍎',
      status: 'ready',
      fees: 'No additional fees',
      features: ['Touch ID', 'Face ID', 'Quick Checkout', 'Secure'],
      supported: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      description: 'Fast checkout with Google account',
      logo: '🅖',
      status: 'ready',
      fees: 'No additional fees',
      features: ['One-tap checkout', 'Autofill', 'Cross-platform', 'Secure'],
      supported: true
    }
  ];

  // Sample pricing plans for context
  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 0,
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 designs per month',
        'Basic templates',
        'Standard support',
        'Web-based editor'
      ],
      limitations: [
        'Limited premium fonts',
        'Basic mockups only',
        'Standard resolution exports'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 19.99,
      period: 'month',
      description: 'For serious creators and small businesses',
      features: [
        'Unlimited designs',
        'Premium templates & fonts',
        'High-res exports',
        'Advanced mockups',
        'Priority support',
        'Commercial license'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 49.99,
      period: 'month',
      description: 'For teams and large organizations',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Custom integrations'
      ]
    }
  ];

  // Load billing info from user profile
  useEffect(() => {
    if (isAuthenticated && user) {
      setBillingInfo({
        fullName: `${user.first || ''} ${user.last || ''}`.trim(),
        email: user.email || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zipCode: user.zipCode || '',
        country: user.country || 'US'
      });
    }
  }, [isAuthenticated, user]);

  // Load saved payment methods (mock data for demo)
  useEffect(() => {
    if (isAuthenticated) {
      const savedMethods = JSON.parse(localStorage.getItem(`printcraft_payment_methods_${user?.id}`) || '[]');
      setPaymentMethods(savedMethods);
    }
  }, [isAuthenticated, user]);

  const handleBillingInfoChange = (field, value) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardInfoChange = (field, value) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) formattedValue = formattedValue.substring(0, 19);
    } else if (field === 'expiryDate') {
      // Format expiry date MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
      if (formattedValue.length > 5) formattedValue = formattedValue.substring(0, 5);
    } else if (field === 'cvv') {
      // Only allow numbers
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) formattedValue = formattedValue.substring(0, 4);
    }

    setCardInfo(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const addPaymentMethod = () => {
    if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardholderName) {
      alert('Please fill in all card details');
      return;
    }

    const newMethod = {
      id: Date.now().toString(),
      type: 'card',
      last4: cardInfo.cardNumber.replace(/\s/g, '').slice(-4),
      brand: getCardBrand(cardInfo.cardNumber),
      expiryMonth: cardInfo.expiryDate.split('/')[0],
      expiryYear: cardInfo.expiryDate.split('/')[1],
      cardholderName: cardInfo.cardholderName,
      isDefault: paymentMethods.length === 0,
      addedAt: new Date().toISOString()
    };

    const updatedMethods = [...paymentMethods, newMethod];
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`printcraft_payment_methods_${user?.id}`, JSON.stringify(updatedMethods));

    // Reset form
    setCardInfo({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    setShowAddCard(false);
  };

  const getCardBrand = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    if (number.startsWith('6')) return 'Discover';
    return 'Unknown';
  };

  const removePaymentMethod = (methodId) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== methodId);
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`printcraft_payment_methods_${user?.id}`, JSON.stringify(updatedMethods));
  };

  const setDefaultPaymentMethod = (methodId) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === methodId
    }));
    setPaymentMethods(updatedMethods);
    localStorage.setItem(`printcraft_payment_methods_${user?.id}`, JSON.stringify(updatedMethods));
  };

  const saveBillingInfo = () => {
    // In a real app, this would save to the backend
    localStorage.setItem(`printcraft_billing_info_${user?.id}`, JSON.stringify(billingInfo));
    alert('Billing information saved successfully');
  };

  const simulatePayment = (amount, planId) => {
    if (!isAuthenticated) {
      alert('Please sign in to purchase a plan');
      return;
    }

    if (paymentMethods.length === 0) {
      alert('Please add a payment method first');
      setActiveTab('methods');
      return;
    }

    // Simulate payment processing
    const confirmed = window.confirm(`Process payment of $${amount} for the ${planId} plan?`);
    if (confirmed) {
      // In a real app, this would integrate with Stripe/PayPal
      alert('Payment successful! Your plan has been upgraded.');
      
      // Update user's subscription status (mock)
      const subscriptionData = {
        planId,
        status: 'active',
        startDate: new Date().toISOString(),
        nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount
      };
      localStorage.setItem(`printcraft_subscription_${user?.id}`, JSON.stringify(subscriptionData));
    }
  };

  const tabs = [
    { id: 'overview', name: 'Payment Overview', icon: '💳' },
    { id: 'methods', name: 'Payment Methods', icon: '🔧' },
    { id: 'billing', name: 'Billing Info', icon: '📋' },
    { id: 'plans', name: 'Pricing Plans', icon: '💰' },
    { id: 'providers', name: 'Payment Providers', icon: '🏪' }
  ];

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
        <p className="text-gray-600 mb-6">
          Please sign in to access payment settings and upgrade your plan.
        </p>
        <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
        <div className="text-sm text-gray-600">
          Current Plan: <span className="font-medium text-primary-600">
            {user?.role === 'premium' ? 'Premium' : 'Basic'}
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Plan Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Plan</div>
                  <div className="text-xl font-bold text-gray-900">
                    {user?.role === 'premium' ? 'Premium' : 'Basic'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {user?.role === 'premium' ? '$19.99/month' : 'Free'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Next Billing</div>
                  <div className="text-xl font-bold text-gray-900">
                    {user?.role === 'premium' ? 'Dec 26, 2024' : 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {user?.role === 'premium' ? 'Auto-renewal' : 'No billing'}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Payment Methods</div>
                  <div className="text-xl font-bold text-gray-900">{paymentMethods.length}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {paymentMethods.length > 0 ? 'Methods saved' : 'No methods'}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('plans')}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                  <button
                    onClick={() => setActiveTab('methods')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Manage Payment Methods
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Update Billing Info
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Security */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Trust</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">🔒</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">SSL Encryption</div>
                      <div className="text-sm text-gray-600">All payments are encrypted and secure</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600">🛡️</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">PCI Compliant</div>
                      <div className="text-sm text-gray-600">Industry standard security protocols</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600">💳</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Secure Storage</div>
                      <div className="text-sm text-gray-600">Card details are tokenized and protected</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600">📞</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">24/7 Support</div>
                      <div className="text-sm text-gray-600">Help available anytime you need it</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
              <button
                onClick={() => setShowAddCard(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <span>➕</span>
                <span>Add Card</span>
              </button>
            </div>

            {paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div 
                    key={method.id}
                    className={`border rounded-lg p-4 ${method.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gray-800 rounded text-white text-xs flex items-center justify-center font-bold">
                          {method.brand.toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            •••• •••• •••• {method.last4}
                          </div>
                          <div className="text-sm text-gray-600">
                            Expires {method.expiryMonth}/{method.expiryYear} • {method.cardholderName}
                          </div>
                          {method.isDefault && (
                            <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!method.isDefault && (
                          <button
                            onClick={() => setDefaultPaymentMethod(method.id)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => removePaymentMethod(method.id)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💳</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods</h3>
                <p className="text-gray-600 mb-4">Add a credit card to get started with premium features</p>
                <button
                  onClick={() => setShowAddCard(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Your First Card
                </button>
              </div>
            )}

            {/* Add Card Modal */}
            {showAddCard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-md w-full p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Payment Method</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cardNumber}
                        onChange={(e) => handleCardInfoChange('cardNumber', e.target.value)}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardInfo.expiryDate}
                          onChange={(e) => handleCardInfoChange('expiryDate', e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => handleCardInfoChange('cvv', e.target.value)}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cardholderName}
                        onChange={(e) => handleCardInfoChange('cardholderName', e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => setShowAddCard(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addPaymentMethod}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={billingInfo.fullName}
                  onChange={(e) => handleBillingInfoChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={billingInfo.email}
                  onChange={(e) => handleBillingInfoChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={billingInfo.address}
                  onChange={(e) => handleBillingInfoChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={billingInfo.city}
                  onChange={(e) => handleBillingInfoChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={billingInfo.state}
                  onChange={(e) => handleBillingInfoChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={billingInfo.zipCode}
                  onChange={(e) => handleBillingInfoChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  value={billingInfo.country}
                  onChange={(e) => handleBillingInfoChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={saveBillingInfo}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Billing Information
              </button>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
              <p className="text-gray-600">Upgrade anytime to unlock premium features and grow your business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingPlans.map(plan => (
                <div 
                  key={plan.id}
                  className={`border rounded-xl p-6 relative ${
                    plan.popular 
                      ? 'border-primary-500 ring-2 ring-primary-100' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary-500 text-white px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      ${plan.price}
                      <span className="text-lg text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <li key={index} className="flex items-center text-gray-500">
                        <span className="text-gray-400 mr-3">✗</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => plan.price > 0 && simulatePayment(plan.price, plan.id)}
                    disabled={plan.price === 0 && user?.role !== 'premium'}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${
                      plan.price === 0
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'border border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.price === 0 ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Providers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentProviders.map(provider => (
                <div 
                  key={provider.id}
                  className={`border rounded-xl p-6 ${
                    provider.supported ? 'border-gray-200' : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{provider.logo}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          provider.status === 'ready' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {provider.status === 'ready' ? 'Ready' : 'Coming Soon'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{provider.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Processing Fees:</span>
                      <span className="text-sm text-gray-600 ml-2">{provider.fees}</span>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-gray-700 block mb-2">Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {provider.features.map((feature, index) => (
                          <span 
                            key={index}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      disabled={!provider.supported}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        provider.supported
                          ? 'bg-primary-600 text-white hover:bg-primary-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {provider.supported ? 'Configure' : 'Coming Soon'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSetup;