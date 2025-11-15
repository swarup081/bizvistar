// src/app/site/[slug]/product/page.js
export default function ProductPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Product Page</h1>
      <p>Please specify a product ID to view a product.</p>
      <p>Example: /site/your-site-slug/product/your-product-id</p>
    </div>
  );
}