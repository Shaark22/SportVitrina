document.addEventListener('DOMContentLoaded', () => {
  const products = getProducts();
  const settings = getSettings();
  const params = new URLSearchParams(window.location.search);
  const activeCategory = params.get('category') || 'all';

  const grid = document.getElementById('catalog-grid');
  const filters = document.getElementById('filters');
  const countEl = document.getElementById('catalog-count');

  if (!grid || !filters) return;

  // Render filters
  filters.innerHTML = CATEGORIES.map(cat => `
    <button class="filter-btn ${cat.id === activeCategory ? 'active' : ''}"
            data-category="${cat.id}">
      ${cat.icon} ${cat.label}
    </button>
  `).join('');

  function renderProducts(category) {
    const filtered = category === 'all'
      ? products
      : products.filter(p => p.category === category);

    if (countEl) {
      countEl.textContent = `Найдено: ${filtered.length} ${pluralize(filtered.length, 'товар', 'товара', 'товаров')}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1">
          <p style="font-size:3rem;margin-bottom:1rem">📦</p>
          <h3>Товары не найдены</h3>
          <p style="margin-top:0.5rem">Попробуйте выбрать другую категорию</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => renderProductCard(p, settings)).join('');
  }

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const cat = btn.dataset.category;
    history.replaceState(null, '', cat === 'all' ? 'catalog.html' : `catalog.html?category=${cat}`);
    renderProducts(cat);
  });

  renderProducts(activeCategory);
});

function pluralize(n, one, few, many) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 === 1) return one;
  if (mod10 >= 2 && mod10 <= 4) return few;
  return many;
}
