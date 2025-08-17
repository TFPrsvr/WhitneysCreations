import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const UserDetailsModal = ({ user, onClose, onUserUpdate }) => {
  const { fetchUserDetails, updateUser, loading } = useAdmin();
  const [userDetails, setUserDetails] = useState(user);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first: user.first || '',
    last: user.last || '',
    email: user.email || '',
    role: user.role || 'user',
    isActive: user.isActive !== undefined ? user.isActive : true
  });

  useEffect(() => {
    // Fetch detailed user information
    const loadUserDetails = async () => {
      try {
        const details = await fetchUserDetails(user._id);
        if (details) {
          setUserDetails(details);
        }
      } catch (error) {
        console.error('Error loading user details:', error);
      }
    };

    loadUserDetails();
  }, [user._id, fetchUserDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(user._id, formData);
      setUserDetails(updatedUser);
      setEditMode(false);
      onUserUpdate();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      first: userDetails.first || '',
      last: userDetails.last || '',
      email: userDetails.email || '',
      role: userDetails.role || 'user',
      isActive: userDetails.isActive !== undefined ? userDetails.isActive : true
    });
    setEditMode(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {userDetails.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userDetails.first} {userDetails.last}
              </h2>
              <p className="text-gray-600">@{userDetails.username} • {userDetails.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading user details...</span>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                    {!editMode ? (
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={handleCancel}
                          className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="first"
                          value={formData.first}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userDetails.first || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="last"
                          value={formData.last}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userDetails.last || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userDetails.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      {editMode ? (
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="user">User</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                          <option value="superadmin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(userDetails.role)}`}>
                          {userDetails.role}
                        </span>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        {editMode ? (
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                        ) : (
                          <div className={`w-4 h-4 rounded ${userDetails.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          Account Active
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Recent Projects */}
                {userDetails.recentProjects && userDetails.recentProjects.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h3>
                    <div className="space-y-3">
                      {userDetails.recentProjects.slice(0, 5).map((project, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div>
                            <p className="font-medium text-gray-900">{project.name}</p>
                            <p className="text-sm text-gray-500">
                              {project.product?.name} • {project.status}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {formatDate(project.updatedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                {userDetails.recentActivity && userDetails.recentActivity.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-2">
                      {userDetails.recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          <span className="font-medium">{activity.name}</span> updated{' '}
                          <span className="text-gray-500">
                            {formatDate(activity.updatedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistics Sidebar */}
              <div className="space-y-6">
                {/* Account Stats */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Projects</span>
                      <span className="font-semibold text-gray-900">
                        {userDetails.stats?.totalProjects || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed Projects</span>
                      <span className="font-semibold text-gray-900">
                        {userDetails.stats?.completedProjects || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Suggestions</span>
                      <span className="font-semibold text-gray-900">
                        {userDetails.stats?.totalSuggestions || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Age</span>
                      <span className="font-semibold text-gray-900">
                        {userDetails.stats?.accountAge || 0} days
                      </span>
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-sm text-gray-600">Member Since</span>
                      <span className="text-gray-900">
                        {formatDate(userDetails.createdAt)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-600">Last Login</span>
                      <span className="text-gray-900">
                        {userDetails.lastLogin 
                          ? formatDate(userDetails.lastLogin)
                          : 'Never'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-600">Login Count</span>
                      <span className="text-gray-900">
                        {userDetails.loginCount || 0} times
                      </span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-600">User ID</span>
                      <span className="text-gray-900 font-mono text-xs">
                        {userDetails._id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;