import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for testing the waters',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '5 designs per month',
        'Basic design tools',
        'Standard product quality',
        'Email support',
        'PrintCraft branding on products'
      ],
      limitations: [
        'Limited product catalog',
        'No advanced analytics',
        'No priority support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Creator',
      description: 'For serious creators and small businesses',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Unlimited designs',
        'Advanced design tools',
        'Premium product quality',
        'Priority email support',
        'Remove PrintCraft branding',
        'Custom store integration',
        'Basic analytics dashboard',
        'Bulk order discounts'
      ],
      limitations: [],
      cta: 'Start Creating',
      popular: true
    },
    {
      name: 'Business',
      description: 'For growing businesses and teams',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        'Everything in Creator',
        'Team collaboration (up to 5 users)',
        'Advanced analytics & reporting',
        'White-label options',
        'API access',
        'Priority phone support',
        'Custom integrations',
        'Dedicated account manager'
      ],
      limitations: [],
      cta: 'Scale Your Business',
      popular: false
    },
    {
      name: 'Enterprise',
      description: 'For large organizations',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      features: [
        'Everything in Business',
        'Unlimited team members',
        'Custom development',
        'SLA guarantees',
        'Advanced security features',
        'On-premise deployment options',
        'Dedicated infrastructure',
        '24/7 priority support'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const productPricing = [
    { category: 'Apparel', items: [
      { name: 'T-Shirt', basePrice: '$12.99', yourPrice: '$19.99', profit: '$7.00' },
      { name: 'Hoodie', basePrice: '$24.99', yourPrice: '$39.99', profit: '$15.00' },
      { name: 'Tank Top', basePrice: '$11.99', yourPrice: '$18.99', profit: '$7.00' }
    ]},
    { category: 'Accessories', items: [
      { name: 'Mug', basePrice: '$8.99', yourPrice: '$14.99', profit: '$6.00' },
      { name: 'Phone Case', basePrice: '$12.99', yourPrice: '$24.99', profit: '$12.00' },
      { name: 'Hat', basePrice: '$15.99', yourPrice: '$24.99', profit: '$9.00' }
    ]}
  ];

  const faqs = [
    {
      question: 'How does print-on-demand work?',
      answer: 'You create designs, customers order products, and we handle printing and shipping. You only pay for products when they\'re ordered - no upfront inventory costs.'
    },
    {
      question: 'What\'s your profit margin?',
      answer: 'You set your own selling prices. Our base costs are transparent, and you keep everything above that as profit. Most creators earn 30-50% profit margins.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes! You can cancel your subscription at any time. Your account will remain active until the end of your current billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied, contact us for a full refund.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.'
    }
  ];

  const getPrice = (plan) => {
    if (plan.monthlyPrice === 'Custom') return 'Custom';
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice / 12;
    return price === 0 ? 'Free' : `$${price.toFixed(0)}`;
  };

  const getSavings = (plan) => {
    if (plan.monthlyPrice === 'Custom' || plan.monthlyPrice === 0) return null;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage;
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-100">
            Choose the plan that fits your business. Start free, upgrade when you're ready.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white bg-opacity-20 rounded-lg mb-8" style={{padding: '0.5rem'}}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingCycle === 'yearly' 
                  ? 'bg-white text-primary-600 shadow-sm' 
                  : 'text-white hover:text-gray-200'
              }`}
            >
              Yearly
              <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-primary-500 scale-105' 
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gray-900">
                        {getPrice(plan)}
                      </span>
                      {plan.monthlyPrice !== 'Custom' && plan.monthlyPrice !== 0 && (
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === 'monthly' ? 'month' : 'month, billed yearly'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && getSavings(plan) && (
                      <p className="text-sm text-green-600 mt-1">
                        Save {getSavings(plan)}% with yearly billing
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="text-green-500 mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <li key={limitIndex} className="flex items-start opacity-60">
                        <span className="text-gray-400 mr-3 mt-1">✗</span>
                        <span className="text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={plan.name === 'Enterprise' ? '/contact' : (isAuthenticated ? '/create' : '/reg')}
                    className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Pricing */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Product Pricing Examples
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how much you can earn with our transparent pricing model
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {productPricing.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h3>
                
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className="text-green-600 font-bold">{item.profit} profit</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Base cost: {item.basePrice}</span>
                        <span>Suggested price: {item.yourPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Want to see pricing for more products?
            </p>
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Still have questions?
            </p>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
            >
              Contact our support team →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-4 lg:px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of creators who are building successful businesses with PrintCraft.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/create' : '/reg'}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              {isAuthenticated ? 'Start Designing' : 'Get Started Free'}
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;