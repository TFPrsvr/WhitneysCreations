import React, { useEffect } from 'react';
import "./App.css"
import './styles/accessibility.css';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useProject } from './contexts/ProjectContext';
import { accessibility } from './utils/accessibility';
import IconAttributions from './components/Attribution/IconAttributions';
import ShareWidget from './components/Share/ShareWidget';

function App() {
  const { isAuthenticated, user } = useAuth();
  const { stats } = useProject();

  // Initialize accessibility features
  useEffect(() => {
    accessibility.init();
  }, []);

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
    <div className="min-h-screen bg-gray-50 page-container">
      {/* Hero Section */}
      <main id="main-content">
        <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white w-full" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative w-full px-6 py-4">
          <div className="text-center">
            <h1 id="hero-title" className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
              <span className="block text-2xl md:text-4xl mb-4">Whitney's Unique Creations</span>
              <span className="block text-4xl md:text-5xl mb-3" aria-hidden="true">👕 👚</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-xl md:text-3xl mt-4 font-extrabold">
                The Place That Lets You Customize Your Ideas
              </span>
            </h1>
            <div className="text-xl md:text-2xl mb-8 text-gray-100 max-w-5xl mx-auto">
              <p className="text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Creations You Want</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-lg md:text-xl font-bold">
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">What You Want</span>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl text-red-500 animate-bounce" style={{animationDelay: '0s'}} aria-hidden="true">❗</span>
                  <span className="text-3xl text-red-500 animate-bounce -ml-2" style={{animationDelay: '0.2s'}} aria-hidden="true">❗</span>
                </div>
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent">How You Want It</span>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl text-red-500 animate-bounce" style={{animationDelay: '0.1s'}} aria-hidden="true">❗</span>
                  <span className="text-3xl text-red-500 animate-bounce -ml-2" style={{animationDelay: '0.3s'}} aria-hidden="true">❗</span>
                </div>
                <div className="flex items-center gap-2 transform hover:scale-110 transition-transform duration-300">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-teal-500 bg-clip-text text-transparent">When You Want It</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-20 justify-center items-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/studio"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    aria-label="Start designing your custom products"
                  >
                    <span aria-hidden="true">🎨</span> Start Designing
                  </Link>
                  <Link
                    to="/projects"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
                    aria-label={`View my projects (${stats?.stats?.totalProjects || 0} projects)`}
                  >
                    <span aria-hidden="true">📁</span> My Projects ({stats?.stats?.totalProjects || 0})
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
        <div className="absolute top-5 left-10 text-4xl opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))'}} aria-hidden="true">🎨</div>
        <div className="absolute top-5 right-10 text-4xl opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))'}} aria-hidden="true">☕</div>
      </section>

        {/* Features Section */}
        <section className="py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative" aria-labelledby="features-title">
        <div className="absolute top-10 right-10 text-4xl opacity-40 animate-spin hidden lg:block" style={{animationDuration: '4s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🎨</div>
        <div className="absolute top-5 left-5 text-4xl opacity-40 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>👕</div>
        <div className="w-full px-6">
          <div className="text-center mb-6">
            <h2 id="features-title" className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-800 font-semibold max-w-xl mx-auto px-4 drop-shadow-sm">
              From design to delivery, we've got you covered with professional tools and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto px-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-start">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-1 break-words">{feature.title}</h3>
                <p className="text-gray-900 font-semibold leading-snug text-sm break-words mb-2">{feature.description}</p>
                <div className="text-xs text-gray-800 font-semibold space-y-0.5 mt-1">
                  {feature.title === 'Easy Design Tools' && (
                    <>
                      <div>• Drag-and-drop editor</div>
                      <div>• 1000+ templates</div>
                      <div>• Custom fonts & graphics</div>
                    </>
                  )}
                  {feature.title === 'Premium Products' && (
                    <>
                      <div>• High-quality materials</div>
                      <div>• Professional printing</div>
                      <div>• Multiple product types</div>
                    </>
                  )}
                  {feature.title === 'Fast Fulfillment' && (
                    <>
                      <div>• Quick processing</div>
                      <div>• Worldwide shipping</div>
                      <div>• Order tracking</div>
                    </>
                  )}
                  {feature.title === 'No Upfront Costs' && (
                    <>
                      <div>• No initial investment</div>
                      <div>• Print on demand</div>
                      <div>• Start immediately</div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="py-8 bg-gray-50 relative">
        <div className="absolute top-5 left-5 text-2xl opacity-50 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🧢</div>
        <div className="absolute top-5 right-5 text-2xl opacity-50 animate-bounce hidden lg:block" style={{animationDelay: '1s', filter: 'drop-shadow(2px 2px 4px rgba(255,140,0,0.6))'}}>☕</div>
        <div className="w-full px-6">
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
      <section className="py-12 bg-gradient-to-br from-purple-600 to-pink-600 text-white relative">
        <div className="absolute top-8 left-8 text-3xl opacity-40 animate-bounce hidden lg:block" style={{animationDelay: '1.5s', filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>💡</div>
        <div className="absolute top-8 right-8 text-3xl opacity-40 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>✨</div>
        <div className="w-full max-w-none text-center px-8 sm:px-12 lg:px-16">
          <h2 className="text-5xl md:text-7xl font-bold mb-4">
            🎨✨ Challenge Our Creators!! ✨🎨
          </h2>
          <div className="text-2xl md:text-3xl mb-6 space-y-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 text-2xl md:text-3xl font-bold w-full max-w-5xl mx-auto mt-4">
              <div className="text-center flex-1">
                <div className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  <div className="text-2xl md:text-3xl">See If Our</div>
                  <div className="text-2xl md:text-3xl">Creators Can</div>
                </div>
              </div>
              <div className="text-center flex-none">
                <div className="text-4xl md:text-5xl flex items-end justify-center gap-1">
                  <span style={{transform: 'translateY(8px)'}}>🧢</span>
                  <span>👕</span>
                </div>
              </div>
              <div className="text-center flex-1">
                <div className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  <div className="text-2xl md:text-3xl">Make Your Ideas</div>
                  <div className="text-2xl md:text-3xl">Come To Life</div>
                </div>
              </div>
            </div>
            <p className="text-lg md:text-xl font-semibold">Just Click Below To Get Started:</p>
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
      <section className="py-4 bg-white relative">
        <div className="absolute top-5 left-8 text-2xl opacity-40 animate-spin hidden lg:block" style={{animationDuration: '4s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>🎨</div>
        <div className="absolute top-5 right-8 text-2xl opacity-40 animate-bounce hidden lg:block" style={{animationDelay: '0.8s', filter: 'drop-shadow(2px 2px 4px rgba(255,140,0,0.6))'}}>☕</div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              How It Works
            </h2>
            <p className="text-lg text-gray-800 font-semibold max-w-xl mx-auto px-4 drop-shadow-sm">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[200px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-base font-bold mx-auto mb-2">
                1
              </div>
              <div className="text-3xl mb-1">🎨</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Design</h3>
              <p className="text-gray-900 font-semibold mb-2 text-sm leading-relaxed">
                Use our intuitive design tools to create amazing products. Upload your own images or use our templates.
              </p>
              <ul className="text-sm text-gray-500 space-y-0 mt-1">
                <li>• Drag-and-drop editor</li>
                <li>• 1000+ templates</li>
                <li>• Custom fonts & graphics</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[200px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-base font-bold mx-auto mb-2">
                2
              </div>
              <div className="text-3xl mb-1">💰</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Sell</h3>
              <p className="text-gray-900 font-semibold mb-2 text-sm leading-relaxed">
                List your products for sale or share them directly with customers. Set your own prices and profit margins.
              </p>
              <ul className="text-sm text-gray-500 space-y-0 mt-1">
                <li>• Set your own prices</li>
                <li>• Direct customer sharing</li>
                <li>• Profit margin control</li>
              </ul>
            </div>

            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 min-h-[200px] flex flex-col justify-start">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-base font-bold mx-auto mb-2">
                3
              </div>
              <div className="text-3xl mb-1">🚀</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Fulfill</h3>
              <p className="text-gray-900 font-semibold mb-2 text-sm leading-relaxed">
                We handle printing, packaging, and shipping. You get paid, and your customers get premium products.
              </p>
              <ul className="text-sm text-gray-500 space-y-0 mt-1">
                <li>• Print on demand</li>
                <li>• Fast worldwide shipping</li>
                <li>• Quality guaranteed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary-600 to-purple-600 text-white relative">
        <div className="absolute top-8 left-8 text-3xl opacity-30 animate-spin hidden lg:block" style={{animationDuration: '6s', filter: 'drop-shadow(2px 2px 4px rgba(255,255,255,0.8))'}}>🎨</div>
        <div className="absolute top-8 right-8 text-3xl opacity-30 animate-bounce hidden lg:block" style={{animationDelay: '2s', filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9))'}}>☕</div>
        <div className="max-w-5xl mx-auto text-center px-6">
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
                to="/studio"
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

      {/* Icon Attributions Footer */}
      <IconAttributions />
      </main>

      {/* Floating Share Widget */}
      <ShareWidget
        position="bottom-right"
        showOnScroll={true}
        customShareData={{
          title: "Whitney's Creations - Custom Print-on-Demand",
          description: "Create and sell custom designs on premium apparel with PrintCraft"
        }}
        hideOnPaths={['/login', '/reg', '/admin']}
      />
    </div>
  );
}

export default App;