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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-purple-600 to-pink-500 text-white w-full py-12" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative w-full px-6">
          <div className="text-center">
            <p className="text-xl text-gray-100 mb-4 font-semibold">Let Your Imagination Run Wild</p>
            <h1 id="hero-title" className="text-4xl md:text-5xl font-bold mb-8 leading-tight">Ideas That Come To Life</h1>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-8 left-10 opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))'}} aria-hidden="true">
          <span className="text-4xl">💡</span>
        </div>
        <div className="absolute top-8 right-10 opacity-80 hidden lg:block z-10" style={{filter: 'drop-shadow(3px 3px 6px rgba(255,165,0,0.9)) drop-shadow(0 0 10px rgba(255,140,0,0.7))'}} aria-hidden="true">
          <span className="text-4xl">✨</span>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative" aria-labelledby="suggestions-title">
        <div className="absolute top-8 right-10 opacity-40 animate-spin hidden lg:block" style={{animationDuration: '4s', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>
          <span className="text-4xl">💡</span>
        </div>
        <div className="absolute top-8 left-10 opacity-40 animate-pulse hidden lg:block" style={{filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'}}>
          <span className="text-4xl">✨</span>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-8">

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
          <div className="text-center mb-6">
            <h2 id="suggestions-title" className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Can You Imagine?</h2>
            <p className="text-lg text-gray-800 font-semibold max-w-xl mx-auto px-4 drop-shadow-sm">
              Share your creative ideas and challenge our team to bring them to life
            </p>
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleAddSuggestion}
              className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              style={{
                maxWidth: '16vw',
                minWidth: '200px',
                borderRadius: '12px'
              }}
            >
              ✨ Add a Suggestion ✨
            </button>
          </div>

          {suggestions.length > 0 ? (
            <div className={`grid gap-6 max-w-5xl mx-auto px-4 justify-items-center ${
              suggestions.length === 1 ? 'grid-cols-1' :
              suggestions.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              suggestions.length === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {suggestions.map((suggestion) => (
                <div key={suggestion._id} className="w-full max-w-sm">
                  <SuggestionCard
                    suggestion={suggestion}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-xl text-gray-600 mb-2">No suggestions available.</p>
              <p className="text-lg text-gray-500">Be the first to share your creative ideas!</p>
            </div>
          )}
        </div>
      )}
        </div>
      </section>
    </div>
  );
};

export default Suggestions