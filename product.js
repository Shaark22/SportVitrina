document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const settings = getSettings();

  if (!id) {
    window.location.href = 'catalog.html';
    return;
  }

  const product = getProductById(id);
  if (!product) {
    document.querySelector('.product-detail').innerHTML = `
      <div class="container empty-state">
        <p style="font-size:3rem">😕</p>
        <h2>Товар не найден</h2>
        <a href="catalog.html" class="btn btn--primary" style="margin-top:1.5rem">Вернуться в каталог</a>
      </div>`;
    return;
  }

  document.title = `${product.name} — ${settings.companyName}`;

  const gallery = document.getElementById('product-gallery');
  const category = document.getElementById('product-category');
  const title = document.getElementById('product-title');
  const price = document.getElementById('product-price');
  const desc = document.getElementById('product-desc');
  const specs = document.getElementById('product-specs');
  const kaspiBtn = document.getElementById('btn-kaspi');
  const whatsappBtn = document.getElementById('btn-whatsapp');

  if (gallery) {
    gallery.innerHTML = `<img src="${product.image}" alt="${product.name}"
      onerror="this.style.background='linear-gradient(135deg,#8b0018,#c41e3a)'">`;
  }
  if (category) category.textContent = product.categoryLabel;
  if (title) title.textContent = product.name;
  if (price) price.innerHTML = `${formatPrice(product.price)} <span>тенге</span>`;
  if (desc) desc.textContent = product.description;
  if (kaspiBtn) kaspiBtn.href = product.kaspiUrl;
  if (whatsappBtn) whatsappBtn.href = getWhatsAppLink(product, settings);

  if (specs && product.specs) {
    specs.innerHTML = Object.entries(product.specs).map(([k, v]) => `
      <div class="spec-row">
        <span>${k}</span>
        <span>${v}</span>
      </div>
    `).join('');
  }

  // Related products
  const related = document.getElementById('related-products');
  if (related) {
    const relatedProducts = getProducts()
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 3);

    if (relatedProducts.length) {
      related.innerHTML = relatedProducts.map(p => renderProductCard(p, settings)).join('');
    } else {
      related.closest('section').style.display = 'none';
    }
  }
});
