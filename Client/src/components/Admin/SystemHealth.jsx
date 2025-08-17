import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

const SystemHealth = () => {
  const { 
    systemHealth, 
    systemLogs, 
    loading, 
    fetchSystemHealth, 
    fetchSystemLogs,
    isSuperAdmin 
  } = useAdmin();

  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [logFilters, setLogFilters] = useState({
    level: 'all',
    limit: 100
  });

  useEffect(() => {
    // Initial load
    fetchSystemHealth();
    if (isSuperAdmin()) {
      fetchSystemLogs(logFilters);
    }
  }, []);

  useEffect(() => {
    // Auto-refresh functionality
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchSystemHealth();
        if (isSuperAdmin()) {
          fetchSystemLogs(logFilters);
        }
      }, 30000); // Refresh every 30 seconds

      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [autoRefresh, logFilters, isSuperAdmin]);

  const handleRefresh = () => {
    fetchSystemHealth();
    if (isSuperAdmin()) {
      fetchSystemLogs(logFilters);
    }
  };

  const handleLogFilterChange = (key, value) => {
    const newFilters = { ...logFilters, [key]: value };
    setLogFilters(newFilters);
    if (isSuperAdmin()) {
      fetchSystemLogs(newFilters);
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <span>🔄</span>
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Auto-refresh (30s)</span>
          </label>
        </div>

        {systemHealth && (
          <div className="text-sm text-gray-500">
            Last updated: {formatTimestamp(systemHealth.timestamp)}
          </div>
        )}
      </div>

      {/* System Health Overview */}
      {systemHealth && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Status</p>
                <p className={`text-2xl font-bold capitalize mt-2 px-3 py-1 rounded-full inline-block ${getHealthStatusColor(systemHealth.status)}`}>
                  {systemHealth.status}
                </p>
              </div>
              <div className="text-4xl">
                {systemHealth.status === 'healthy' ? '✅' : systemHealth.status === 'warning' ? '⚠️' : '❌'}
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <p className={`text-lg font-semibold capitalize mt-2 ${
                  systemHealth.database.status === 'connected' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {systemHealth.database.status}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Response: {systemHealth.database.responseTime}
                </p>
              </div>
              <div className="text-4xl">🗄️</div>
            </div>
          </div>

          {/* Server Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Server</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">
                  Uptime: {systemHealth.server.uptime}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Memory: {systemHealth.server.memoryUsage.used} / {systemHealth.server.memoryUsage.total}
                </p>
              </div>
              <div className="text-4xl">🖥️</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {systemHealth && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">System Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Database Metrics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🗄️</span>
                Database Performance
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Connection Status</span>
                  <span className={`font-medium ${
                    systemHealth.database.status === 'connected' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {systemHealth.database.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Query Response Time</span>
                  <span className="font-medium text-gray-900">
                    {systemHealth.database.responseTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Server Metrics */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🖥️</span>
                Server Performance
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium text-gray-900">
                    {systemHealth.server.uptime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium text-gray-900">
                    {systemHealth.server.memoryUsage.used} / {systemHealth.server.memoryUsage.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Node.js Version</span>
                  <span className="font-medium text-gray-900">
                    {systemHealth.server.nodeVersion}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Memory Usage Bar */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              <span className="text-sm text-gray-500">
                {systemHealth.server.memoryUsage.used} / {systemHealth.server.memoryUsage.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(parseFloat(systemHealth.server.memoryUsage.used) / parseFloat(systemHealth.server.memoryUsage.total)) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* System Logs (Superadmin Only) */}
      {isSuperAdmin() && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
            
            <div className="flex items-center space-x-4">
              <select
                value={logFilters.level}
                onChange={(e) => handleLogFilterChange('level', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Levels</option>
                <option value="error">Errors Only</option>
                <option value="warning">Warnings Only</option>
                <option value="info">Info Only</option>
              </select>

              <select
                value={logFilters.limit}
                onChange={(e) => handleLogFilterChange('limit', parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value={50}>Last 50</option>
                <option value={100}>Last 100</option>
                <option value={500}>Last 500</option>
              </select>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {systemLogs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No logs available</p>
            ) : (
              systemLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLogLevelColor(log.level)}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{log.message}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className="text-xs text-gray-500">
                        Source: {log.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {!isSuperAdmin() && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-2">🔒</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Restricted Access</h3>
          <p className="text-yellow-700">
            System logs are only available to superadministrators for security reasons.
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemHealth;