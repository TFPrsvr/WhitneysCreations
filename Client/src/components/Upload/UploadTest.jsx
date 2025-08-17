import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import './UploadTest.css';

const UploadTest = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleUploadSuccess = (fileData) => {
    setUploadedImages(prev => [...prev, fileData]);
    setMessage('Image uploaded successfully!');
    setMessageType('success');
    
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleUploadError = (errorMessage) => {
    setMessage(errorMessage);
    setMessageType('error');
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleDeleteImage = async (filename) => {
    try {
      const response = await fetch(`http://localhost:3002/api/upload/image/${filename}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedImages(prev => prev.filter(img => img.filename !== filename));
        setMessage('Image deleted successfully!');
        setMessageType('success');
        
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 3000);
      } else {
        throw new Error('Failed to delete image');
      }
    } catch (error) {
      setMessage('Failed to delete image. Please try again.');
      setMessageType('error');
      
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className="upload-test-container">
      <h1>Image Upload Test</h1>
      <p>Test the file upload functionality for the print-on-demand service.</p>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="upload-section">
        <h2>Upload New Image</h2>
        <ImageUpload 
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />
      </div>

      {uploadedImages.length > 0 && (
        <div className="uploaded-images-section">
          <h2>Uploaded Images ({uploadedImages.length})</h2>
          <div className="images-grid">
            {uploadedImages.map((image, index) => (
              <div key={index} className="image-card">
                <div className="image-container">
                  <img 
                    src={`http://localhost:3002${image.thumbnailUrl}`} 
                    alt={image.originalName}
                    className="uploaded-image"
                  />
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteImage(image.filename)}
                    title="Delete image"
                  >
                    🗑️
                  </button>
                </div>
                <div className="image-details">
                  <p className="image-name" title={image.originalName}>
                    {image.originalName}
                  </p>
                  <p className="image-size">
                    {(image.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="upload-time">
                    {new Date(image.uploadedAt).toLocaleString()}
                  </p>
                  <div className="image-actions">
                    <a 
                      href={`http://localhost:3002${image.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-btn"
                    >
                      View Full Size
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploadedImages.length === 0 && (
        <div className="no-images">
          <p>No images uploaded yet. Use the upload area above to get started!</p>
        </div>
      )}
    </div>
  );
};

export default UploadTest;