import React from 'react';
import "./App.css"
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useProject } from './contexts/ProjectContext';

function App() {
  const { isAuthenticated, user } = useAuth();
  const { stats } = useProject();

  const features = [
    {
      icon: '🎨',
      title: 'Easy Design Tools',
      description: 'Create stunning designs with our intuitive drag-and-drop editor. Add text, images, and shapes with ease.'
    },
    {
      icon: '👕',
      title: 'Premium Products',
      description: 'High-quality apparel and accessories from trusted suppliers. T-shirts, hoodies, mugs, and more.'
    },
    {
      icon: '🚀',
      title: 'Fast Fulfillment',
      description: 'Orders processed and shipped quickly. Track your orders from production to delivery.'
    },
    {
      icon: '💰',
      title: 'No Upfront Costs',
      description: 'Start selling without inventory investment. We handle printing and shipping for you.'
    }
  ];

  const productShowcase = [
    { name: 'Premium T-Shirts', image: '👕', price: 'From $19.99' },
    { name: 'Cozy Hoodies', image: '🧥', price: 'From $39.99' },
    { name: 'Custom Mugs', image: '☕', price: 'From $14.99' },
    { name: 'Stylish Hats', image: '🧢', price: 'From $24.99' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'PrintCraft helped me launch my clothing line without any upfront investment. The quality is amazing!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Artist',
      content: 'The design tools are incredibly intuitive. I can create professional designs in minutes.',
      avatar: '👨‍🎨'
    },
    {
      name: 'Lisa Davis',
      role: 'Content Creator',
      content: 'My fans love the merchandise quality. Orders are fulfilled quickly and shipping is reliable.',
      avatar: '👩‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">👕 Whitney's Unique Creations 👚</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent text-3xl md:text-4xl mt-4">
                The Place That Lets You Customize
              </span>
            </h1>
            <div className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto">
              <p className="text-2xl md:text-3xl font-semibold mb-4">Creations You Want</p>
              <div className="space-y-2 text-lg md:text-xl flex flex-col items-center justify-center w-full">
                <p><span className="text-3xl">✨</span> What You Want!!</p>
                <p><span className="text-3xl">🎨</span> How You Want It!!</p>
                <p><span className="text-3xl">⚡</span> When You Want It!!</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/create"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    🎨 Start Designing
                  </Link>
                  <Link
                    to="/projects"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
                  >
                    📁 My Projects ({stats?.stats?.totalProjects || 0})
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/reg"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/products"
                    className="bg-white bg-opacity-20 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
                  >
                    Browse Products
                  </Link>
                </>
              )}
            </div>
            
            {!isAuthenticated && (
              <p className="mt-4 text-gray-200">
                No credit card required • Free to start • Premium quality guaranteed
              </p>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl opacity-10 animate-bounce hidden lg:block">🎨</div>
        <div className="absolute top-40 right-20 text-3xl opacity-10 animate-pulse hidden lg:block">👕</div>
        <div className="absolute bottom-20 left-20 text-3xl opacity-10 animate-bounce delay-1000 hidden lg:block">☕</div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto px-4">
              From design to delivery, we've got you covered with professional tools and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Premium Products, Perfect Quality
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated selection of high-quality products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto px-4">
            {productShowcase.map((product, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 p-6 text-center">
                <div className="mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 flex items-center justify-center">
                  <span className="text-4xl">{product.image}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-primary-600 font-semibold">{product.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge Our Creators Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎨 Challenge Our Creators!! 🎨
          </h2>
          <div className="text-xl md:text-2xl mb-8 space-y-4">
            <p className="font-semibold">See If Our Creators Can</p>
            <p className="text-2xl md:text-3xl bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-bold">
              Make Your Ideas Come To Life
            </p>
            <p>Just Click Below To Get Started:</p>
          </div>
          
          <Link
            to="/suggest"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-xl hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
          >
            ✨ What's Your Creation Idea? ✨
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto px-4">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Design</h3>
              <p className="text-gray-600">
                Use our intuitive design tools to create amazing products. Upload your own images or use our templates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell</h3>
              <p className="text-gray-600">
                List your products for sale or share them directly with customers. Set your own prices and profit margins.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fulfill</h3>
              <p className="text-gray-600">
                We handle printing, packaging, and shipping. You get paid, and your customers get premium products.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Print-on-Demand Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto px-4">
            Join thousands of creators who are already earning with PrintCraft.
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-4">
              <p className="text-lg">Welcome back, {user?.first}! 👋</p>
              <Link
                to="/create"
                className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Create New Design
              </Link>
            </div>
          ) : (
            <Link
              to="/reg"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default App;