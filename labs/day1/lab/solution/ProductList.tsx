import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../hooks/useProducts';
import './ProductList.css';

// Constants
const PRODUCT_CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

/**
 * ProductList component displays a filterable and searchable list of products.
 * Uses custom hook for data fetching and memoization for performance.
 */
const ProductList = () => {
  // Hooks
  const { products, loading, error, refetch } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Computed values
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  // Event handlers
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRetry = () => {
    refetch();
  };

  // Conditional early returns
  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        <div className="spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error" role="alert">
        <h3>Error loading products</h3>
        <p>{error}</p>
        <button onClick={handleRetry} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  // Main render
  return (
    <div className="product-list-container">
      {/* Filters section */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search products"
            className="search-input"
          />
        </div>

        <div className="category-filter">
          <label htmlFor="category-select">Category: </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Filter by category"
            className="category-select"
          >
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Product count */}
      <div className="product-count" aria-live="polite">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="no-products" role="status">
          <p>No products found matching your criteria.</p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="clear-filters-button"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductList;
