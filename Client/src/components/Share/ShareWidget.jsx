import React, { useState, useEffect } from 'react';
import ShareButton from './ShareButton';
import IconRenderer from '../Icons/IconRenderer';

const ShareWidget = ({
  position = 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
  showOnScroll = true,
  customShareData = {},
  hideOnPaths = ['/login', '/reg'], // Paths where widget should be hidden
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(!showOnScroll);
  const [isMinimized, setIsMinimized] = useState(true);

  // Handle scroll-based visibility
  useEffect(() => {
    if (!showOnScroll) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 200; // Show after scrolling 200px
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showOnScroll]);

  // Hide on certain paths
  useEffect(() => {
    const currentPath = window.location.pathname;
    const shouldHide = hideOnPaths.some(path => currentPath.includes(path));
    if (shouldHide) {
      setIsVisible(false);
    }
  }, [hideOnPaths]);

  // Position styles
  const getPositionStyles = () => {
    const baseStyles = {
      position: 'fixed',
      zIndex: 1000,
      transition: 'all 0.3s ease-in-out'
    };

    switch (position) {
      case 'bottom-right':
        return {
          ...baseStyles,
          bottom: isVisible ? '20px' : '-100px',
          right: '20px'
        };
      case 'bottom-left':
        return {
          ...baseStyles,
          bottom: isVisible ? '20px' : '-100px',
          left: '20px'
        };
      case 'top-right':
        return {
          ...baseStyles,
          top: isVisible ? '20px' : '-100px',
          right: '20px'
        };
      case 'top-left':
        return {
          ...baseStyles,
          top: isVisible ? '20px' : '-100px',
          left: '20px'
        };
      default:
        return {
          ...baseStyles,
          bottom: isVisible ? '20px' : '-100px',
          right: '20px'
        };
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`share-widget ${className}`}
      style={getPositionStyles()}
    >
      {isMinimized ? (
        // Minimized floating button
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        }}
        onClick={() => setIsMinimized(false)}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
        }}
        title="Share Whitney's Creations"
        >
          <IconRenderer
            iconKey="share"
            size="1rem"
            style={{
              color: 'white',
              filter: 'brightness(1.2) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}
          />
        </div>
      ) : (
        // Expanded share panel
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          minWidth: '280px',
          maxWidth: '320px'
        }}>
          {/* Header with close button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h4 style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <IconRenderer
                iconKey="share"
                size="1rem"
                style={{ color: '#1f2937' }}
              />
              Share Whitney's
            </h4>
            <button
              onClick={() => setIsMinimized(true)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6b7280';
              }}
              title="Minimize"
            >
              ✕
            </button>
          </div>

          {/* Quick share buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '12px'
          }}>
            {[
              { name: 'Facebook', icon: '📘', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
              { name: 'Twitter', icon: '🐦', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("Check out Whitney's Creations - Custom Print-on-Demand!")}` },
              { name: 'WhatsApp', icon: '💬', url: `https://wa.me/?text=${encodeURIComponent("Check out Whitney's Creations! " + window.location.href)}` },
              { name: 'Copy', icon: '🔗', action: 'copy' }
            ].map((option) => (
              <button
                key={option.name}
                onClick={option.action === 'copy' ? async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href);
                    // Show success feedback
                    const btn = event.target.closest('button');
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span style="font-size: 1rem;">✅</span>';
                    setTimeout(() => {
                      btn.innerHTML = originalText;
                    }, 1500);
                  } catch (error) {
                    console.error('Copy failed:', error);
                  }
                } : () => window.open(option.url, '_blank', 'width=600,height=400')}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.transform = 'translateY(0)';
                }}
                title={`Share on ${option.name}`}
              >
                <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{option.icon}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>

          {/* More options button */}
          <ShareButton
            compact={true}
            {...customShareData}
            className="w-full"
          />

          {/* Quick bookmark button */}
          <button
            onClick={() => {
              if (window.sidebar && window.sidebar.addPanel) {
                window.sidebar.addPanel(document.title, window.location.href, '');
              } else if (window.external && 'AddFavorite' in window.external) {
                window.external.AddFavorite(window.location.href, document.title);
              } else {
                alert('Press Ctrl+D (or Cmd+D on Mac) to bookmark this page!');
              }
            }}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #fbbf24, #f59e0b)',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'linear-gradient(to right, #f59e0b, #d97706)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'linear-gradient(to right, #fbbf24, #f59e0b)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ⭐ Bookmark Site
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          }
          50% {
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          }
          100% {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          }
        }
      `}</style>
    </div>
  );
};

export default ShareWidget;