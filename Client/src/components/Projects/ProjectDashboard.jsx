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
  
  const { isAuthenticated } = useAuth();
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
        <div className="text-center py-16 bg-gray-50 rounded-xl mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Please log in to access your projects</h2>
          <p className="text-gray-600 text-lg">Sign in to create, save, and manage your design projects.</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 page-container">
      <div className="max-w-7xl mx-auto p-6 mt-4">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900">My Projects</h1>
            <button
              className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              onClick={handleCreateProject}
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
          {/* Search and Filters Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Search Projects</label>
              <ProjectSearch />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Filter Options</label>
              <ProjectFilters
                filters={filters}
                onFilterChange={handleFilterChange} />
            </div>

            <div className="lg:col-span-1">
              <label className="block text-sm font-bold text-gray-900 mb-2 drop-shadow-sm">Sort & Order</label>
              <div className="flex flex-col space-y-3">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-semibold hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  style={{color: '#1f2937'}}
                >
                  <option value="modified" className="text-gray-900 font-semibold">Last Modified</option>
                  <option value="created" className="text-gray-900 font-semibold">Date Created</option>
                  <option value="name" className="text-gray-900 font-semibold">Name</option>
                  <option value="opened" className="text-gray-900 font-semibold">Last Opened</option>
                </select>

                <button
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 text-gray-900 font-bold flex items-center justify-center gap-2 transition-all duration-200"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
              <button
                className={`px-6 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${currentView === 'grid'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
                onClick={() => setCurrentView('grid')}
                title="Grid View"
              >
                <span className="text-xl">⊞</span>
                <span>Grid View</span>
              </button>
              <button
                className={`px-6 py-3 font-semibold transition-all duration-200 flex items-center gap-2 ${currentView === 'list'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-blue-600'}`}
                onClick={() => setCurrentView('list')}
                title="List View"
              >
                <span className="text-xl">☰</span>
                <span>List View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-primary-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 drop-shadow-sm">No projects yet</h3>
            <p className="text-gray-900 font-semibold text-lg mb-8 drop-shadow-sm">Create your first design project to get started!</p>
            <button
              className="bg-gradient-to-r from-primary-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              onClick={handleCreateProject}
            >
              Create Your First Project
            </button>
          </div>
        ) : (
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