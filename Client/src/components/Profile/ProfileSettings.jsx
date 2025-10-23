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
    confirmPassword: '',
    phoneNumber: '',
    bio: '',
    location: '',
    website: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    orderUpdates: true,
    marketingEmails: false,
    newsletterSubscription: false,
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
    currency: 'USD'
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
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
        confirmPassword: '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      });

      // Load preferences from user profile or localStorage
      const savedPrefs = localStorage.getItem('userPreferences');
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }

      const savedPrivacy = localStorage.getItem('userPrivacy');
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy));
      }
    }
  }, [user]);

  const handlePreferenceChange = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    setMessage('Preferences saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePrivacyChange = (key, value) => {
    const newPrivacy = { ...privacy, [key]: value };
    setPrivacy(newPrivacy);
    localStorage.setItem('userPrivacy', JSON.stringify(newPrivacy));
    setMessage('Privacy settings saved successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

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
    <div className="min-h-screen bg-gray-50 py-8 page-container">
      <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 drop-shadow-sm">Profile Settings</h1>

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
          <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Profile Information</h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">First Name</label>
                <input
                  type="text"
                  name="first"
                  value={formData.first}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Last Name</label>
                <input
                  type="text"
                  name="last"
                  value={formData.last}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900" style={{color: '#1f2937'}}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>

      {/* Additional Profile Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Additional Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, Country"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://yourwebsite.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive email notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-600">Get notified about your order status</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.orderUpdates}
                onChange={(e) => handlePreferenceChange('orderUpdates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-600">Receive promotional and marketing content</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.marketingEmails}
                onChange={(e) => handlePreferenceChange('marketingEmails', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Newsletter Subscription</p>
              <p className="text-sm text-gray-600">Stay updated with our latest news and tips</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newsletterSubscription}
                onChange={(e) => handlePreferenceChange('newsletterSubscription', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Display & Regional Settings</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Currency</label>
            <select
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Australia/Sydney">Sydney (AEST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Privacy Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
              style={{color: '#1f2937'}}
            >
              <option value="public">Public - Anyone can see my profile</option>
              <option value="private">Private - Only I can see my profile</option>
              <option value="friends">Friends Only - Only my connections</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Show Email Address</p>
              <p className="text-sm text-gray-600">Display your email on your public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Show Phone Number</p>
              <p className="text-sm text-gray-600">Display your phone number on your public profile</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.showPhone}
                onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Allow Direct Messages</p>
              <p className="text-sm text-gray-600">Let other users send you direct messages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowMessages}
                onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 drop-shadow-sm">Account Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Account Role</label>
            <p className="text-lg font-semibold text-primary-600 capitalize">{user?.role || 'User'}</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Member Since</label>
            <p className="text-lg font-semibold text-gray-900 drop-shadow-sm">
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