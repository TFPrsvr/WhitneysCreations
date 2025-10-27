import React, { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';

const ProjectSearch = () => {
  const { searchProjects } = useProject();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      await searchProjects(query.trim());
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    // Could trigger a refresh of all projects here
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-6 items-center">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          style={{
            width: '400px',
            height: '42px'
          }}
        />
        <div className="absolute left-3 text-gray-400" style={{top: '50%', transform: 'translateY(-50%)'}}>
          🔍
        </div>
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={!query.trim() || isSearching}
        className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-center flex items-center justify-center hover:shadow-lg transition-all duration-200"
        style={{
          width: '140px',
          height: '42px',
          borderRadius: '12px'
        }}
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default ProjectSearch;