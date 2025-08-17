import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const DebugInfo = () => {
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '5px',
      maxWidth: '300px'
    }}>
      <h4>Debug Info:</h4>
      <div>Current Path: {location.pathname}</div>
      <div>Auth Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user ? `${user.first} ${user.last}` : 'None'}</div>
      <div>User Role: {user?.role || 'None'}</div>
      <div>Tailwind Test: <span style={{color: 'red'}}>Should be red</span></div>
    </div>
  );
};

export default DebugInfo;