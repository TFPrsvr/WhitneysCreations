import { createContext, useContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { designAPI } from '../utils/api';
import { useAuth } from './AuthContext';

// Design Action Types
const DESIGN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_DESIGNS: 'SET_DESIGNS',
  ADD_DESIGN: 'ADD_DESIGN',
  UPDATE_DESIGN: 'UPDATE_DESIGN',
  DELETE_DESIGN: 'DELETE_DESIGN',
  SET_CURRENT_DESIGN: 'SET_CURRENT_DESIGN',
  SET_TEMPLATES: 'SET_TEMPLATES',
  SET_DESIGN_STATS: 'SET_DESIGN_STATS'
};

// Initial State
const initialState = {
  designs: [],
  currentDesign: null,
  templates: [],
  stats: {
    totalDesigns: 0,
    publicDesigns: 0,
    categories: []
  },
  loading: false,
  error: null
};

// Design Reducer
const designReducer = (state, action) => {
  switch (action.type) {
    case DESIGN_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };
    
    case DESIGN_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case DESIGN_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case DESIGN_ACTIONS.SET_DESIGNS:
      return {
        ...state,
        designs: action.payload,
        loading: false,
        error: null
      };
    
    case DESIGN_ACTIONS.ADD_DESIGN:
      return {
        ...state,
        designs: [action.payload, ...state.designs],
        loading: false,
        error: null
      };
    
    case DESIGN_ACTIONS.UPDATE_DESIGN:
      return {
        ...state,
        designs: state.designs.map(design => 
          design._id === action.payload._id ? action.payload : design
        ),
        currentDesign: state.currentDesign?._id === action.payload._id ? action.payload : state.currentDesign,
        loading: false,
        error: null
      };
    
    case DESIGN_ACTIONS.DELETE_DESIGN:
      return {
        ...state,
        designs: state.designs.filter(design => design._id !== action.payload),
        currentDesign: state.currentDesign?._id === action.payload ? null : state.currentDesign,
        loading: false,
        error: null
      };
    
    case DESIGN_ACTIONS.SET_CURRENT_DESIGN:
      return {
        ...state,
        currentDesign: action.payload
      };
    
    case DESIGN_ACTIONS.SET_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
        loading: false,
        error: null
      };
    
    case DESIGN_ACTIONS.SET_DESIGN_STATS:
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    
    default:
      return state;
  }
};

// Create Context
const DesignContext = createContext();

// Custom Hook
export const useDesign = () => {
  const context = useContext(DesignContext);
  if (!context) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};

// Provider Component
export const DesignProvider = ({ children }) => {
  const [state, dispatch] = useReducer(designReducer, initialState);
  const { isAuthenticated, user } = useAuth();

  // Note: Auth headers are handled by the API interceptor

  // API Functions
  const fetchDesigns = async (options = {}) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const { page = 1, limit = 10, category, sortBy = 'createdAt', sortOrder = 'desc' } = options;
      
      const response = await designAPI.getDesigns({ page, limit, category, sortBy, sortOrder });

      dispatch({ type: DESIGN_ACTIONS.SET_DESIGNS, payload: response.data.designs });
      return response.data;
    } catch (error) {
      console.error('Fetch designs error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to fetch designs' });
      throw error;
    }
  };

  const fetchDesign = async (designId) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const response = await designAPI.getDesign(designId);

      dispatch({ type: DESIGN_ACTIONS.SET_CURRENT_DESIGN, payload: response.data });
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: false });
      return response.data;
    } catch (error) {
      console.error('Fetch design error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to fetch design' });
      throw error;
    }
  };

  const createDesign = async (designData) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const response = await designAPI.createDesign(designData);

      dispatch({ type: DESIGN_ACTIONS.ADD_DESIGN, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Create design error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to create design' });
      throw error;
    }
  };

  const updateDesign = async (designId, designData) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const response = await designAPI.updateDesign(designId, designData);

      dispatch({ type: DESIGN_ACTIONS.UPDATE_DESIGN, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Update design error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to update design' });
      throw error;
    }
  };

  const deleteDesign = async (designId) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      await designAPI.deleteDesign(designId);

      dispatch({ type: DESIGN_ACTIONS.DELETE_DESIGN, payload: designId });
      return true;
    } catch (error) {
      console.error('Delete design error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to delete design' });
      throw error;
    }
  };

  const duplicateDesign = async (designId) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const response = await designAPI.duplicateDesign(designId);

      dispatch({ type: DESIGN_ACTIONS.ADD_DESIGN, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Duplicate design error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to duplicate design' });
      throw error;
    }
  };

  const fetchTemplates = async (options = {}) => {
    try {
      dispatch({ type: DESIGN_ACTIONS.SET_LOADING, payload: true });
      
      const { category, page = 1, limit = 12 } = options;
      
      const response = await designAPI.getTemplates({ category, page, limit });

      dispatch({ type: DESIGN_ACTIONS.SET_TEMPLATES, payload: response.data.templates });
      return response.data;
    } catch (error) {
      console.error('Fetch templates error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to fetch templates' });
      throw error;
    }
  };

  const fetchDesignStats = async () => {
    try {
      const response = await designAPI.getDesignStats();

      dispatch({ type: DESIGN_ACTIONS.SET_DESIGN_STATS, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Fetch design stats error:', error);
      dispatch({ type: DESIGN_ACTIONS.SET_ERROR, payload: error.response?.data?.message || 'Failed to fetch design stats' });
      throw error;
    }
  };

  const setCurrentDesign = (design) => {
    dispatch({ type: DESIGN_ACTIONS.SET_CURRENT_DESIGN, payload: design });
  };

  const clearError = () => {
    dispatch({ type: DESIGN_ACTIONS.CLEAR_ERROR });
  };

  // Load designs when user authenticates
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchDesigns().catch(console.error);
      fetchDesignStats().catch(console.error);
    }
  }, [isAuthenticated, user?.id]);

  // Load templates on mount (public data)
  useEffect(() => {
    fetchTemplates().catch(console.error);
  }, []);

  const value = {
    // State
    designs: state.designs,
    currentDesign: state.currentDesign,
    templates: state.templates,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchDesigns,
    fetchDesign,
    createDesign,
    updateDesign,
    deleteDesign,
    duplicateDesign,
    fetchTemplates,
    fetchDesignStats,
    setCurrentDesign,
    clearError
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};

DesignProvider.propTypes = {
  children: PropTypes.node.isRequired
};