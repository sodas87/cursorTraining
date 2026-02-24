import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Custom hook for fetching and managing product data.
 *
 * @returns {Object} Hook state and methods
 * @returns {Array} returns.products - Array of product objects
 * @returns {boolean} returns.loading - Loading state indicator
 * @returns {string|null} returns.error - Error message if fetch failed
 * @returns {Function} returns.refetch - Function to manually trigger a refetch
 *
 * @example
 * const { products, loading, error, refetch } = useProducts();
 *
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error}</div>;
 * return <div>{products.map(p => <ProductCard key={p.id} product={p} />)}</div>;
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches products from the API.
   * Handles loading states and errors gracefully.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                          err.message ||
                          'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
};
