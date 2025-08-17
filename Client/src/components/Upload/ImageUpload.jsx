import React, { useState, useRef } from 'react';
import axios from 'axios';
import './ImageUpload.css';

const ImageUpload = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      if (onUploadError) {
        onUploadError('Invalid file type. Please select a JPEG, PNG, GIF, or WebP image.');
      }
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      if (onUploadError) {
        onUploadError('File size too large. Please select an image under 10MB.');
      }
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      if (onUploadError) {
        onUploadError('Please select a file first.');
      }
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('http://localhost:3002/api/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload successful:', response.data);
      
      if (onUploadSuccess) {
        onUploadSuccess(response.data.file);
      }

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.message || 'Upload failed. Please try again.';
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${selectedFile ? 'has-file' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={!selectedFile ? handleBrowseClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!selectedFile ? (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p className="upload-text">
              <strong>Drop your image here</strong> or <span className="browse-link">browse</span>
            </p>
            <p className="upload-hint">
              Supports: JPEG, PNG, GIF, WebP (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="file-preview">
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            )}
            <div className="file-info">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              className="remove-file-btn"
              onClick={handleRemoveFile}
              disabled={uploading}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-actions">
          <button
            type="button"
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleRemoveFile}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;