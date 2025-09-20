import React, { useState, useEffect } from 'react';
import './Suggestion.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuggestionCard from './SuggestionCard';
import SuggestionForm from './SuggestionForm';

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [editingSuggestion, setEditingSuggestion] = useState(null);
  const [isAddingSuggestion, setIsAddingSuggestion] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const fetchSuggestions = () => {
      const token = localStorage.getItem('token');

      axios({
        method: 'get',
        url: 'http://localhost:3002/api/suggestions',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then(res => {
        if (Array.isArray(res.data.suggestions)) {
          setSuggestions(res.data.suggestions);
        } else {
          console.log('Invalid data format:', res.data);
        }
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        // Don't redirect on error - allow public access
        setSuggestions([]);
      });
    };

    fetchSuggestions();
  }, [nav]);

  const handleEdit = (suggestion) => {
    setEditingSuggestion(suggestion);
  };

  const handleDelete = (suggestionId) => {
    setSuggestions(prevSuggestions => 
      prevSuggestions.filter(s => s._id !== suggestionId)
    );
  };

  const handleSuccess = (updatedSuggestion) => {
    if (!updatedSuggestion || !updatedSuggestion._id) {
      console.error('Updated suggestion or _id is missing:', updatedSuggestion);
      return;
    }
    
    if (editingSuggestion) {
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(suggestion =>
          suggestion._id === updatedSuggestion._id ? updatedSuggestion : suggestion
        )
      );
    } else {
      setSuggestions(prevSuggestions => [...prevSuggestions, updatedSuggestion]);
    }
    setEditingSuggestion(null);
    setIsAddingSuggestion(false);
  };

  const handleCancel = () => {
    setEditingSuggestion(null);
    setIsAddingSuggestion(false);
  };

  const handleAddSuggestion = () => {
    setIsAddingSuggestion(true);
  };

  return (
    <div id='Suggestions'>
      <p>Let Your Imagination Run Wild</p>
      <h1>Ideas That Come To Life</h1>

      {editingSuggestion ? (
        <SuggestionForm
          suggestion={editingSuggestion}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : isAddingSuggestion ? (
        <SuggestionForm
          suggestion={null}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <div className="suggestions-list">
          <h2 id='UrIdeas'>What Can You Imagine?</h2>
          <button onClick={handleAddSuggestion}>Add a Suggestion</button>
          <br />
          <br />
          
          <div className="suggestions-grid">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <SuggestionCard
                  key={suggestion._id}
                  suggestion={suggestion}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <p>No suggestions available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Suggestions