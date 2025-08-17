import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, priceRange }) => {
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  
  const getCategoryDisplay = (category) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getTypeDisplay = (type) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getAvailableColors = () => {
    if (product.colors) return product.colors;
    if (!product.variants) return [];
    
    const colors = product.variants.map(v => ({
      name: v.color,
      hex: v.colorHex
    }));
    
    // Remove duplicates
    return colors.filter((color, index, self) => 
      index === self.findIndex(c => c.name === color.name)
    );
  };

  const getAvailableSizes = () => {
    if (product.sizes) return product.sizes;
    if (!product.variants) return [];
    
    const sizes = [...new Set(product.variants.map(v => v.size))];
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
    
    return sizes.sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a);
      const bIndex = sizeOrder.indexOf(b);
      return aIndex - bIndex;
    });
  };

  const isInStock = () => {
    if (product.inStock !== undefined) return product.inStock;
    return product.variants?.some(v => v.stock > 0) || false;
  };

  const getDisplayPrice = () => {
    if (priceRange) return priceRange;
    if (product.basePrice && product.suggestedPrice) {
      return `$${product.basePrice} - $${product.suggestedPrice}`;
    }
    if (product.price) return `$${product.price}`;
    return 'Price varies';
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-container">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              className="product-image"
              loading="lazy"
            />
          ) : product.image ? (
            <div className="product-image-placeholder">
              <span className="text-6xl">{product.image}</span>
            </div>
          ) : (
            <div className="product-image-placeholder">
              <span>No Image</span>
            </div>
          )}
          
          {(product.isFeatured || product.featured) && (
            <div className="featured-badge">
              ⭐ Featured
            </div>
          )}
          
          {!isInStock() && (
            <div className="out-of-stock-overlay">
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-category">
            {getCategoryDisplay(product.category)} • {getTypeDisplay(product.type)}
          </div>
          
          <h3 className="product-name">{product.name}</h3>
          
          <p className="product-description">{product.description}</p>
          
          <div className="product-price">
            {getDisplayPrice()}
          </div>

          <div className="product-variants">
            {getAvailableColors().length > 0 && (
              <div className="color-options">
                <span className="variant-label">Colors:</span>
                <div className="color-swatches">
                  {getAvailableColors().slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="color-swatch"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {getAvailableColors().length > 4 && (
                    <div className="color-more">
                      +{getAvailableColors().length - 4}
                    </div>
                  )}
                </div>
              </div>
            )}

            {getAvailableSizes().length > 0 && (
              <div className="size-options">
                <span className="variant-label">Sizes:</span>
                <div className="size-list">
                  {getAvailableSizes().slice(0, 4).join(', ')}
                  {getAvailableSizes().length > 4 && '...'}
                </div>
              </div>
            )}
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="product-tags">
              {product.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="product-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>

      <div className="product-actions">
        <Link to={`/products/${product._id}`} className="view-details-btn">
          View Details
        </Link>
        <button 
          className="customize-btn"
          disabled={!isInStock()}
          onClick={(e) => {
            e.preventDefault();
            // TODO: Open design customizer
            console.log('Customize product:', product.name);
          }}
        >
          Customize
        </button>
      </div>
    </div>
  );
};

export default ProductCard;