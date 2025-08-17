import React from 'react';

// Example dark theme page component to demonstrate styling options
const DarkPageExample = ({ children, variant = 'default' }) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
          minHeight: '100vh'
        };
      case 'mesh':
        return {
          background: `
            radial-gradient(at 40% 20%, hsla(228, 100%, 74%, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 0.1) 0px, transparent 50%),
            radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 0.1) 0px, transparent 50%),
            radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 0.1) 0px, transparent 50%),
            #0f172a
          `,
          minHeight: '100vh'
        };
      case 'dots':
        return {
          backgroundColor: '#0f172a',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
          minHeight: '100vh'
        };
      case 'lines':
        return {
          backgroundColor: '#0f172a',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          minHeight: '100vh'
        };
      default:
        return {
          backgroundColor: '#0f172a',
          minHeight: '100vh'
        };
    }
  };

  return (
    <div style={getBackgroundStyle()}>
      {children}
    </div>
  );
};

// Example card component with dark theme
export const DarkCard = ({ children, className = '', variant = 'default' }) => {
  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px'
        };
      case 'neon':
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)'
        };
      case 'gradient':
        return {
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          borderRadius: '16px'
        };
      default:
        return {
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(75, 85, 99, 0.3)',
          borderRadius: '16px'
        };
    }
  };

  return (
    <div 
      className={`p-6 ${className}`}
      style={getCardStyle()}
    >
      {children}
    </div>
  );
};

// Example button component with dark theme
export const DarkButton = ({ children, variant = 'primary', ...props }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.6)',
          color: 'white',
          borderRadius: '12px',
          padding: '8px 16px',
          backdropFilter: 'blur(8px)'
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          color: '#e5e7eb',
          borderRadius: '12px',
          padding: '8px 16px',
          backdropFilter: 'blur(8px)'
        };
      case 'neon':
        return {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(34, 197, 94, 0.6)',
          color: '#22d3ee',
          borderRadius: '12px',
          padding: '8px 16px',
          boxShadow: '0 0 15px rgba(34, 197, 94, 0.3)'
        };
      default:
        return {
          backgroundColor: 'rgba(75, 85, 99, 0.6)',
          border: '1px solid rgba(75, 85, 99, 0.4)',
          color: '#f3f4f6',
          borderRadius: '12px',
          padding: '8px 16px'
        };
    }
  };

  return (
    <button 
      {...props}
      style={getButtonStyle()}
      className="transition-all duration-200 hover:opacity-80"
    >
      {children}
    </button>
  );
};

export default DarkPageExample;