import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import AuthPrompt from './AuthPrompt';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  allowGuest = false, 
  requiredPermission = null,
  fallbackPath = '/login',
  showPrompt = true 
}) => {
  const { isAuthenticated, isGuest, hasPermission, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If route requires authentication
  if (requireAuth) {
    // Not authenticated and not a guest
    if (!isAuthenticated && !isGuest) {
      if (showPrompt) {
        return (
          <AuthPrompt 
            message="Please sign in to access this feature"
            redirectPath={location.pathname}
            allowGuest={allowGuest}
          />
        );
      } else {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
      }
    }

    // Guest access not allowed for this route
    if (isGuest && !allowGuest) {
      if (showPrompt) {
        return (
          <AuthPrompt 
            message="Please create an account or sign in to access this feature"
            redirectPath={location.pathname}
            allowGuest={false}
          />
        );
      } else {
        return <Navigate to={fallbackPath} state={{ from: location }} replace />;
      }
    }

    // Check specific permissions for authenticated users
    if (isAuthenticated && requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="permission-denied">
          <div className="permission-denied-content">
            <h2>🚫 Access Denied</h2>
            <p>You don't have permission to access this feature.</p>
            <p>Contact support if you believe this is an error.</p>
          </div>
        </div>
      );
    }
  }

  // Route is accessible, render children
  return children;
};

// Higher-order component version
export const withProtectedRoute = (
  WrappedComponent, 
  options = {}
) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
};

// Specific route protection components
export const AuthRequiredRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} allowGuest={false} {...props}>
    {children}
  </ProtectedRoute>
);

export const GuestAllowedRoute = ({ children, ...props }) => (
  <ProtectedRoute requireAuth={true} allowGuest={true} {...props}>
    {children}
  </ProtectedRoute>
);

export const AdminOnlyRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    allowGuest={false} 
    requiredPermission="admin" 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

export const PremiumRoute = ({ children, ...props }) => (
  <ProtectedRoute 
    requireAuth={true} 
    allowGuest={false} 
    requiredPermission="advanced_features" 
    {...props}
  >
    {children}
  </ProtectedRoute>
);

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool,
  allowGuest: PropTypes.bool,
  requiredPermission: PropTypes.string,
  fallbackPath: PropTypes.string,
  showPrompt: PropTypes.bool
};

AuthRequiredRoute.propTypes = {
  children: PropTypes.node.isRequired
};

GuestAllowedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

AdminOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired
};

PremiumRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;