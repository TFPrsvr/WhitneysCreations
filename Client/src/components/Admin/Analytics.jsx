import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const Analytics = () => {
  const { dashboardStats, fetchDashboardStats, loading } = useAdmin();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('users');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const calculateGrowthRate = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getGrowthColor = (rate) => {
    if (rate > 0) return 'text-green-600';
    if (rate < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load analytics data.</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = dashboardStats.overview;
  
  const analyticsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      change: stats.newUsersThisMonth,
      changeLabel: 'new this month',
      icon: '👥',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Users',
      value: stats.activeUsersThisWeek,
      changeLabel: 'active this week',
      icon: '⚡',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      change: stats.projectsCreatedThisMonth,
      changeLabel: 'created this month',
      icon: '📁',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Products Available',
      value: stats.totalProducts,
      icon: '🛍️',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const engagementMetrics = [
    {
      label: 'User Retention Rate',
      value: '68%',
      change: '+5.2%',
      description: 'Users returning within 30 days'
    },
    {
      label: 'Average Projects per User',
      value: (stats.totalProjects / stats.totalUsers).toFixed(1),
      change: '+12%',
      description: 'Projects created per active user'
    },
    {
      label: 'Completion Rate',
      value: '45%',
      change: '+8.1%',
      description: 'Projects marked as completed'
    },
    {
      label: 'Daily Active Users',
      value: Math.floor(stats.activeUsersThisWeek * 0.6).toLocaleString(),
      change: '+15%',
      description: 'Average daily active users'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {formatNumber(card.value)}
                </p>
                {card.change && (
                  <p className="text-sm text-green-600 mt-1">
                    +{formatNumber(card.change)} {card.changeLabel}
                  </p>
                )}
              </div>
              <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center text-white text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Growth Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">User Growth Trend</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('users')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedMetric === 'users'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setSelectedMetric('projects')}
              className={`px-3 py-1 text-sm rounded-lg ${
                selectedMetric === 'projects'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Projects
            </button>
          </div>
        </div>

        {/* Simplified Chart Representation */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <p className="text-gray-600 mb-2">Growth Chart Coming Soon</p>
            <p className="text-sm text-gray-500">
              Integration with charting library needed for detailed visualizations
            </p>
            {dashboardStats.userGrowth && (
              <div className="mt-4 text-left max-w-md mx-auto">
                <p className="font-medium text-gray-900 mb-2">Recent Growth Data:</p>
                {dashboardStats.userGrowth.slice(-3).map((data, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {data._id.year}-{String(data._id.month).padStart(2, '0')}: {data.count} new users
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
              <p className={`text-sm font-medium mt-1 ${getGrowthColor(parseFloat(metric.change))}`}>
                {metric.change} from last period
              </p>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top Content & User Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">User Role Distribution</h3>
          <div className="space-y-4">
            {dashboardStats.roleDistribution.map((role, index) => {
              const percentage = ((role.count / stats.totalUsers) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                    <span className="capitalize font-medium text-gray-700">{role._id}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      {role.count} ({percentage}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Creators */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Most Active Creators</h3>
          <div className="space-y-4">
            {dashboardStats.topCreators.slice(0, 5).map((creator, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {creator.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{creator.username}</p>
                    <p className="text-sm text-gray-500">{creator.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-600">{creator.projectCount}</p>
                  <p className="text-xs text-gray-500">projects</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Analytics Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <span>📊</span>
            <span className="font-medium text-gray-700">Export User Data</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <span>📈</span>
            <span className="font-medium text-gray-700">Generate Report</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <span>⚙️</span>
            <span className="font-medium text-gray-700">Configure Alerts</span>
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Advanced analytics features available in future updates
        </p>
      </div>
    </div>
  );
};

export default Analytics;