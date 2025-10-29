import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your update logic here
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-8 page-container">
      <div className="w-full px-8">
        <h1 className="text-xs font-bold text-white mb-1.5 drop-shadow-md">Profile Settings</h1>

        {message.text && (
          <div className={`rounded-lg p-0.5 mb-1 text-[8px] ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
          <div className="mb-1.5">
            <h2 className="text-[10px] font-semibold text-gray-900 mb-1">Account Information</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-1">
                <div>
                  <label htmlFor="username" className="block text-[8px] font-semibold text-gray-700 mb-0.5">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-1 py-0.5 border border-gray-300 rounded-lg text-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[8px] font-semibold text-gray-700 mb-0.5">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-1 py-0.5 border border-gray-300 rounded-lg text-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                {isEditing && (
                  <>
                    <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                      <h3 className="text-[8px] font-semibold text-gray-900 mb-1">Change Password</h3>
                    </div>

                    <div>
                      <label htmlFor="currentPassword" className="block text-[8px] font-semibold text-gray-700 mb-0.5">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-lg text-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-[8px] font-semibold text-gray-700 mb-0.5">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-lg text-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-[8px] font-semibold text-gray-700 mb-0.5">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded-lg text-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-1 pt-1.5">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-lg font-semibold text-[8px] hover:shadow-lg transition-all duration-200"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-lg font-semibold text-[8px] hover:shadow-lg transition-all duration-200"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            ...formData,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-2 py-1 rounded-lg font-semibold text-[8px] hover:shadow-lg transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 mt-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Account Actions</h2>
          <div className="space-y-1.5">
            <button className="w-full text-left px-2 py-1.5 border border-gray-300 rounded-lg text-[10px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Download My Data
            </button>
            <button className="w-full text-left px-2 py-1.5 border border-red-300 rounded-lg text-[10px] font-semibold text-red-700 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
