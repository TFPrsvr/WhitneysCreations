import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductFilters.css';

const ProductFilters = ({ filters, categories, onFilterChange, onSearch, onClearFilters }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [productTypes, setProductTypes] = useState([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch product types when category changes
  useEffect(() => {
    if (filters.category) {
      fetchProductTypes(filters.category);
    } else {
      setProductTypes([]);
    }
  }, [filters.category]);

  const fetchProductTypes = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3002/api/products/category/${category}/types`);
      if (response.data.success) {
        setProductTypes(response.data.types);
      }
    } catch (error) {
      console.error('Error fetching product types:', error);
      setProductTypes([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
    
    // Clear type filter when category changes
    if (key === 'category' && filters.type) {
      onFilterChange({ type: '' });
    }
  };

  const hasActiveFilters = () => {
    return filters.category || filters.type || filters.minPrice || filters.maxPrice || filters.search;
  };

  return (
    <div className="product-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        <button 
          className="toggle-filters-btn"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          {isFiltersOpen ? '−' : '+'}
        </button>
      </div>

      <div className={`filters-content ${isFiltersOpen ? 'open' : ''}`}>
        {/* Search */}
        <div className="filter-group">
          <label htmlFor="search">Search Products</label>
          <form onSubmit={handleSearchSubmit} className="search-form">
            <input
              id="search"
              type="text"
              placeholder="Search by name, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.displayName} ({category.count})
              </option>
            ))}
          </select>
        </div>

        {/* Product Type Filter */}
        {filters.category && productTypes.length > 0 && (
          <div className="filter-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="filter-select"
            >
              <option value="">All Types</option>
              {productTypes.map(type => (
                <option key={type.name} value={type.name}>
                  {type.displayName} ({type.count})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price Range */}
        <div className="filter-group">
          <label>Price Range</label>
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="minPrice" className="sr-only">Minimum Price</label>
              <input
                id="minPrice"
                type="number"
                placeholder="Min $"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="price-input"
              />
            </div>
            <span className="price-separator">to</span>
            <div className="price-input-group">
              <label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
              <input
                id="maxPrice"
                type="number"
                placeholder="Max $"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="price-input"
              />
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="filter-group">
          <label>Quick Filters</label>
          <div className="quick-filters">
            <button
              className={`quick-filter-btn ${filters.featured === 'true' ? 'active' : ''}`}
              onClick={() => handleFilterChange('featured', filters.featured === 'true' ? '' : 'true')}
            >
              ⭐ Featured
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <div className="filter-group">
            <button onClick={onClearFilters} className="clear-filters-btn">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="active-filters">
            <h4>Active Filters:</h4>
            <div className="active-filters-list">
              {filters.search && (
                <div className="active-filter">
                  Search: "{filters.search}"
                  <button onClick={() => {
                    setSearchTerm('');
                    onSearch('');
                  }}>×</button>
                </div>
              )}
              {filters.category && (
                <div className="active-filter">
                  Category: {categories.find(c => c.name === filters.category)?.displayName || filters.category}
                  <button onClick={() => handleFilterChange('category', '')}>×</button>
                </div>
              )}
              {filters.type && (
                <div className="active-filter">
                  Type: {productTypes.find(t => t.name === filters.type)?.displayName || filters.type}
                  <button onClick={() => handleFilterChange('type', '')}>×</button>
                </div>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <div className="active-filter">
                  Price: ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                  <button onClick={() => handleFilterChange({ minPrice: '', maxPrice: '' })}>×</button>
                </div>
              )}
              {filters.featured === 'true' && (
                <div className="active-filter">
                  Featured Only
                  <button onClick={() => handleFilterChange('featured', '')}>×</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;