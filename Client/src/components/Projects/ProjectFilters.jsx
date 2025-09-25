import React from 'react';

const ProjectFilters = ({ filters, onFilterChange }) => {
  const handleFilterUpdate = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === '' ? '' : value
    });
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'personal', label: 'Personal' },
    { value: 'business', label: 'Business' },
    { value: 'event', label: 'Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const templateOptions = [
    { value: '', label: 'All Projects' },
    { value: 'true', label: 'Templates Only' },
    { value: 'false', label: 'Regular Projects' }
  ];

  return (
    <div className="flex flex-col gap-3">
      <select
        value={filters.status}
        onChange={(e) => handleFilterUpdate('status', e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-semibold hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        style={{
          color: '#1f2937',
          maxWidth: '16vw',
          minWidth: '180px',
          borderRadius: '12px'
        }}
      >
        {statuses.map(status => (
          <option
            key={status.value}
            value={status.value}
            className="text-gray-900 font-semibold bg-white hover:bg-blue-50 py-2"
          >
            {status.label}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => handleFilterUpdate('category', e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-semibold hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        style={{
          color: '#1f2937',
          maxWidth: '16vw',
          minWidth: '180px',
          borderRadius: '12px'
        }}
      >
        {categories.map(category => (
          <option
            key={category.value}
            value={category.value}
            className="text-gray-900 font-semibold bg-white hover:bg-blue-50 py-2"
          >
            {category.label}
          </option>
        ))}
      </select>

      <select
        value={filters.isTemplate}
        onChange={(e) => handleFilterUpdate('isTemplate', e.target.value)}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-semibold hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
        style={{
          color: '#1f2937',
          maxWidth: '16vw',
          minWidth: '180px',
          borderRadius: '12px'
        }}
      >
        {templateOptions.map(option => (
          <option
            key={option.value}
            value={option.value}
            className="text-gray-900 font-semibold bg-white hover:bg-blue-50 py-2"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectFilters;