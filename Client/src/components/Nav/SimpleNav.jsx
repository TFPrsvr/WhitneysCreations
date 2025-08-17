import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SimpleNav = () => {
  const location = useLocation();

  return (
    <>
    <nav style={{ 
      backgroundColor: 'white', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
      padding: '1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      height: '64px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        {/* Logo */}
        <Link to="/" style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          textDecoration: 'none', 
          color: '#333' 
        }}>
          🎨 PrintCraft
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/' ? 'bold' : 'normal'
          }}>
            Home
          </Link>
          <Link to="/products" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/products' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/products' ? 'bold' : 'normal'
          }}>
            Products
          </Link>
          <Link to="/create" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/create' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/create' ? 'bold' : 'normal'
          }}>
            Create
          </Link>
          <Link to="/studio" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/studio' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/studio' ? 'bold' : 'normal'
          }}>
            Studio
          </Link>
          <Link to="/fonts" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/fonts' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/fonts' ? 'bold' : 'normal'
          }}>
            Fonts
          </Link>
          <Link to="/pricing" style={{ 
            textDecoration: 'none', 
            color: location.pathname === '/pricing' ? '#007acc' : '#666',
            fontWeight: location.pathname === '/pricing' ? 'bold' : 'normal'
          }}>
            Pricing
          </Link>
          <Link to="/login" style={{ 
            textDecoration: 'none', 
            backgroundColor: '#007acc',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px'
          }}>
            Login
          </Link>
        </div>
      </div>
    </nav>
    {/* Spacer for fixed navbar */}
    <div style={{ height: '64px' }}></div>
    </>
  );
};

export default SimpleNav;