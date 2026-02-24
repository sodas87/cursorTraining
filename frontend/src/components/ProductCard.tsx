import { Product } from '../types';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="product-card" data-testid={`product-${product.id}`}>
      <div className="product-image-placeholder">
        <span className="product-emoji">
          {product.category === 'Apparel' && '👕'}
          {product.category === 'Drinkware' && '☕'}
          {product.category === 'Accessories' && '🎲'}
          {product.category === 'Electronics' && '⌨️'}
        </span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            data-testid={`add-to-cart-${product.id}`}
          >
            {product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
        {product.stockQuantity > 0 && product.stockQuantity <= 10 && (
          <p className="low-stock">Only {product.stockQuantity} left!</p>
        )}
      </div>
    </div>
  );
}
