import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

const adminReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_DASHBOARD_STATS':
      return { 
        ...state, 
        dashboardStats: action.payload, 
        loading: false, 
        error: null 
      };
    
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload.users,
        usersPagination: action.payload.pagination,
        loading: false,
        error: null
      };
    
    case 'SET_USER_DETAILS':
      return {
        ...state,
        selectedUser: action.payload,
        loading: false,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        ),
        selectedUser: state.selectedUser?._id === action.payload._id 
          ? action.payload 
          : state.selectedUser,
        error: null
      };
    
    case 'SET_SYSTEM_HEALTH':
      return {
        ...state,
        systemHealth: action.payload,
        loading: false,
        error: null
      };
    
    case 'SET_SYSTEM_LOGS':
      return {
        ...state,
        systemLogs: action.payload,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  dashboardStats: null,
  users: [],
  usersPagination: null,
  selectedUser: null,
  systemHealth: null,
  systemLogs: [],
  loading: false,
  error: null
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const { user } = useAuth();

  const API_BASE = 'http://localhost:8000/api/admin';

  const apiCall = async (endpoint, options = {}) => {
    try {
      const response = await axios({
        url: `${API_BASE}${endpoint}`,
        withCredentials: true,
        ...options
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Check if current user has admin privileges
  const isAdmin = () => {
    return user && (user.role === 'admin' || user.role === 'superadmin');
  };

  const isSuperAdmin = () => {
    return user && user.role === 'superadmin';
  };

  // Get dashboard statistics
  const fetchDashboardStats = async () => {
    if (!isAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall('/dashboard');
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: data.stats });
      return data.stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Get all users with pagination and filtering
  const fetchUsers = async (filters = {}) => {
    if (!isAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiCall(`/users?${params}`);
      dispatch({ type: 'SET_USERS', payload: data });
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Get user details
  const fetchUserDetails = async (userId) => {
    if (!isAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/users/${userId}`);
      dispatch({ type: 'SET_USER_DETAILS', payload: data.user });
      return data.user;
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Update user
  const updateUser = async (userId, updates) => {
    if (!isAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/users/${userId}`, {
        method: 'PUT',
        data: updates
      });
      dispatch({ type: 'UPDATE_USER', payload: data.user });
      return data.user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Impersonate user (superadmin only)
  const impersonateUser = async (userId) => {
    if (!isSuperAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/users/${userId}/impersonate`, {
        method: 'POST'
      });
      
      // Reload the page to use the new token
      window.location.href = '/';
      
      return data;
    } catch (error) {
      console.error('Error impersonating user:', error);
      throw error;
    }
  };

  // Get system health
  const fetchSystemHealth = async () => {
    if (!isAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall('/system/health');
      dispatch({ type: 'SET_SYSTEM_HEALTH', payload: data.health });
      return data.health;
    } catch (error) {
      console.error('Error fetching system health:', error);
    }
  };

  // Get system logs (superadmin only)
  const fetchSystemLogs = async (filters = {}) => {
    if (!isSuperAdmin()) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiCall(`/system/logs?${params}`);
      dispatch({ type: 'SET_SYSTEM_LOGS', payload: data.logs });
      return data.logs;
    } catch (error) {
      console.error('Error fetching system logs:', error);
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue = {
    ...state,
    isAdmin,
    isSuperAdmin,
    fetchDashboardStats,
    fetchUsers,
    fetchUserDetails,
    updateUser,
    impersonateUser,
    fetchSystemHealth,
    fetchSystemLogs,
    clearError
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};