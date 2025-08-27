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
    <div className="min-h-screen bg-gray-50 w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white w-full">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative w-full px-4 sm:px-4 lg:px-4 py-8 lg:py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block text-6xl md:text-7xl mb-4">👕 👚</span>
              <span className="block text-4xl md:text-6xl">Whitney's Unique Creations</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-4xl md:text-5xl mt-4 font-extrabold">
                The Place That Lets You Customize Your Ideas
              </span>
            </h1>
            <div className="text-xl md:text-2xl mb-8 text-gray-100 max-w-5xl mx-auto">
              <p className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Creations You Want</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-2xl md:text-3xl font-bold">
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl animate-pulse">✨</span>
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">What You Want!!</span>
                </div>
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl animate-spin" style={{animationDuration: '3s'}}>🎨</span>
                  <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">How You Want It!!</span>
                </div>
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="text-5xl animate-bounce" style={{animationDelay: '0.5s'}}>⚡</span>
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">When You Want It!!</span>
                </div>
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
              <div className="mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xl md:text-2xl font-bold">
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">No credit card required</span>
                  <span className="hidden sm:inline text-white">•</span>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">Free to start</span>
                  <span className="hidden sm:inline text-white">•</span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Premium quality guaranteed</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 text-4xl opacity-30 animate-bounce hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>🎨</div>
        <div className="absolute top-40 right-20 text-3xl opacity-30 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>👕</div>
        <div className="absolute top-20 right-10 text-4xl opacity-80 animate-bounce delay-1000 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))'}}>☕</div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
        <div className="absolute top-10 right-10 text-4xl opacity-40 animate-spin hidden lg:block" style={{animationDuration: '4s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🎨</div>
        <div className="absolute top-5 left-5 text-4xl opacity-40 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>👕</div>
        <div className="absolute top-5 right-5 text-4xl opacity-40" style={{filter: 'drop-shadow(2px 2px 4px rgba(34, 197, 94, 0.6))'}}>👚</div>
        <div className="w-full px-4 sm:px-4 lg:px-4">
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
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 break-words">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm break-words">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-8 bg-gray-50 relative">
        <div className="absolute top-5 left-5 text-2xl opacity-50 animate-bounce hidden lg:block" style={{animationDelay: '1s', filter: 'drop-shadow(2px 2px 4px rgba(255,140,0,0.6))'}}>☕</div>
        <div className="absolute bottom-5 right-5 text-2xl opacity-50 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🧢</div>
        <div className="w-full px-4 sm:px-4 lg:px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Premium Products, Perfect Quality
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated selection of high-quality products.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto px-4">
            {productShowcase.map((product, index) => (
              <div key={index} className="bg-white rounded-md shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 p-3 text-center">
                <div className="mb-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md p-4 flex items-center justify-center">
                  <span className="text-4xl">{product.image}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-primary-600 font-semibold text-sm">{product.price}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link
              to="/products"
              className="bg-primary-600 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-primary-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Challenge Our Creators Section */}
      <section className="py-16 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-4 lg:px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎨 Challenge Our Creators!! 🎨
          </h2>
          <div className="text-xl md:text-2xl mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-16 text-xl md:text-2xl font-bold max-w-5xl mx-auto">
              <div className="text-center flex-1">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  <div>See If Our</div>
                  <div>Creators Can</div>
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  <div>Make Your Ideas</div>
                  <div>Come To Life</div>
                </div>
              </div>
            </div>
            <p className="text-lg md:text-xl font-semibold mt-6">Just Click Below To Get Started:</p>
          </div>
          
          <Link
            to="/suggest"
            className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}
          >
            ✨ What's Your Creation Idea? ✨
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-white relative">
        <div className="absolute top-5 right-8 text-2xl opacity-40 animate-spin hidden lg:block" style={{animationDuration: '5s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🎨</div>
        <div className="absolute bottom-8 left-8 text-2xl opacity-40 animate-bounce hidden lg:block" style={{animationDelay: '0.8s', filter: 'drop-shadow(2px 2px 4px rgba(255,140,0,0.6))'}}>☕</div>
        <div className="absolute top-1/2 right-5 text-2xl opacity-40 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>👕</div>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-xl mx-auto px-4">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 -mt-8">
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
      <section className="py-12 bg-gradient-to-r from-primary-600 to-purple-600 text-white relative">
        <div className="absolute top-8 left-8 text-3xl opacity-30 animate-bounce hidden lg:block" style={{animationDelay: '2s', filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9))'}}>☕</div>
        <div className="absolute bottom-8 right-8 text-3xl opacity-30 animate-spin hidden lg:block" style={{animationDuration: '6s', filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>🎨</div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-4 lg:px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)', WebkitTextStroke: '1px rgba(0,0,0,0.3)'}}>
            Ready to Start Your Print-on-Demand Business?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto px-4 text-white font-bold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
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