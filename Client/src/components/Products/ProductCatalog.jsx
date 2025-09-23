import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';
import ProductFilters from './ProductFilters';
import './ProductCatalog.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [categories, setCategories] = useState([]);

  // Fetch products with current filters
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...filters
      });

      // Remove empty filter values
      Object.keys(filters).forEach(key => {
        if (!filters[key]) {
          params.delete(key);
        }
      });

      const response = await axios.get(`http://localhost:3002/api/products?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch products');
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      // Use mock data when API is not available
      setProducts(sampleProducts);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: sampleProducts.length,
        hasNextPage: false,
        hasPrevPage: false
      });
      console.log('Using sample products data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter dropdown
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/products/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      // Use mock categories when API is not available
      setCategories(['apparel', 'drinkware', 'accessories']);
    }
  };

  // Sample products for demo purposes
  const sampleProducts = [
    {
      _id: '1',
      name: 'Premium Cotton T-Shirt',
      description: 'Soft, comfortable cotton t-shirt perfect for custom designs. High-quality fabric that holds prints beautifully.',
      basePrice: 12.99,
      suggestedPrice: 24.99,
      category: 'apparel',
      type: 't-shirt',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Red', hex: '#FF4136' },
        { name: 'Royal Blue', hex: '#0074D9' }
      ],
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: true,
      inStock: true
    },
    {
      _id: '2',
      name: 'Cozy Pullover Hoodie',
      description: 'Warm and comfortable pullover hoodie with front pocket. Perfect for cool weather and casual wear.',
      basePrice: 24.99,
      suggestedPrice: 49.99,
      category: 'apparel',
      type: 'hoodie',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        { name: 'Heather Grey', hex: '#808080' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Maroon', hex: '#85144b' }
      ],
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: true,
      inStock: true
    },
    {
      _id: '3',
      name: 'Ceramic Coffee Mug',
      description: '11oz ceramic mug perfect for morning coffee. Dishwasher and microwave safe.',
      basePrice: 8.99,
      suggestedPrice: 18.99,
      category: 'drinkware',
      type: 'mug',
      sizes: ['11oz'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Blue', hex: '#0074D9' }
      ],
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: true,
      inStock: true
    },
    {
      _id: '4',
      name: 'Adjustable Baseball Cap',
      description: 'Classic 6-panel baseball cap with adjustable strap. Great for embroidered or printed designs.',
      basePrice: 15.99,
      suggestedPrice: 29.99,
      category: 'accessories',
      type: 'hat',
      sizes: ['One Size'],
      colors: [
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#001f3f' },
        { name: 'Red', hex: '#FF4136' },
        { name: 'White', hex: '#FFFFFF' }
      ],
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false,
      inStock: true
    },
    {
      _id: '5',
      name: 'Canvas Tote Bag',
      description: 'Durable canvas tote bag perfect for everyday use. Large print area for custom designs.',
      basePrice: 11.99,
      suggestedPrice: 22.99,
      category: 'accessories',
      type: 'bag',
      sizes: ['One Size'],
      colors: [
        { name: 'Natural', hex: '#F5F5DC' },
        { name: 'Black', hex: '#000000' },
        { name: 'Navy', hex: '#001f3f' }
      ],
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false,
      inStock: true
    },
    {
      _id: '6',
      name: 'Phone Case',
      description: 'Protective phone case available for various models. Slim design with excellent protection.',
      basePrice: 12.99,
      suggestedPrice: 24.99,
      category: 'accessories',
      type: 'phone-case',
      sizes: ['iPhone 13', 'iPhone 14', 'Samsung S22', 'Samsung S23'],
      colors: [
        { name: 'Clear', hex: 'transparent' },
        { name: 'Black', hex: '#000000' },
        { name: 'White', hex: '#FFFFFF' }
      ],
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false,
      inStock: true
    },
    {
      _id: '7',
      name: 'Tank Top',
      description: 'Lightweight tank top perfect for summer. Comfortable fit and great for gym or casual wear.',
      basePrice: 10.99,
      suggestedPrice: 21.99,
      category: 'apparel',
      type: 'tank-top',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Black', hex: '#000000' },
        { name: 'Grey', hex: '#808080' }
      ],
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: false,
      inStock: true
    },
    {
      _id: '8',
      name: 'Vinyl Stickers',
      description: 'High-quality vinyl stickers perfect for custom designs. Waterproof and durable.',
      basePrice: 2.99,
      suggestedPrice: 8.99,
      category: 'stickers',
      type: 'vinyl-sticker',
      sizes: ['2"x2"', '3"x3"', '4"x4"', '5"x5"'],
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Clear', hex: 'transparent' }
      ],
      image: 'https://images.unsplash.com/photo-1594736797933-d0380ba902d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      featured: true,
      inStock: true
    }
  ];

  // Initial load
  useEffect(() => {
    // Try to fetch from API first, fallback to sample products
    fetchProducts().catch(() => {
      setProducts(sampleProducts);
      setCategories([
        { name: 'apparel', label: 'Apparel' },
        { name: 'drinkware', label: 'Drinkware' },
        { name: 'accessories', label: 'Accessories' },
        { name: 'stickers', label: 'Stickers' }
      ]);
      setLoading(false);
    });
  }, []);

  // Reload when filters change
  useEffect(() => {
    fetchProducts(1);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const getPriceRange = (variants) => {
    if (!variants || variants.length === 0) return '$0.00';
    
    const prices = variants.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    return min === max ? `$${min.toFixed(2)}` : `$${min.toFixed(2)} - $${max.toFixed(2)}`;
  };

  return (
    <div className="product-catalog page-container" style={{maxWidth: 'calc(100vw - 11rem)'}}>
      <div className="catalog-header">
        <h1>Product Catalog</h1>
        <p>Choose from our wide selection of customizable products</p>
      </div>

      <div className="catalog-content">
        <aside className="filters-sidebar">
          <ProductFilters
            filters={filters}
            categories={categories}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onClearFilters={clearFilters}
          />
        </aside>

        <main className="products-main">
          <div className="products-header">
            <div className="results-info">
              {loading ? (
                <span>Loading...</span>
              ) : (
                <span>
                  Showing {products.length} of {pagination.totalProducts} products
                  {filters.search && (
                    <span> for "{filters.search}"</span>
                  )}
                </span>
              )}
            </div>

            <div className="sort-controls">
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange({ sortBy, sortOrder });
                }}
                className="sort-select"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="basePrice-asc">Price Low to High</option>
                <option value="basePrice-desc">Price High to Low</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => fetchProducts()} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading-grid">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="product-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-line skeleton-title"></div>
                    <div className="skeleton-line skeleton-price"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    priceRange={getPriceRange(product.variants)}
                  />
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms.</p>
                  <button onClick={clearFilters} className="clear-filters-btn">
                    Clear All Filters
                  </button>
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <div className="pagination-numbers">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      const isCurrentPage = pageNum === pagination.currentPage;
                      
                      // Show first, last, current, and pages around current
                      const showPage = 
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        Math.abs(pageNum - pagination.currentPage) <= 2;

                      if (!showPage) {
                        // Show ellipsis
                        if (pageNum === 2 && pagination.currentPage > 4) {
                          return <span key={pageNum} className="pagination-ellipsis">...</span>;
                        }
                        if (pageNum === pagination.totalPages - 1 && pagination.currentPage < pagination.totalPages - 3) {
                          return <span key={pageNum} className="pagination-ellipsis">...</span>;
                        }
                        return null;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`pagination-btn ${isCurrentPage ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductCatalog;