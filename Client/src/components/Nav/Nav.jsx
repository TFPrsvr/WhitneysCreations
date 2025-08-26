import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProject } from '../../contexts/ProjectContext';
// import LanguageSelector from '../LanguageSelector/LanguageSelector';

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { stats } = useProject();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-button')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/create', label: 'Create', icon: '🎨' },
    { path: '/studio', label: 'Design Studio', icon: '🎭' },
    { path: '/fonts', label: 'Fonts', icon: '🔤' },
    ...(isAuthenticated ? [
      { path: '/projects', label: 'My Projects', icon: '📁', badge: stats?.stats?.totalProjects || 0 }
    ] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [
      { path: '/admin', label: 'Admin', icon: '⚙️' }
    ] : []),
    { path: '/pricing', label: 'Pricing', icon: '💰' },
    { path: '/about', label: 'About', icon: 'ℹ️' },
    { path: '/contact', label: 'Contact', icon: '📧' }
  ];

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-40 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
            >
              <span className="text-2xl">🎨</span>
              <span>PrintCraft</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive(link.path)
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center">
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Selector */}
              {/* <LanguageSelector /> */}
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Cart/Projects Quick Access */}
                  <Link 
                    to="/cart" 
                    className="relative text-gray-600 hover:text-gray-900 transition-colors" style={{padding: '0.5rem'}}
                  >
                    <span className="text-xl">🛒</span>
                    {/* Cart badge could go here */}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={toggleProfileDropdown}
                      className="profile-button flex items-center space-x-2 rounded-lg hover:bg-gray-100 transition-colors" style={{padding: '0.5rem'}}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-gray-700 max-w-24 truncate">
                        {user?.username || 'User'}
                      </span>
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="profile-dropdown absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.first} {user?.last}</p>
                          <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                        </div>
                        
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="mr-3">👤</span>
                          Profile Settings
                        </Link>
                        
                        <Link 
                          to="/projects" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="mr-3">📁</span>
                          My Projects
                          {stats?.stats?.totalProjects > 0 && (
                            <span className="ml-auto bg-gray-200 text-gray-800 text-xs rounded-full px-2 py-0.5">
                              {stats.stats.totalProjects}
                            </span>
                          )}
                        </Link>
                        
                        <Link 
                          to="/orders" 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <span className="mr-3">📦</span>
                          Order History
                        </Link>

                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <span className="mr-3">🚪</span>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/reg"
                    className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors" style={{padding: '0.5rem'}}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMobileMenu}></div>
          
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-xl font-bold text-gray-900"
                onClick={toggleMobileMenu}
              >
                <span className="text-2xl">🎨</span>
                <span>PrintCraft</span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100" style={{padding: '0.5rem'}}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="p-4 h-full overflow-y-auto">
              {/* User Info Section */}
              {isAuthenticated && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.first} {user?.last}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Language Selector - Mobile */}
              {/* <div className="mb-6">
                <LanguageSelector className="w-full justify-center" />
              </div> */}

              {/* Navigation Links */}
              <div className="space-y-2 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={toggleMobileMenu}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </div>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[24px] flex items-center justify-center">
                        {link.badge > 99 ? '99+' : link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={toggleMobileMenu}
                      className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <span>👤</span>
                      <span>Profile Settings</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={toggleMobileMenu}
                      className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <span>📦</span>
                      <span>Order History</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={toggleMobileMenu}
                      className="block w-full p-3 text-center text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/reg"
                      onClick={toggleMobileMenu}
                      className="block w-full p-3 text-center bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Nav;