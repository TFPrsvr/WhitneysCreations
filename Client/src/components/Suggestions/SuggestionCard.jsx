import React from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/card';
import { Button } from '@/lib/ui/button';

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
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl border border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-2 p-6 text-center h-full flex flex-col">
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-gray-900 mb-3 break-words">{suggestion.title}</h3>
        <p className="text-gray-700 font-medium text-sm leading-snug break-words mb-4">{suggestion.description}</p>
      </div>

      <div className="flex gap-3 justify-center items-center mt-auto">
        <button
          onClick={() => onEdit(suggestion)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
          style={{
            maxWidth: '16vw',
            minWidth: '80px',
            borderRadius: '8px'
          }}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md transform hover:-translate-y-1"
          style={{
            maxWidth: '16vw',
            minWidth: '80px',
            borderRadius: '8px'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
