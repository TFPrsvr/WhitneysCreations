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
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/create', label: 'Create', icon: '🎨' },
    { path: '/studio', label: 'Design Studio', icon: '🎭' },
    ...(isAuthenticated ? [
      { path: '/projects', label: 'My Projects', icon: '📁', badge: stats?.stats?.totalProjects || 0 },
      { path: '/suggest', label: 'Suggestions', icon: '💡' }
    ] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [
      { path: '/admin', label: 'Admin', icon: '⚙️' }
    ] : []),
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <>
      {/* Vertical Navigation List - Top Left Corner */}
      <nav 
        className="nav-vertical-left fixed z-[60] w-64"
        style={{
          position: 'fixed',
          top: '0px',
          left: '0px',
          margin: '0px',
          padding: '0px',
          transform: 'none',
          inset: '0px auto auto 0px',
          borderRadius: '0 25px 25px 0'
        }}
      >
        <div 
          className="flex flex-col shadow-lg"
          style={{
            backgroundColor: 'rgba(173, 216, 230, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(75, 85, 99, 0.3)',
            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
            margin: 0,
            padding: 0
          }}
        >
          {/* Logo Header */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-white hover:text-cyan-400 transition-colors p-4 border-b border-gray-600"
            style={{ 
              textDecoration: 'none',
              fontSize: '1.5rem',
              fontWeight: '800',
              letterSpacing: '0.05em'
            }}
          >
            <span className="text-3xl animate-pulse">🎨</span>
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
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-4 text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg rounded-lg'
                    : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 hover:shadow-md rounded-lg'
                }`}
                style={{
                  textShadow: isActive(link.path) 
                    ? '0 0 8px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(0, 0, 0, 0.8)' 
                    : '0 1px 2px rgba(0, 0, 0, 0.8)',
                  transform: isActive(link.path) ? 'translateX(4px)' : 'none',
                  fontWeight: '700',
                  fontSize: '28px',
                  margin: '2px 0'
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{link.icon}</span>
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] flex items-center justify-center">
                    {link.badge > 99 ? '99+' : link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="border-t border-gray-600 mt-4">
            {isAuthenticated ? (
              <div className="p-3">
                {/* User Info */}
                <div className="flex items-center p-2 mb-4 bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate"
                       style={{ 
                         overflow: 'hidden',
                         whiteSpace: 'nowrap',
                         textOverflow: 'ellipsis',
                         color: '#00ff88',
                         fontSize: '28px',
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
                         fontSize: '22px',
                         textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                       }}>
                      {user?.email ? String(user.email).trim() : ''}
                    </p>
                  </div>
                </div>
                
                {/* Quick Actions - Cart, Profile & Orders in a row */}
                <div className="flex justify-evenly space-x-2 py-3 mb-4">
                  <Link 
                    to="/cart" 
                    className="flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Cart"
                  >
                    <span className="text-5xl" style={{ 
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '4px 8px'
                    }}>🛒</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Profile"
                  >
                    <span className="text-5xl" style={{ 
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '4px 8px'
                    }}>👤</span>
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    className="flex items-center justify-center p-3 hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Orders"
                  >
                    <span className="text-5xl" style={{ 
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '4px 8px'
                    }}>📦</span>
                  </Link>
                </div>
                
                <div className="flex justify-center w-full">
                  <button
                    onClick={handleLogout}
                    className="w-4/5 text-center"
                    style={{
                      display: 'block',
                      padding: '18px 32px',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                      border: 'none',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      margin: '12px auto',
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
                    <span className="text-2xl">🚪</span> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <Link
                    to="/login"
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      textAlign: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#d1d5db',
                      backgroundColor: 'transparent',
                      border: '1px solid #4b5563',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ffffff';
                      e.target.style.backgroundColor = 'rgba(75, 85, 99, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#d1d5db';
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/reg"
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