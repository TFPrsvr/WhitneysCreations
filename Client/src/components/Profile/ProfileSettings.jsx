import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ProfileSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    first: '',
    last: '',
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first: user.first || '',
        last: user.last || '',
        email: user.email || '',
        username: user.username || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3002/api/user/profile', {
        first: formData.first,
        last: formData.last,
        email: formData.email,
        username: formData.username
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3002/api/user/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });

      setMessage('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-4">
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please log in to access your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="header-main text-center">Profile Settings</h1>

      {message && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mb-6">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="header-primary">Profile Information</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first"
                  value={formData.first}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last"
                  value={formData.last}
                  onChange={handleInputChange}
                  className="input-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-action-blue w-full py-3"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="header-primary">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="input-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="btn-action-red w-full py-3"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="header-primary">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
            <p className="text-lg font-semibold text-primary-600 capitalize">{user?.role || 'User'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
            <p className="text-lg text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfileSettings;