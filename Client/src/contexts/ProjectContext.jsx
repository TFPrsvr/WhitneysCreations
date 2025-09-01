import { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

const projectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROJECTS':
      return { 
        ...state, 
        projects: action.payload, 
        loading: false, 
        error: null 
      };
    
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        loading: false,
        error: null
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [action.payload, ...state.projects],
        currentProject: action.payload,
        error: null
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p._id === action.payload._id ? action.payload : p
        ),
        currentProject: state.currentProject?._id === action.payload._id 
          ? action.payload 
          : state.currentProject,
        error: null
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p._id !== action.payload),
        currentProject: state.currentProject?._id === action.payload 
          ? null 
          : state.currentProject,
        error: null
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
        loading: false,
        error: null
      };
    
    case 'SET_TEMPLATES':
      return {
        ...state,
        templates: action.payload,
        loading: false,
        error: null
      };
    
    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload,
        loading: false,
        error: null
      };
    
    case 'CLEAR_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  projects: [],
  currentProject: null,
  searchResults: [],
  templates: [],
  stats: null,
  loading: false,
  error: null
};

export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { isAuthenticated } = useAuth();

  const API_BASE = 'http://localhost:3002/api';

  const apiCall = async (endpoint, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      };

      const response = await axios({
        url: `${API_BASE}${endpoint}`,
        headers,
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

  // Get all user projects
  const fetchUserProjects = async (filters = {}) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiCall(`/projects?${params}`);
      dispatch({ type: 'SET_PROJECTS', payload: data.projects });
      return data;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Get project by ID
  const fetchProjectById = async (projectId) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/projects/${projectId}`);
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: data.project });
      return data.project;
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  // Create new project
  const createProject = async (projectData) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall('/projects', {
        method: 'POST',
        data: projectData
      });
      dispatch({ type: 'ADD_PROJECT', payload: data.project });
      return data.project;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  };

  // Update project
  const updateProject = async (projectId, updates) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/projects/${projectId}`, {
        method: 'PUT',
        data: updates
      });
      dispatch({ type: 'UPDATE_PROJECT', payload: data.project });
      return data.project;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await apiCall(`/projects/${projectId}`, {
        method: 'DELETE'
      });
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  // Duplicate project
  const duplicateProject = async (projectId, newName) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall(`/projects/${projectId}/duplicate`, {
        method: 'POST',
        data: { name: newName }
      });
      dispatch({ type: 'ADD_PROJECT', payload: data.project });
      return data.project;
    } catch (error) {
      console.error('Error duplicating project:', error);
      throw error;
    }
  };

  // Search projects
  const searchProjects = async (query, filters = {}) => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams({ q: query, ...filters }).toString();
      const data = await apiCall(`/projects/search?${params}`);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: data.projects });
      return data;
    } catch (error) {
      console.error('Error searching projects:', error);
    }
  };

  // Get public templates
  const fetchTemplates = async (filters = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const params = new URLSearchParams(filters).toString();
      const data = await apiCall(`/templates?${params}`);
      dispatch({ type: 'SET_TEMPLATES', payload: data.templates });
      return data.templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Get project statistics
  const fetchProjectStats = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await apiCall('/projects/stats');
      dispatch({ type: 'SET_STATS', payload: data });
      return data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
    }
  };

  // Create project version
  const createVersion = async (projectId, note) => {
    if (!isAuthenticated) return;
    
    try {
      const data = await apiCall(`/projects/${projectId}/versions`, {
        method: 'POST',
        data: { note }
      });
      
      // Update current project if it's the active one
      if (state.currentProject?._id === projectId) {
        const updatedProject = { ...state.currentProject };
        updatedProject.versions = [...(updatedProject.versions || []), data.version];
        updatedProject.currentVersion = data.currentVersion;
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: updatedProject });
      }
      
      return data;
    } catch (error) {
      console.error('Error creating version:', error);
      throw error;
    }
  };

  // Restore project version
  const restoreVersion = async (projectId, versionNumber) => {
    if (!isAuthenticated) return;
    
    try {
      const data = await apiCall(`/projects/${projectId}/versions/${versionNumber}/restore`, {
        method: 'PUT'
      });
      
      // Update current project
      if (state.currentProject?._id === projectId) {
        const updatedProject = {
          ...state.currentProject,
          elements: data.project.elements,
          currentVersion: data.project.currentVersion
        };
        dispatch({ type: 'SET_CURRENT_PROJECT', payload: updatedProject });
      }
      
      return data;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    }
  };

  // Clear current project
  const clearCurrentProject = () => {
    dispatch({ type: 'CLEAR_CURRENT_PROJECT' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue = {
    ...state,
    fetchUserProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    searchProjects,
    fetchTemplates,
    fetchProjectStats,
    createVersion,
    restoreVersion,
    clearCurrentProject,
    clearError
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};