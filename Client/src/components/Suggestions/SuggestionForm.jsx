import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SuggestionForm = ({ suggestion, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: suggestion ? suggestion.title : '',
    description: suggestion ? suggestion.description : '',
  });
  
  const nav = useNavigate();

  const handleData = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found. Cannot submit suggestion');
      nav('/login');
      return;
    }

    const apiUrl = suggestion 
      ? `http://localhost:3002/api/update/suggestions/${suggestion._id}` 
      : 'http://localhost:3002/api/create/suggestion';

    axios({
      method: suggestion ? 'put' : 'post',
      url: apiUrl,
      data: formData,
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    .then((res) => {
      console.log('Suggestion saved:', res.data);
      if (onSuccess) {
        onSuccess(res.data);
      }
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        console.log('Token expired, please login again');
        nav('/login');
      } else {
        console.error('Error saving suggestion:', error);
      }
    });
  };

  return (
    <div id='sugForm'>
      <form onSubmit={handleSubmit}>
        <input
          className='suggestInput'
          type='text'
          placeholder='Title'
          name='title'
          value={formData.title}
          onChange={handleData}
          required
        />
        <br />
        <br />
        <input
          className='suggestInput'
          type='text'
          placeholder='Description'
          name='description'
          value={formData.description}
          onChange={handleData}
          required
        />
        <div className="form-buttons">
          <button type="submit">{suggestion ? 'Update' : 'Submit'} Suggestion</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default SuggestionForm;
