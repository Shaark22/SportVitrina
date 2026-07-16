document.addEventListener('DOMContentLoaded', () => {
  const products = getProducts();
  const settings = getSettings();

  // Hero featured product
  const featured = products.find(p => p.featured) || products[0];
  if (featured) {
    const cardTitle = document.getElementById('hero-product-title');
    const cardPrice = document.getElementById('hero-product-price');
    const cardImg = document.getElementById('hero-product-img');
    if (cardTitle) cardTitle.textContent = featured.name;
    if (cardPrice) cardPrice.textContent = formatPrice(featured.price);
    if (cardImg) {
      cardImg.src = featured.image;
      cardImg.alt = featured.name;
    }
  }

  // Stats
  const statProducts = document.getElementById('stat-products');
  if (statProducts) statProducts.textContent = products.length + '+';

  // Category counts
  CATEGORIES.filter(c => c.id !== 'all').forEach(cat => {
    const count = products.filter(p => p.category === cat.id).length;
    const el = document.querySelector(`[data-category-count="${cat.id}"]`);
    if (el) el.textContent = count + ' товар' + (count === 1 ? '' : count < 5 ? 'а' : 'ов');
  });

  // Featured products grid
  const featuredGrid = document.getElementById('featured-products');
  if (featuredGrid) {
    const featuredProducts = products.filter(p => p.featured).slice(0, 4);
    const toShow = featuredProducts.length ? featuredProducts : products.slice(0, 4);
    featuredGrid.innerHTML = toShow.map(p => renderProductCard(p, settings)).join('');
  }

  // Category cards click
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      window.location.href = `catalog.html?category=${cat}`;
    });
  });
});
