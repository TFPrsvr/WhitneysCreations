import React from 'react';
import axios from 'axios';

const SuggestionCard = ({ suggestion, onEdit, onDelete }) => {
  const handleDelete = () => {
    const suggestionId = suggestion._id;
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found. Cannot delete suggestion');
      return;
    }
    
    axios({
      method: 'delete',
      url: `http://localhost:3002/api/delete/suggestions/${suggestionId}`,
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      onDelete(suggestionId);
    })
    .catch(error => {
      console.error('Error deleting suggestion:', error);
    });
  };

  return (
    <div className="suggestion-card">
      <div id='cardT&D'>
        <h5>Title:</h5>
        <h3>{suggestion.title}</h3>
        
        <h5>Description:</h5>
        <p>{suggestion.description}</p>
      </div>
      
      <div className='cardBtns-wrapper'>
        <button className='cardBtns' onClick={() => onEdit(suggestion)}>Edit</button>
        <button className='cardBtns' onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default SuggestionCard;
