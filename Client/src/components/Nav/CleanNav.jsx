import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProject } from '../../contexts/ProjectContext';
import { useUserAvatar } from '../../contexts/UserAvatarContext';
import SimpleLanguageSelector from '../LanguageSelector/SimpleLanguageSelector';
import NounProjectIcon from '../Icons/NounProjectIcon';
import IconRenderer from '../Icons/IconRenderer';
import './CleanNav.css';

const CleanNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { stats } = useProject();
  const { userAvatar } = useUserAvatar();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [isCartDropdownOpen, setIsCartDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Mock cart data - replace with actual cart context later
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Classic White T-Shirt',
      design: 'Sunset Beach Design',
      price: 24.99,
      quantity: 2,
      image: '/images/noun-tshirt-7743963.svg',
      color: 'White'
    },
    {
      id: 2,
      name: 'Black Hoodie',
      design: 'Mountain Logo',
      price: 49.99,
      quantity: 1,
      image: '/images/noun-tshirt-7743963.svg',
      color: 'Black'
    }
  ]);

  const discountCode = 'SAVE10';
  const discountPercentage = 10;
  const shippingCost = 5.99;
  const taxRate = 0.08; // 8% tax

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = (subtotal * discountPercentage) / 100;
  const subtotalAfterDiscount = subtotal - discount;
  const tax = subtotalAfterDiscount * taxRate;
  const total = subtotalAfterDiscount + tax + shippingCost;

  // Update quantity
  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Remove item
  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsAvatarDropdownOpen(false);
    setIsCartDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-button')) {
        setIsProfileDropdownOpen(false);
      }
      if (!event.target.closest('.avatar-dropdown') && !event.target.closest('.avatar-button')) {
        setIsAvatarDropdownOpen(false);
      }
      if (!event.target.closest('.cart-dropdown') && !event.target.closest('.cart-button')) {
        setIsCartDropdownOpen(false);
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
    { path: '/', label: 'Home', iconKey: 'home', color: 'from-green-600 to-emerald-600' },
    { path: '/products', label: 'Products', iconKey: 'products', color: 'from-blue-600 to-cyan-600' },
    { path: '/studio', label: 'Design Studio', iconKey: 'studio', color: 'from-orange-600 to-red-600' },
    { path: '/mockup', label: 'Mockup Generator', iconKey: 'mockup', color: 'from-rose-600 to-pink-600' },
    ...(isAuthenticated ? [
      { path: '/projects', label: 'My Projects', iconKey: 'projects', badge: stats?.stats?.totalProjects || 0, color: 'from-indigo-600 to-violet-600' }
    ] : []),
    ...(user?.role === 'admin' || user?.role === 'superadmin' ? [
      { path: '/admin', label: 'Admin', iconKey: 'admin', color: 'from-slate-600 to-gray-600' }
    ] : [])
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
          width: '10.5rem'
        }}
      >
        <div
          className="flex flex-col shadow-lg h-full"
          style={{
            backgroundColor: '#e5e7eb !important',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(75, 85, 99, 0.3)',
            borderBottom: '1px solid rgba(75, 85, 99, 0.3)',
            margin: 0,
            padding: 0,
            minHeight: '100vh',
            zoom: 0.5,
            MozTransform: 'scale(0.5)',
            MozTransformOrigin: 'top left'
          }}
        >
          {/* Logo Header */}
          <Link
            to="/"
            className="flex items-center justify-between text-white hover:text-cyan-400 transition-colors px-4 py-2 border-b border-gray-400"
            aria-label="Whitney's Creations PrintCraft - Go to homepage"
            style={{
              textDecoration: 'none',
              fontSize: '1.1rem',
              fontWeight: '800',
              letterSpacing: '0.05em',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              boxSizing: 'border-box',
              zoom: 1.5625,
              MozTransform: 'scale(1.5625)',
              MozTransformOrigin: 'top left'
            }}
          >
            <span style={{
              display: 'inline-block',
              background: 'none',
              border: 'none',
              padding: 0,
              margin: 0,
              lineHeight: 0,
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.6))',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              🎨
            </span>
            <span
              style={{
                display: 'inline-block',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                background: 'linear-gradient(45deg, #00d4ff, #ff00ff, #ffaa00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.75rem',
                flex: 1,
                marginLeft: '2px',
                marginRight: '8px',
                marginTop: '3px',
                fontStyle: 'italic'
              }}
            >
              PrintCraft
            </span>
            <div style={{width: '2rem', flexShrink: 0}}></div>
          </Link>

          {/* Navigation Links List */}
          <ul className="flex flex-col space-y-1 flex-1 overflow-y-auto scrollbar-sidebar" role="list" style={{zoom: 1.5625, MozTransform: 'scale(1.5625)', MozTransformOrigin: 'top left'}}>
            {navLinks.map((link) => {
              const isLinkActive = isActive(link.path);
              const isHovered = hoveredLink === link.path;

              return (
                <li key={link.path} role="none">
                  <Link
                    to={link.path}
                    className={`px-4 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-between ${
                      isLinkActive
                        ? 'bg-gradient-to-r from-pink-100 to-pink-200 text-white shadow-sm rounded-lg'
                        : 'text-gray-200 hover:text-white hover:bg-gradient-to-r hover:from-gray-300 hover:to-gray-400 hover:shadow-md rounded-lg'
                    }`}
                    aria-current={isLinkActive ? 'page' : undefined}
                    aria-label={`${link.label}${link.badge ? ` (${link.badge} items)` : ''}`}
                    style={{
                      textShadow: 'none',
                      transform: isLinkActive ? 'translateX(4px)' : 'none',
                      fontWeight: '500',
                      fontSize: '16px',
                      margin: '2px 0',
                      marginRight: isLinkActive ? '4px' : '0',
                      color: '#1e40af',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.outline = 'none'}
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconRenderer
                        iconKey={link.iconKey}
                        size="2rem"
                        forDarkBackground={isHovered && !isLinkActive}
                      />
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
              );
            })}
          </ul>

          {/* Auth Section */}
          <div className="border-t border-gray-400 mt-2" role="complementary" aria-label="User account section">
            {isAuthenticated ? (
              <div className="p-4" style={{maxWidth: '100%', overflow: 'hidden'}}>
                {/* User Info */}
                <div className="flex items-center px-3 py-2 mb-3 bg-gray-800 rounded-lg" role="region" aria-label="User information" style={{maxWidth: '100%', overflow: 'hidden', marginTop: '8px'}}>
                  <div className="flex-1 min-w-0" style={{maxWidth: '100%'}}>
                    <p className="font-bold truncate"
                       style={{
                         overflow: 'hidden',
                         whiteSpace: 'nowrap',
                         textOverflow: 'ellipsis',
                         color: '#00ff88',
                         fontSize: '22px',
                         fontWeight: '700',
                         textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                         maxWidth: '100%'
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
                         fontSize: '20px',
                         fontWeight: '600',
                         textShadow: '0 3px 6px rgba(0, 0, 0, 0.9), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                         maxWidth: '100%'
                       }}>
                      {user?.email ? String(user.email).trim() : ''}
                    </p>
                  </div>
                </div>

                {/* Quick Actions - Cart, Profile & Orders in a row */}
                <nav className="flex justify-evenly space-x-0 py-3 mb-3" role="navigation" aria-label="Quick actions" style={{maxWidth: '100%', overflow: 'hidden'}}>
                  <Link
                    to="/cart"
                    className={`flex flex-col items-center justify-center p-0.5 rounded-lg transition-all duration-200 hover:scale-102 ${
                      location.pathname === '/cart'
                        ? 'bg-gradient-to-r from-pink-300 to-rose-400 scale-102'
                        : ''
                    }`}
                    aria-label="View shopping cart"
                    style={{flex: '1', maxWidth: '33%'}}
                  >
                    <div style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      lineHeight: '1',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '3rem',
                      minHeight: '3rem'
                    }}>
                      <IconRenderer
                        iconKey="cart"
                        size="3rem"
                        forDarkBackground={false}
                      />
                    </div>
                    <span className="text-lg font-bold" style={{
                      color: '#22d3ee',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>Cart</span>
                  </Link>

                  <button
                    onClick={toggleProfileDropdown}
                    className={`profile-button flex flex-col items-center justify-center p-0.5 rounded-lg transition-all duration-200 hover:scale-102 ${
                      isProfileDropdownOpen
                        ? 'bg-gradient-to-r from-pink-300 to-rose-400 scale-102'
                        : ''
                    }`}
                    aria-label="Open settings menu"
                    style={{flex: '1', maxWidth: '33%'}}
                  >
                    <div style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      lineHeight: '1',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '3rem',
                      minHeight: '3rem',
                      opacity: '0.7'
                    }}>
                      <IconRenderer
                        iconKey="settings"
                        size="3rem"
                        forDarkBackground={true}
                      />
                    </div>
                    <span className="text-lg font-bold" style={{
                      color: '#22d3ee',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>Settings</span>
                  </button>

                  <Link
                    to="/orders"
                    className={`flex flex-col items-center justify-center p-0.5 rounded-lg transition-all duration-200 hover:scale-102 ${
                      location.pathname === '/orders'
                        ? 'bg-gradient-to-r from-pink-300 to-rose-400 scale-102'
                        : ''
                    }`}
                    aria-label="View order history"
                    style={{flex: '1', maxWidth: '33%'}}
                  >
                    <div style={{
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '12px 14px',
                      lineHeight: '1',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '3rem',
                      minHeight: '3rem'
                    }}>
                      <IconRenderer
                        iconKey="orders"
                        size="3rem"
                        forDarkBackground={false}
                      />
                    </div>
                    <span className="text-lg font-bold" style={{
                      color: '#22d3ee',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8), -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                    }}>Orders</span>
                  </Link>
                </nav>

                {/* Settings Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown relative mb-4"
                    style={{
                      backgroundColor: 'rgba(31, 41, 55, 0.98)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(75, 85, 99, 0.5)',
                      borderRadius: '12px',
                      padding: '12px',
                      width: '100%',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                    <h3 className="text-sm font-bold mb-3 text-center" style={{
                      color: '#d1d5db',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                    }}>Settings Menu</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          color: '#e5e7eb',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center',
                          background: 'rgba(55, 65, 81, 0.5)',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(156, 163, 175, 0.3)';
                          e.target.style.color = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                          e.target.style.color = '#e5e7eb';
                        }}
                      >
                        Profile Info
                      </Link>
                      <Link
                        to="/avatar-settings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          color: '#e5e7eb',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center',
                          background: 'rgba(55, 65, 81, 0.5)',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(156, 163, 175, 0.3)';
                          e.target.style.color = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                          e.target.style.color = '#e5e7eb';
                        }}
                      >
                        Avatar
                      </Link>
                      <Link
                        to="/settings/notifications"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          color: '#e5e7eb',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center',
                          background: 'rgba(55, 65, 81, 0.5)',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(156, 163, 175, 0.3)';
                          e.target.style.color = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                          e.target.style.color = '#e5e7eb';
                        }}
                      >
                        Notifications
                      </Link>
                      <Link
                        to="/settings/privacy"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        style={{
                          padding: '10px',
                          borderRadius: '6px',
                          color: '#e5e7eb',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center',
                          background: 'rgba(55, 65, 81, 0.5)',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                          textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'rgba(156, 163, 175, 0.3)';
                          e.target.style.color = '#d1d5db';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                          e.target.style.color = '#e5e7eb';
                        }}
                      >
                        Privacy
                      </Link>
                    </div>
                  </div>
                )}

                <div className="flex justify-center w-full" style={{marginTop: '-8px'}}>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center"
                    aria-label="Sign out of your account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '20px 24px',
                      textAlign: 'center',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                      border: 'none',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '0',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                      maxWidth: '100%',
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                      e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2" style={{maxWidth: '100%', overflow: 'hidden'}}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '100%' }}>
                  <Link
                    to="/login"
                    aria-label="Sign in to your account"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #3b82f6, #1e40af)',
                      border: 'none',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginBottom: '0',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                      maxWidth: '100%',
                      boxSizing: 'border-box'
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      padding: '16px 20px',
                      textAlign: 'center',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                      border: 'none',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      marginTop: '0',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
                      maxWidth: '100%',
                      boxSizing: 'border-box'
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

      {/* Cart and Avatar - Top Right Corner */}
      {isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: '15px',
          right: '20px',
          zIndex: 70,
          display: 'flex',
          alignItems: 'center',
          gap: '0px'
        }}>
          {/* Cart Icon Button */}
          <div style={{ position: 'relative', marginTop: '-5px', marginRight: '-8px' }}>
            <button
              onClick={() => setIsCartDropdownOpen(!isCartDropdownOpen)}
              className="cart-button"
              aria-label="View shopping cart"
              style={{
                background: 'transparent',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <IconRenderer
                iconKey="cart"
                size="1.4rem"
                forDarkBackground={false}
                style={{
                  filter: 'invert(0) brightness(0.3) drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))',
                  display: 'block',
                  dropShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              />
              {/* Cart Item Count Badge */}
              {cartItems.length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '8px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}>
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartDropdownOpen && (
              <div className="cart-dropdown"
                style={{
                  position: 'absolute',
                  top: '70px',
                  right: '0',
                  backgroundColor: 'rgba(31, 41, 55, 0.98)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '16px',
                  padding: '20px',
                  minWidth: '380px',
                  maxWidth: '420px',
                  maxHeight: '600px',
                  overflowY: 'auto',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  zIndex: 80
                }}>
                {/* Cart Header */}
                <div style={{
                  borderBottom: '1px solid rgba(75, 85, 99, 0.5)',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    color: '#e5e7eb',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '0',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                  }}>Shopping Cart ({cartItems.length})</h3>
                </div>

                {/* Cart Items */}
                {cartItems.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: '#9ca3af'
                  }}>
                    <p style={{ margin: 0 }}>Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    {/* Items List */}
                    <div style={{ marginBottom: '20px' }}>
                      {cartItems.map((item) => (
                        <div key={item.id} style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '12px',
                          background: 'rgba(55, 65, 81, 0.3)',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          border: '1px solid rgba(75, 85, 99, 0.3)'
                        }}>
                          {/* Thumbnail */}
                          <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '6px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            overflow: 'hidden'
                          }}>
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'contain'
                              }}
                            />
                          </div>

                          {/* Item Details */}
                          <div style={{ flex: 1 }}>
                            <h4 style={{
                              color: '#e5e7eb',
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                              lineHeight: '1.3'
                            }}>{item.name}</h4>
                            <p style={{
                              color: '#9ca3af',
                              fontSize: '12px',
                              margin: '0 0 4px 0'
                            }}>{item.design}</p>
                            <p style={{
                              color: '#d1d5db',
                              fontSize: '11px',
                              margin: '0 0 8px 0'
                            }}>Color: {item.color}</p>

                            {/* Quantity Controls */}
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px'
                            }}>
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                style={{
                                  background: 'rgba(239, 68, 68, 0.8)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: 'white',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >-</button>
                              <span style={{
                                color: '#e5e7eb',
                                fontSize: '14px',
                                fontWeight: '600',
                                minWidth: '30px',
                                textAlign: 'center'
                              }}>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                style={{
                                  background: 'rgba(34, 197, 94, 0.8)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  color: 'white',
                                  width: '24px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >+</button>
                            </div>

                            {/* Price */}
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}>
                              <span style={{
                                color: '#10b981',
                                fontSize: '16px',
                                fontWeight: 'bold'
                              }}>${(item.price * item.quantity).toFixed(2)}</span>
                              <button
                                onClick={() => removeItem(item.id)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#ef4444',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                  textDecoration: 'underline'
                                }}
                              >Remove</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Price Summary */}
                    <div style={{
                      borderTop: '1px solid rgba(75, 85, 99, 0.5)',
                      paddingTop: '16px',
                      marginTop: '16px'
                    }}>
                      {/* Subtotal */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ color: '#d1d5db', fontSize: '14px' }}>Subtotal:</span>
                        <span style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: '600' }}>
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>

                      {/* Discount */}
                      {discount > 0 && (
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <span style={{ color: '#10b981', fontSize: '14px' }}>
                            Discount ({discountCode} - {discountPercentage}%):
                          </span>
                          <span style={{ color: '#10b981', fontSize: '14px', fontWeight: '600' }}>
                            -${discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Tax */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}>
                        <span style={{ color: '#fbbf24', fontSize: '14px' }}>Tax ({(taxRate * 100).toFixed(0)}%):</span>
                        <span style={{ color: '#fbbf24', fontSize: '14px', fontWeight: '600' }}>
                          ${tax.toFixed(2)}
                        </span>
                      </div>

                      {/* Shipping */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '12px'
                      }}>
                        <span style={{ color: '#60a5fa', fontSize: '14px' }}>Shipping:</span>
                        <span style={{ color: '#60a5fa', fontSize: '14px', fontWeight: '600' }}>
                          ${shippingCost.toFixed(2)}
                        </span>
                      </div>

                      {/* Total */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '2px solid rgba(75, 85, 99, 0.5)',
                        marginTop: '8px'
                      }}>
                        <span style={{
                          color: '#e5e7eb',
                          fontSize: '16px',
                          fontWeight: 'bold'
                        }}>Total:</span>
                        <span style={{
                          color: '#10b981',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Link
                      to="/checkout"
                      onClick={() => setIsCartDropdownOpen(false)}
                      style={{
                        display: 'block',
                        marginTop: '16px',
                        padding: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      Proceed to Checkout
                    </Link>

                    {/* View Full Cart */}
                    <Link
                      to="/cart"
                      onClick={() => setIsCartDropdownOpen(false)}
                      style={{
                        display: 'block',
                        marginTop: '8px',
                        padding: '10px',
                        color: '#60a5fa',
                        textAlign: 'center',
                        textDecoration: 'none',
                        fontSize: '13px',
                        transition: 'color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#60a5fa';
                      }}
                    >
                      View Full Cart
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Avatar Icon Button */}
          <button
            onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
            className="avatar-button"
            aria-label="Open avatar menu"
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <NounProjectIcon
              iconPath={userAvatar?.iconPath || "/images/noun-avatar-2309777.svg"}
              iconName={userAvatar?.name || "Avatar"}
              creator={userAvatar?.creator || "Nawicon"}
              size="2rem"
              style={{
                filter: 'invert(0) brightness(0.3) drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))',
                dropShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            />
          </button>

          {/* Avatar Dropdown Menu */}
          {isAvatarDropdownOpen && (
            <div className="avatar-dropdown"
              style={{
                position: 'absolute',
                top: '70px',
                right: '0',
                backgroundColor: 'rgba(31, 41, 55, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                padding: '12px',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  to="/avatar-settings"
                  onClick={() => setIsAvatarDropdownOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'rgba(55, 65, 81, 0.5)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.3)';
                    e.target.style.color = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                    e.target.style.color = '#e5e7eb';
                  }}
                >
                  Customize Avatar
                </Link>
                <Link
                  to="/avatar-settings"
                  onClick={() => setIsAvatarDropdownOpen(false)}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'rgba(55, 65, 81, 0.5)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.3)';
                    e.target.style.color = '#60a5fa';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(55, 65, 81, 0.5)';
                    e.target.style.color = '#e5e7eb';
                  }}
                >
                  Change Skin Tone
                </Link>
                <div style={{ height: '1px', background: 'rgba(75, 85, 99, 0.5)', margin: '4px 0' }} />
                <button
                  onClick={() => {
                    setIsAvatarDropdownOpen(false);
                    handleLogout();
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #b91c1c, #991b1b)';
                    e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(to right, #dc2626, #b91c1c)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No spacer needed for side navigation */}
    </>
  );
};

export default CleanNav;