import React, { useState } from 'react';
import SocialIconRenderer from '../Icons/SocialIconRenderer';
import { getSocialIcon } from '../../config/socialMediaIcons';

const ShareButton = ({
  url = window.location.href,
  title = "Whitney's Creations - Custom Print-on-Demand",
  description = "Create and sell custom designs on premium apparel with PrintCraft by Whitney's Creations",
  image = null,
  design = null,
  compact = false,
  className = ""
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Prepare sharing data
  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description),
    hashtags: encodeURIComponent("PrintOnDemand,CustomDesign,WhitneysCreations,PrintCraft")
  };

  // Social media sharing URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareData.url}&text=${shareData.title}&hashtags=${shareData.hashtags}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}&title=${shareData.title}&summary=${shareData.description}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${shareData.url}&description=${shareData.title}${image ? `&media=${encodeURIComponent(image)}` : ''}`,
    reddit: `https://reddit.com/submit?url=${shareData.url}&title=${shareData.title}`,
    whatsapp: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
    telegram: `https://t.me/share/url?url=${shareData.url}&text=${shareData.title}`,
    email: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
    sms: `sms:?body=${shareData.title}%20${shareData.url}`
  };

  // Handle native sharing if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Add to bookmarks
  const addBookmark = () => {
    if (window.sidebar && window.sidebar.addPanel) {
      // Firefox
      window.sidebar.addPanel(title, url, '');
    } else if (window.external && 'AddFavorite' in window.external) {
      // IE
      window.external.AddFavorite(url, title);
    } else {
      // Modern browsers - show instruction
      alert('Please press Ctrl+D (or Cmd+D on Mac) to bookmark this page');
    }
  };

  // Download page as PDF (using browser print)
  const downloadPDF = () => {
    window.print();
  };

  // Social media platforms with their configurations
  const shareOptions = [
    {
      iconKey: 'facebook',
      url: shareUrls.facebook,
      popular: true
    },
    {
      iconKey: 'twitter',
      url: shareUrls.twitter,
      popular: true
    },
    {
      iconKey: 'linkedin',
      url: shareUrls.linkedin,
      popular: true
    },
    {
      iconKey: 'whatsapp',
      url: shareUrls.whatsapp,
      popular: true
    },
    {
      iconKey: 'pinterest',
      url: shareUrls.pinterest,
      popular: image ? true : false
    },
    {
      iconKey: 'reddit',
      url: shareUrls.reddit,
      popular: false
    },
    {
      iconKey: 'telegram',
      url: shareUrls.telegram,
      popular: false
    }
  ];

  // Direct actions (non-social)
  const directActions = [
    {
      iconKey: 'email',
      action: () => window.open(shareUrls.email)
    },
    {
      iconKey: 'sms',
      action: () => window.open(shareUrls.sms)
    },
    {
      iconKey: copySuccess ? 'link' : 'link',
      action: copyToClipboard,
      customIcon: copySuccess ? '✅' : null,
      customColor: copySuccess ? '#34a853' : null
    },
    {
      iconKey: 'bookmark',
      action: addBookmark
    },
    {
      iconKey: 'download',
      action: downloadPDF
    }
  ];

  if (compact) {
    return (
      <div className={`share-button-compact ${className}`} style={{ position: 'relative' }}>
        <button
          onClick={handleNativeShare}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <SocialIconRenderer iconKey="share" size="1.2rem" />
          Share
        </button>

        {showShareMenu && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
            padding: '12px',
            zIndex: 1000,
            minWidth: '200px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '12px'
            }}>
              {shareOptions.filter(option => option.popular).map((option) => (
                <a
                  key={option.iconKey}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '8px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    color: '#374151',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <SocialIconRenderer iconKey={option.iconKey} size="1.5rem" />
                  </div>
                  <span>{getSocialIcon(option.iconKey).name}</span>
                </a>
              ))}
            </div>

            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {directActions.map((action, index) => (
                <button
                  key={action.iconKey + index}
                  onClick={action.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: action.customColor || '#374151',
                    transition: 'background-color 0.2s',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {action.customIcon ? (
                    <span>{action.customIcon}</span>
                  ) : (
                    <SocialIconRenderer iconKey={action.iconKey} size="1.2rem" />
                  )}
                  <span>{getSocialIcon(action.iconKey).name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`share-button-full ${className}`}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '16px',
          textAlign: 'center'
        }}>
          📤 Share Whitney's Creations
        </h3>

        {/* Popular Social Media */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Popular Platforms
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            {shareOptions.filter(option => option.popular).map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#374151',
                  transition: 'all 0.2s',
                  backgroundColor: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = option.color;
                  e.target.style.backgroundColor = `${option.color}10`;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '6px' }}>{option.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>{option.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Direct Actions */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Direct Actions
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px'
          }}>
            {directActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                style={{
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = action.color;
                  e.target.style.backgroundColor = `${action.color}10`;
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{action.icon}</span>
                <span>{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* More Options */}
        <details style={{ marginTop: '16px' }}>
          <summary style={{
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#6b7280',
            padding: '8px',
            borderRadius: '6px',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            More Sharing Options
          </summary>
          <div style={{
            marginTop: '12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '8px'
          }}>
            {shareOptions.filter(option => !option.popular).map((option) => (
              <a
                key={option.name}
                href={option.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#6b7280',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = option.color;
                  e.target.style.color = option.color;
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                }}
              >
                <span style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{option.icon}</span>
                <span>{option.name}</span>
              </a>
            ))}
          </div>
        </details>

        {copySuccess && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#10b981',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
          }}>
            ✅ Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareButton;