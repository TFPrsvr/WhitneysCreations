import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProject } from '../../contexts/ProjectContext';
import SimpleLanguageSelector from '../LanguageSelector/SimpleLanguageSelector';
import './CleanNav.css';

const CleanNav = () => {
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
    { path: '/', label: 'Home', icon: '🏠', color: 'from-green-600 to-emerald-600' },
    { path: '/products', label: 'Products', icon: '🛍️', color: 'from-blue-600 to-cyan-600' },
    { path: '/studio', label: 'Design Studio', icon: '🎭', color: 'from-orange-600 to-red-600' },
    { path: '/mockup', label: 'Mockup Generator', icon: '📸', color: 'from-rose-600 to-pink-600' },
    { path: '/suggest', label: 'Suggestions', icon: '💡', color: 'from-purple-600 to-violet-600' },
    ...(isAuthenticated ? [
      { path: '/projects', label: 'My Projects', icon: '📁', badge: stats?.stats?.totalProjects || 0, color: 'from-indigo-600 to-violet-600' }
    ] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [
      { path: '/admin', label: 'Admin', icon: '⚙️', color: 'from-slate-600 to-gray-600' }
    ] : []),
    { path: '/about', label: 'About', icon: 'ℹ️', color: 'from-teal-600 to-cyan-600' },
    { path: '/contact', label: 'Contact', icon: '📞', color: 'from-emerald-600 to-teal-600' }
  ];

  return (
    <>
      {/* Vertical Navigation List - Top Left Corner */}
      <nav
        className="nav-vertical-left fixed z-[60] h-screen"
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          margin: '0px',
          padding: '0px',
          transform: 'none',
          inset: '0px auto auto 0px',
          borderRadius: '0 25px 25px 0',
          width: '11rem'
        }}
      >
        <div 
          className="flex flex-col shadow-lg h-full"
          style={{
            backgroundColor: 'rgba(173, 216, 230, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(75, 85, 99, 0.3)',
            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
            margin: 0,
            padding: 0,
            minHeight: '100vh'
          }}
        >
          {/* Logo Header */}
          <Link
            to="/"
            className="flex items-center space-x-3 text-white hover:text-cyan-400 transition-colors p-4 border-b border-gray-400"
            aria-label="Whitney's Creations PrintCraft - Go to homepage"
            style={{
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: '800',
              letterSpacing: '0.05em'
            }}
          >
            <span className="text-3xl animate-pulse" aria-hidden="true">🎨</span>
            <span
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(45deg, #00d4ff, #ff00ff, #ffaa00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              PrintCraft
            </span>
          </Link>

          {/* Navigation Links List */}
          <ul className="flex flex-col space-y-1 flex-1 overflow-y-auto scrollbar-sidebar" role="list">
            {navLinks.map((link) => (
              <li key={link.path} role="none">
                <Link
                  to={link.path}
                  className={`px-4 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                    isActive(link.path)
                      ? `bg-gradient-to-r ${link.color} text-white shadow-lg rounded-lg`
                      : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-md rounded-lg'
                  }`}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  aria-label={`${link.label}${link.badge ? ` (${link.badge} items)` : ''}`}
                  style={{
                    textShadow: isActive(link.path)
                      ? '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                      : '2px 2px 4px rgba(0, 0, 0, 0.9), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    transform: isActive(link.path) ? 'translateX(4px)' : 'none',
                    fontWeight: '800',
                    fontSize: '22px',
                    margin: '2px 0',
                    color: isActive(link.path) ? '#ffffff' : '#e2e8f0',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl" aria-hidden="true">{link.icon}</span>
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span
                      className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center"
                      aria-label={`${link.badge} items`}
                    >
                      {link.badge > 99 ? '99+' : link.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Auth Section */}
          <div className="border-t border-gray-400 mt-2" role="complementary" aria-label="User account section">
            {isAuthenticated ? (
              <div className="p-3">
                {/* User Info */}
                <div className="flex items-center p-2 mb-1 bg-gray-800 rounded-lg" role="region" aria-label="User information">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate"
                       style={{ 
                         overflow: 'hidden',
                         whiteSpace: 'nowrap',
                         textOverflow: 'ellipsis',
                         color: '#00ff88',
                         fontSize: '16px',
                         textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                       }}>
                      {user?.first && user?.last 
                        ? `${String(user.first).charAt(0).toUpperCase()}${String(user.first).slice(1).toLowerCase().replace(/[^a-zA-Z]/g, '')} ${String(user.last).charAt(0).toUpperCase()}${String(user.last).slice(1).toLowerCase().replace(/[^a-zA-Z]/g, '')}`
                        : (user?.username ? String(user.username).replace(/[^a-zA-Z0-9_]/g, '').trim() : 'User')
                      }
                    </p>
                    <p className="font-medium truncate" 
                       style={{ 
                         overflow: 'hidden',
                         whiteSpace: 'nowrap',
                         textOverflow: 'ellipsis',
                         color: '#66d9ff',
                         fontSize: '14px',
                         textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                       }}>
                      {user?.email ? String(user.email).trim() : ''}
                    </p>
                  </div>
                </div>
                
                {/* Quick Actions - Cart, Profile & Orders in a row */}
                <nav className="flex justify-evenly space-x-0 py-1 mb-1" role="navigation" aria-label="Quick actions">
                  <Link
                    to="/cart"
                    className="flex flex-col items-center justify-center p-1 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
                    aria-label="View shopping cart"
                  >
                    <span className="text-3xl mb-1" aria-hidden="true" style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      lineHeight: '1'
                    }}>🛍</span>
                    <span className="text-xs font-bold text-white">Cart</span>
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="flex flex-col items-center justify-center p-1 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
                    aria-label="View user profile"
                  >
                    <span className="text-3xl mb-1" aria-hidden="true" style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      lineHeight: '1'
                    }}>👨‍💼</span>
                    <span className="text-xs font-bold text-white">Profile</span>
                  </Link>
                  
                  <Link
                    to="/orders"
                    className="flex flex-col items-center justify-center p-1 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-105"
                    aria-label="View order history"
                  >
                    <span className="text-3xl mb-1" aria-hidden="true" style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      lineHeight: '1'
                    }}>📋</span>
                    <span className="text-xs font-bold text-white">Orders</span>
                  </Link>
                </nav>
                
                <div className="flex justify-center w-full">
                  <button
                    onClick={handleLogout}
                    className="w-full text-center"
                    aria-label="Sign out of your account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px 24px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                      border: 'none',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      margin: '4px auto',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                      e.target.style.boxShadow = 'none';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    to="/login"
                    aria-label="Sign in to your account"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #3b82f6, #1e40af)',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '0',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #1e40af, #1d4ed8)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #3b82f6, #1e40af)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/reg"
                    aria-label="Create a new account"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginTop: '0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #2563eb, #7c3aed)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #3b82f6, #8b5cf6)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* No spacer needed for side navigation */}
    </>
  );
};

export default CleanNav;