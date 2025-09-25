import React, { useState, useEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useAuth } from '../../contexts/AuthContext';
import ProjectCard from './ProjectCard';
import ProjectSearch from './ProjectSearch';
import ProjectFilters from './ProjectFilters';
import ProjectStats from './ProjectStats';
import CreateProjectModal from './CreateProjectModal';

const ProjectDashboard = () => {
  const { 
    projects, 
    loading, 
    error, 
    fetchUserProjects, 
    fetchProjectStats,
    stats,
    clearError 
  } = useProject();
  
  const { isAuthenticated, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('modified');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    isTemplate: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProjects({ sortBy, sortOrder, ...filters });
      fetchProjectStats();
    }
  }, [isAuthenticated, sortBy, sortOrder, filters]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    fetchUserProjects({ sortBy, sortOrder, ...filters });
    fetchProjectStats();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 page-container">
        <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16 bg-white bg-opacity-80 rounded-xl mt-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please log in to access your projects</h2>
          <p className="text-gray-600 text-lg">Sign in to create, save, and manage your design projects.</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 page-container" style={{overflowX: 'visible'}}>
      <div className="max-w-7xl mx-auto p-6 mt-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="w-full">
              {user && (
                <div style={{position: 'relative'}}>
                  <p className="font-bold mb-1" style={{color: '#3b82f6', fontSize: '2rem', lineHeight: '1', position: 'absolute', left: '-3rem', top: '0'}}>
                    Welcome back!
                  </p>
                  <h1 className="font-bold text-gray-900 mb-2" style={{marginLeft: '4rem', fontSize: '3rem', paddingTop: '2.5rem'}}>
                    {user.displayName || user.first || user.username || 'User'}'s Projects
                  </h1>
                </div>
              )}
              {!user && (
                <h1 className="text-4xl font-bold text-gray-900 mb-2">My Projects</h1>
              )}
            </div>
            <button
              className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap flex items-center justify-center"
              onClick={handleCreateProject}
              style={{
                maxWidth: '20vw',
                minWidth: '180px',
                borderRadius: '12px'
              }}
            >
              + New Project
            </button>
          </div>

          {error && (
            <div className="flex justify-between items-center bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
              <span>{error}</span>
              <button onClick={clearError} className="text-red-500 hover:text-red-700 text-xl font-bold">×</button>
            </div>
          )}
        </div>

        {stats && <ProjectStats stats={stats} />}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          {/* Filters and Sort Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="lg:col-span-1 text-center">
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Filter Options</label>
              <div className="flex justify-center">
                <ProjectFilters
                  filters={filters}
                  onFilterChange={handleFilterChange} />
              </div>
            </div>

            <div className="lg:col-span-1 text-center">
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Sort & Order</label>
              <div className="flex flex-col space-y-3 items-center">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-semibold hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  style={{
                    color: '#1f2937',
                    maxWidth: '16vw',
                    minWidth: '180px',
                    borderRadius: '12px'
                  }}
                >
                  <option value="modified" className="text-gray-900 font-semibold">Last Modified</option>
                  <option value="created" className="text-gray-900 font-semibold">Date Created</option>
                  <option value="name" className="text-gray-900 font-semibold">Name</option>
                  <option value="opened" className="text-gray-900 font-semibold">Last Opened</option>
                </select>

                <button
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 hover:border-blue-400 text-white font-bold flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                  style={{
                    maxWidth: '16vw',
                    minWidth: '180px',
                    borderRadius: '12px'
                  }}
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            </div>
          </div>

          {/* Search Section - Below filters and sorting */}
          <div className="border-t border-gray-200 pt-4">
            <label className="block text-sm font-bold text-gray-900 mb-1 drop-shadow-sm">Search Projects</label>
            <div className="flex justify-center">
              <ProjectSearch />
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-semibold mb-2" style={{color: '#1f2937'}}>No projects yet</h3>
            <p className="font-medium text-lg mb-8" style={{color: '#4b5563'}}>Create your first design project to get started!</p>
            <button
              className="bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              onClick={handleCreateProject}
              style={{
                maxWidth: '20vw',
                minWidth: '220px',
                borderRadius: '12px',
                color: 'white'
              }}
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div>
            {/* View Toggle - Inside project list section at top right */}
            <div className="flex justify-end mb-6">
              <div className="inline-flex rounded-lg overflow-hidden gap-1">
                <button
                  className={`px-4 py-2 font-semibold transition-all duration-200 flex items-center gap-2 ${currentView === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100 hover:text-blue-600'}`}
                  onClick={() => setCurrentView('grid')}
                  title="Grid View"
                  style={{
                    maxWidth: '16vw',
                    minWidth: '120px',
                    borderRadius: '8px'
                  }}
                >
                  <span className="text-xl">⊞</span>
                  <span>Grid View</span>
                </button>
                <button
                  className={`px-4 py-2 font-semibold transition-all duration-200 flex items-center gap-2 ${currentView === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'bg-white bg-opacity-90 text-gray-800 hover:bg-opacity-100 hover:text-blue-600'}`}
                  onClick={() => setCurrentView('list')}
                  title="List View"
                  style={{
                    maxWidth: '16vw',
                    minWidth: '120px',
                    borderRadius: '8px'
                  }}
                >
                  <span className="text-xl">☰</span>
                  <span>List View</span>
                </button>
              </div>
            </div>

            <div className={`${currentView === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'flex flex-col gap-4'}`}>
              {projects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  viewMode={currentView}
                  onUpdate={() => {
                    fetchUserProjects({ sortBy, sortOrder, ...filters });
                    fetchProjectStats();
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onProjectCreated={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default ProjectDashboard;