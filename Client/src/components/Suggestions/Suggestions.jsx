import React, { useState, useEffect } from 'react';
import './Suggestion.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SuggestionCard from './SuggestionCard';
import SuggestionForm from './SuggestionForm';
import { API_BASE_URL } from '../../config/api';

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
        url: `${API_BASE_URL}/api/suggestions`,
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
    <div className="min-h-screen bg-gray-50 page-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-8">
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 mb-4">Let Your Imagination Run Wild</p>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-8">Ideas That Come To Life</h1>

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">What Can You Imagine?</h2>
          <button
            onClick={handleAddSuggestion}
            className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 mb-8"
          >
            Add a Suggestion
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-gray-600">No suggestions available.</p>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default Suggestions