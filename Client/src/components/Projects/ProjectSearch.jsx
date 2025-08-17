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
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
        />
        <div className="absolute left-3 top-2.5 text-gray-400">
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
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSearching ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default ProjectSearch;