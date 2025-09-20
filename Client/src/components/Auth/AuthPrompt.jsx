import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useGuest } from '../../contexts/GuestContext';
import './AuthPrompt.css';

const AuthPrompt = ({ 
  message = "Sign in to access more features", 
  redirectPath = null,
  allowGuest = true,
  onClose = null 
}) => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();
  const [showGuestInfo, setShowGuestInfo] = useState(false);

  const handleGuestContinue = () => {
    continueAsGuest();
    if (redirectPath) {
      navigate(redirectPath);
    } else if (onClose) {
      onClose();
    }
  };

  const handleSignIn = () => {
    navigate('/login', { state: { redirectTo: redirectPath } });
  };

  const handleSignUp = () => {
    navigate('/reg', { state: { redirectTo: redirectPath } });
  };

  return (
    <div className="auth-prompt-overlay">
      <div className="auth-prompt-modal">
        <div className="auth-prompt-header">
          <h2>🔐 Authentication</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          )}
        </div>

        <div className="auth-prompt-content">
          <p className="auth-message">{message}</p>

          <div className="auth-benefits">
            <h3>✨ Benefits of signing in:</h3>
            <div className="benefits-grid">
              <div className="benefit-item">
                <span className="benefit-icon">💾</span>
                <div>
                  <strong>Save Your Work</strong>
                  <p>Keep your designs and projects safe</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📈</span>
                <div>
                  <strong>Order History</strong>
                  <p>Track orders and reorder easily</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎨</span>
                <div>
                  <strong>Advanced Tools</strong>
                  <p>Access premium design features</p>
                </div>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <div>
                  <strong>Faster Checkout</strong>
                  <p>Save addresses and payment info</p>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-actions">
            <div className="primary-actions">
              <button 
                className="btn-primary signin-btn"
                onClick={handleSignIn}
              >
                Sign In
              </button>
              <button 
                className="btn-secondary signup-btn"
                onClick={handleSignUp}
              >
                Create Account
              </button>
            </div>

            {allowGuest && (
              <div className="guest-section">
                <div className="divider">
                  <span>or</span>
                </div>
                
                <button 
                  className="btn-guest"
                  onClick={handleGuestContinue}
                >
                  Continue as Guest
                </button>

                <button 
                  className="guest-info-toggle"
                  onClick={() => setShowGuestInfo(!showGuestInfo)}
                >
                  {showGuestInfo ? 'Hide' : 'Learn more'} about guest mode
                </button>

                {showGuestInfo && (
                  <div className="guest-info">
                    <div className="guest-info-content">
                      <h4>👤 Guest Mode</h4>
                      <div className="guest-features">
                        <div className="feature-group">
                          <h5>✅ You can:</h5>
                          <ul>
                            <li>Browse and customize products</li>
                            <li>Add items to cart</li>
                            <li>Complete purchases</li>
                            <li>Download your designs</li>
                          </ul>
                        </div>
                        <div className="feature-group">
                          <h5>❌ You can't:</h5>
                          <ul>
                            <li>Save projects for later</li>
                            <li>View order history</li>
                            <li>Access premium features</li>
                            <li>Reorder previous items</li>
                          </ul>
                        </div>
                      </div>
                      <p className="guest-note">
                        💡 <strong>Tip:</strong> You can always create an account later to save your work!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="auth-link">Sign in here</Link>
            </p>
            <p>
              New user? <Link to="/reg" className="auth-link">Create your account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactAuthPrompt = ({ 
  message = "Sign in for more features",
  allowGuest = true,
  onAction = null 
}) => {
  const { continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleAction = (action, path = null) => {
    if (action === 'guest') {
      continueAsGuest();
    } else if (path) {
      navigate(path);
    }
    
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <div className="compact-auth-prompt">
      <div className="compact-message">
        <span className="message-icon">🔒</span>
        <span className="message-text">{message}</span>
      </div>
      <div className="compact-actions">
        <button 
          className="compact-btn signin"
          onClick={() => handleAction('signin', '/login')}
        >
          Sign In
        </button>
        <button 
          className="compact-btn signup"
          onClick={() => handleAction('signup', '/reg')}
        >
          Sign Up
        </button>
        {allowGuest && (
          <button 
            className="compact-btn guest"
            onClick={() => handleAction('guest')}
          >
            Continue as Guest
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthPrompt;