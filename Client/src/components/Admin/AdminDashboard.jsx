import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserManagement from './UserManagement';
import SystemHealth from './SystemHealth';
import Analytics from './Analytics';
import ProductManagement from './ProductManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { 
    isAdmin, 
    dashboardStats, 
    loading, 
    error, 
    fetchDashboardStats,
    clearError 
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAdmin()) {
      fetchDashboardStats();
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Redirect if not admin
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'system', label: 'System', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={dashboardStats} loading={loading} />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'analytics':
        return <Analytics />;
      case 'system':
        return <SystemHealth />;
      default:
        return <OverviewTab stats={dashboardStats} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 page-container">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="header-main">Admin Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user?.first} • {user?.role === 'superadmin' ? 'Super Administrator' : 'Administrator'}
              </p>
            </div>
            
            {user?.isImpersonation && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg">
                <span className="font-medium">⚠️ Impersonating:</span> {user.originalAdmin}
                <button 
                  onClick={() => window.location.href = '/admin'}
                  className="ml-2 text-yellow-600 hover:text-yellow-800 underline"
                >
                  Exit
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button onClick={clearError} className="text-red-500 hover:text-red-700 text-xl font-bold">×</button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load dashboard statistics.</p>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Total Users',
      value: stats.overview.totalUsers.toLocaleString(),
      change: `+${stats.overview.newUsersThisMonth}`,
      changeLabel: 'this month',
      icon: '👥',
      color: 'bg-blue-500'
    },
    {
      title: 'Total Projects',
      value: stats.overview.totalProjects.toLocaleString(),
      change: `+${stats.overview.projectsCreatedThisMonth}`,
      changeLabel: 'this month',
      icon: '📁',
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: stats.overview.activeUsersThisWeek.toLocaleString(),
      changeLabel: 'this week',
      icon: '⚡',
      color: 'bg-yellow-500'
    },
    {
      title: 'Products',
      value: stats.overview.totalProducts.toLocaleString(),
      icon: '🛍️',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                {card.change && (
                  <p className="text-sm text-green-600 mt-1">
                    {card.change} {card.changeLabel}
                  </p>
                )}
              </div>
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Role Distribution</h3>
          <div className="space-y-4">
            {stats.roleDistribution.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="capitalize font-medium text-gray-700">{role._id}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ 
                        width: `${(role.count / stats.overview.totalUsers) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">
                    {role.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Creators</h3>
          <div className="space-y-3">
            {stats.topCreators.slice(0, 5).map((creator, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">{creator.username}</p>
                  <p className="text-sm text-gray-500">{creator.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{creator.projectCount} projects</p>
                  <p className="text-xs text-gray-500">
                    Active {new Date(creator.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;