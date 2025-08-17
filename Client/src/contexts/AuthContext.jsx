import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Auth Action Types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_GUEST_MODE: 'SET_GUEST_MODE'
};

// Initial State
const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  loading: false,
  error: null,
  token: localStorage.getItem('token') || null
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isGuest: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isGuest: false,
        loading: false,
        error: action.payload
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isGuest: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isGuest: false
      };

    case AUTH_ACTIONS.SET_GUEST_MODE:
      return {
        ...state,
        isGuest: true,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and get user info
      validateToken(token);
    }
  }, []);

  // Auto-refresh token every 90 minutes (before 2-hour expiration)
  useEffect(() => {
    if (state.isAuthenticated && state.token) {
      const refreshInterval = setInterval(() => {
        refreshToken();
      }, 90 * 60 * 1000); // 90 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.isAuthenticated, state.token]);

  // Validate token with server
  const validateToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:3002/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: response.data.user
        });
      } else {
        // Invalid token, remove it
        localStorage.removeItem('token');
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Refresh token to extend session
  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) return;

      const response = await axios.post('http://localhost:3002/api/user/refresh-token', {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });

      if (response.data.token) {
        const newToken = response.data.token;
        localStorage.setItem('token', newToken);
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user: state.user, token: newToken }
        });
        
        console.log('Token refreshed successfully');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, user will need to login again when current token expires
    }
  };

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await axios.post('http://localhost:3002/api/login', credentials);

      if (response.data.token) {
        const token = response.data.token;
        const user = response.data.user;

        // Store token in localStorage
        localStorage.setItem('token', token);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token }
        });

        return { success: true, user };
      } else {
        throw new Error('No token received');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await axios.post('http://localhost:3002/api/reg', userData);

      if (response.data.user) {
        // Auto-login after successful registration
        const loginResult = await login({
          username: userData.username,
          password: userData.password
        });

        if (loginResult.success) {
          return { success: true, user: loginResult.user };
        } else {
          // Registration successful but login failed
          dispatch({
            type: AUTH_ACTIONS.REGISTER_FAILURE,
            payload: 'Registration successful but login failed. Please login manually.'
          });
          return { success: false, error: 'Please login with your new account.' };
        }
      } else {
        throw new Error('Registration failed');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Continue as guest
  const continueAsGuest = () => {
    dispatch({ type: AUTH_ACTIONS.SET_GUEST_MODE });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Get user role
  const getUserRole = () => {
    return state.user?.role || 'guest';
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.isAuthenticated) return false;
    
    const userRole = getUserRole();
    
    // Admin has all permissions
    if (userRole === 'admin') return true;
    
    // Define role permissions
    const permissions = {
      user: ['view_products', 'create_design', 'save_project', 'place_order'],
      premium: ['view_products', 'create_design', 'save_project', 'place_order', 'advanced_features'],
      admin: ['*'] // All permissions
    };

    return permissions[userRole]?.includes(permission) || permissions[userRole]?.includes('*');
  };

  // Check if feature is available for current user
  const canAccessFeature = (feature) => {
    switch (feature) {
      case 'save_projects':
        return state.isAuthenticated;
      case 'advanced_design_tools':
        return state.isAuthenticated && hasPermission('advanced_features');
      case 'order_history':
        return state.isAuthenticated;
      case 'bulk_orders':
        return state.isAuthenticated && hasPermission('advanced_features');
      default:
        return true; // Public features
    }
  };

  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isGuest: state.isGuest,
    loading: state.loading,
    error: state.error,
    token: state.token,

    // Actions
    login,
    register,
    logout,
    continueAsGuest,
    clearError,

    // Utilities
    getUserRole,
    hasPermission,
    canAccessFeature
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent, requiredPermission = null) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, hasPermission, canAccessFeature } = useAuth();

    if (!isAuthenticated) {
      return (
        <div className="auth-required">
          <h2>Authentication Required</h2>
          <p>Please log in to access this feature.</p>
        </div>
      );
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return (
        <div className="permission-denied">
          <h2>Permission Denied</h2>
          <p>You don't have permission to access this feature.</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
};

export default AuthContext;