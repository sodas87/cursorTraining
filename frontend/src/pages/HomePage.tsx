import ProductList from '../components/ProductList';

export default function HomePage() {
  return (
    <div>
      <div className="hero">
        <h1>ShopCursor</h1>
        <p>Premium Developer Merch for Code Enthusiasts</p>
      </div>
      <ProductList />
    </div>
  );
}
