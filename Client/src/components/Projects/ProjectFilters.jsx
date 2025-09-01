
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
    <div className="flex gap-3">
      <select
        value={filters.status}
        onChange={(e) => handleFilterUpdate('status', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        {statuses.map(status => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </select>

      <select
        value={filters.category}
        onChange={(e) => handleFilterUpdate('category', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        {categories.map(category => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <select
        value={filters.isTemplate}
        onChange={(e) => handleFilterUpdate('isTemplate', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
      >
        {templateOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectFilters;