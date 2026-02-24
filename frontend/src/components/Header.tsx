import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart?.itemCount ?? 0;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          ShopCursor
        </Link>
        <nav className="nav">
          <Link to="/">Products</Link>
          <Link to="/cart" className="cart-link">
            Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
