import React, { useEffect } from 'react';
import "./App.css"
import './styles/accessibility.css';
import { Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { useProject } from './contexts/ProjectContext';
import { accessibility } from './utils/accessibility';
import Footer from './components/Footer/Footer';
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
        <section className="relative bg-gradient-to-r from-purple-600 via-blue-500 to-teal-500 text-white w-full" aria-labelledby="hero-title">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">✨</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">🎯</span>
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative w-full px-8 py-6">
          <div className="text-center max-w-6xl mx-auto">
            <h1 id="hero-title" className="text-xl md:text-3xl font-bold mb-6 leading-tight">
              <span className="block text-xl md:text-3xl mb-4">Whitney's Unique Creations</span>
              <span className="block text-3xl md:text-4xl mb-4" aria-hidden="true">👕 👚</span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-lg md:text-2xl mt-2 font-extrabold">
                The Place That Lets You Customize Your Ideas
              </span>
            </h1>
            <div className="text-lg md:text-xl mb-6 text-gray-100 max-w-5xl mx-auto">
              <p className="text-xl md:text-2xl font-extrabold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Creations You Want</p>
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
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-6">
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
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    aria-label={`View my projects (${stats?.stats?.totalProjects || 0} projects)`}
                  >
                    <span aria-hidden="true">📁</span> My Projects ({stats?.stats?.totalProjects || 0})
                  </Link>
                  <Link
                    to="/gallery"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Whitney's Creations
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/reg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/products"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Browse Products
                  </Link>
                  <Link
                    to="/gallery"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                  >
                    Whitney's Creations
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
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))', animation: 'float 4s ease-in-out infinite'}} aria-hidden="true">
          <span className="text-2xl">🎨</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))', animation: 'float 3s ease-in-out infinite reverse'}} aria-hidden="true">
          <span className="text-2xl">☕</span>
        </div>
      </section>

        {/* Features Section */}
        <section className="py-8 bg-gradient-to-l from-pink-500 via-red-500 to-orange-500 text-white relative" aria-labelledby="features-title">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">⚡</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">🚀</span>
        </div>
        <div className="w-full px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 id="features-title" className="text-2xl md:text-3xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-white font-bold max-w-xl mx-auto drop-shadow-md mb-2" style={{color: '#ffffff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}>
              From design to delivery, we've got you covered with professional tools and services.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-4 max-w-6xl mx-auto px-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-start">
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h3 className="text-base font-bold text-gray-900 mb-3 break-words">{feature.title}</h3>
                <p className="font-medium leading-snug text-sm break-words mb-3 text-center" style={{color: '#374151'}}>{feature.description}</p>
                <div className="text-xs font-bold space-y-0.5 mt-1" style={{color: '#4b5563'}}>
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
      <section className="py-8 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white relative">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">👕</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">☕</span>
        </div>
        <div className="w-full px-8 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              Premium Products, Perfect Quality
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto mb-2" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
              Choose from our carefully curated selection of high-quality products.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-evenly gap-4 max-w-6xl mx-auto px-4">
            {productShowcase.map((product, index) => (
              <Link key={index} to="/products" className="bg-white rounded-md shadow-lg hover:shadow-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 p-4 text-center flex-1 min-h-[220px] flex flex-col justify-between">
                <div>
                  <div className="mb-3 bg-gradient-to-br from-gray-100 to-gray-200 rounded-md p-4 flex items-center justify-center">
                    <span className="text-4xl">{product.image}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">{product.name}</h3>
                </div>
                <p className="font-bold text-base mt-auto" style={{color: '#1f2937'}}>{product.price}</p>
              </Link>
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
      <section className="py-8 bg-gradient-to-l from-indigo-600 via-purple-600 to-pink-600 text-white relative">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">💡</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">✨</span>
        </div>
        <div className="w-full max-w-6xl mx-auto text-center px-8 flex flex-col justify-between min-h-[350px] py-6">
          <h2 className="text-5xl md:text-7xl font-bold mb-8" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
            🎨✨ Challenge Our Creators!! ✨🎨
          </h2>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 text-2xl md:text-3xl font-bold w-full max-w-5xl mx-auto">
            <div className="text-center flex-1">
              <div className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                <div className="text-2xl md:text-3xl mb-1">See If Our</div>
                <div className="text-2xl md:text-3xl">Creators Can</div>
              </div>
            </div>
            <div className="text-center flex-none">
              <div className="text-4xl md:text-5xl flex items-end justify-center gap-2">
                <span style={{transform: 'translateY(8px)'}}>🧢</span>
                <span>👕</span>
              </div>
            </div>
            <div className="text-center flex-1">
              <div className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                <div className="text-2xl md:text-3xl mb-1">Make Your Ideas</div>
                <div className="text-2xl md:text-3xl">Come To Life</div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-lg md:text-xl font-semibold mb-4">Just Click Below To Get Started:</p>
            <Link
              to="/suggest"
              className="inline-block bg-gradient-to-r from-emerald-400 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              style={{textShadow: '0 1px 2px rgba(0, 100, 100, 0.5)'}}
            >
              ✨ What's Your Creation Idea? ✨
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white relative">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">🔧</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">📝</span>
        </div>
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              How It Works
            </h2>
            <p className="text-lg text-white font-bold max-w-xl mx-auto drop-shadow-md mb-2" style={{color: '#ffffff', textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>
              Get started in just three simple steps
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between gap-4 max-w-6xl mx-auto px-4">
            <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-start">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="text-base font-bold text-gray-900 mb-3 break-words">Design</h3>
              <p className="font-medium leading-snug text-sm break-words mb-3 text-center" style={{color: '#374151'}}>
                Use our intuitive design tools to create amazing products. Upload your own images or use our templates.
              </p>
              <div className="text-xs font-bold space-y-0.5 mt-1" style={{color: '#4b5563'}}>
                <div>• Drag-and-drop editor</div>
                <div>• 1000+ templates</div>
                <div>• Custom fonts & graphics</div>
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-start">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-base font-bold text-gray-900 mb-3 break-words">Sell</h3>
              <p className="font-medium leading-snug text-sm break-words mb-3 text-center" style={{color: '#374151'}}>
                List your products for sale or share them directly with customers. Set your own prices and profit margins.
              </p>
              <div className="text-xs font-bold space-y-0.5 mt-1" style={{color: '#4b5563'}}>
                <div>• Set your own prices</div>
                <div>• Direct customer sharing</div>
                <div>• Profit margin control</div>
              </div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 min-h-[250px] flex flex-col justify-start">
              <div className="text-3xl mb-2">🚀</div>
              <h3 className="text-base font-bold text-gray-900 mb-3 break-words">Fulfill</h3>
              <p className="font-medium leading-snug text-sm break-words mb-3 text-center" style={{color: '#374151'}}>
                We handle printing, packaging, and shipping. You get paid, and your customers get premium products.
              </p>
              <div className="text-xs font-bold space-y-0.5 mt-1" style={{color: '#4b5563'}}>
                <div>• Print on demand</div>
                <div>• Fast worldwide shipping</div>
                <div>• Quality guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-8 bg-gradient-to-l from-rose-500 via-pink-500 to-purple-600 text-white relative">
        <div className="absolute top-8 left-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">🚀</span>
        </div>
        <div className="absolute top-8 right-4 opacity-80 hidden lg:block z-10" style={{animation: 'float 3s ease-in-out infinite'}}>
          <span className="text-2xl">🎆</span>
        </div>
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
                className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                Create New Design
              </Link>
            </div>
          ) : (
            <Link
              to="/reg"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold text-base hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
            >
              Get Started Free Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
      </main>

      {/* Floating Share Widget */}
      <ShareWidget
        position="bottom-right"
        showOnScroll={false}
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