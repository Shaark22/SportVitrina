const ADMIN_SESSION = 'sport_vitrina_admin_session';

document.addEventListener('DOMContentLoaded', () => {
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  if (sessionStorage.getItem(ADMIN_SESSION) === 'true') {
    showAdmin();
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    const settings = getSettings();

    if (password === settings.adminPassword) {
      sessionStorage.setItem(ADMIN_SESSION, 'true');
      showAdmin();
    } else {
      const err = document.getElementById('login-error');
      if (err) {
        err.textContent = 'Неверный пароль';
        err.style.color = '#ef4444';
      }
    }
  });

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem(ADMIN_SESSION);
    location.reload();
  });

  function showAdmin() {
    if (loginView) loginView.style.display = 'none';
    if (adminView) adminView.style.display = 'block';
    initAdmin();
  }
});

function initAdmin() {
  let currentView = 'products';
  let editingId = null;

  const navBtns = document.querySelectorAll('[data-admin-nav]');
  const views = {
    products: document.getElementById('view-products'),
    add: document.getElementById('view-add'),
    settings: document.getElementById('view-settings')
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.adminNav;
      navBtns.forEach(b => b.classList.toggle('active', b === btn));
      Object.entries(views).forEach(([key, el]) => {
        if (el) el.style.display = key === currentView ? 'block' : 'none';
      });
      if (currentView === 'products') renderProductsTable();
      if (currentView === 'settings') renderSettingsForm();
    });
  });

  document.getElementById('btn-add-product')?.addEventListener('click', () => {
    editingId = null;
    resetProductForm();
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.adminNav === 'add'));
    Object.entries(views).forEach(([key, el]) => {
      if (el) el.style.display = key === 'add' ? 'block' : 'none';
    });
    document.getElementById('form-title').textContent = 'Добавить товар';
  });

  document.getElementById('product-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProductFromForm();
  });

  document.getElementById('settings-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSettingsFromForm();
  });

  document.getElementById('btn-reset-products')?.addEventListener('click', () => {
    if (confirm('Сбросить все товары к демо-данным?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderProductsTable();
      alert('Товары сброшены!');
    }
  });

  renderProductsTable();

  function renderProductsTable() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;

    const products = getProducts();
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:8px"></td>
        <td><strong>${p.name}</strong></td>
        <td>${p.categoryLabel}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.featured ? '⭐' : '—'}</td>
        <td>
          <div class="admin-actions">
            <button class="btn--edit" onclick="editProduct('${p.id}')">Изменить</button>
            <button class="btn--danger" onclick="deleteProduct('${p.id}')">Удалить</button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function resetProductForm() {
    const form = document.getElementById('product-form');
    form?.reset();
    document.getElementById('product-id').value = '';
  }

  function saveProductFromForm() {
    const products = getProducts();
    const id = document.getElementById('product-id').value || Date.now().toString();

    const product = {
      id,
      name: document.getElementById('product-name').value,
      category: document.getElementById('product-category').value,
      categoryLabel: document.getElementById('product-category').selectedOptions[0].text,
      price: parseInt(document.getElementById('product-price').value, 10),
      description: document.getElementById('product-description').value,
      image: document.getElementById('product-image').value,
      kaspiUrl: document.getElementById('product-kaspi').value,
      featured: document.getElementById('product-featured').checked,
      specs: {
        'Характеристика 1': document.getElementById('product-spec1').value || '—',
        'Характеристика 2': document.getElementById('product-spec2').value || '—',
        'Характеристика 3': document.getElementById('product-spec3').value || '—'
      }
    };

    const idx = products.findIndex(p => p.id === id);
    if (idx >= 0) {
      products[idx] = product;
    } else {
      products.push(product);
    }

    saveProducts(products);
    alert('Товар сохранён!');
    editingId = null;
    resetProductForm();

    document.querySelector('[data-admin-nav="products"]')?.click();
  }

  function renderSettingsForm() {
    const s = getSettings();
    document.getElementById('settings-company').value = s.companyName;
    document.getElementById('settings-phone').value = s.phone;
    document.getElementById('settings-whatsapp').value = s.whatsapp;
    document.getElementById('settings-address').value = s.address;
    document.getElementById('settings-kaspi').value = s.kaspiShopUrl;
    document.getElementById('settings-password').value = s.adminPassword;
  }

  function saveSettingsFromForm() {
    const settings = {
      companyName: document.getElementById('settings-company').value,
      phone: document.getElementById('settings-phone').value,
      whatsapp: document.getElementById('settings-whatsapp').value,
      address: document.getElementById('settings-address').value,
      kaspiShopUrl: document.getElementById('settings-kaspi').value,
      adminPassword: document.getElementById('settings-password').value
    };
    saveSettings(settings);
    alert('Настройки сохранены!');
    initHeader();
    initFooter();
  }

  window.editProduct = function(id) {
    const product = getProductById(id);
    if (!product) return;

    editingId = id;
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-kaspi').value = product.kaspiUrl;
    document.getElementById('product-featured').checked = product.featured;

    const specs = product.specs ? Object.values(product.specs) : ['', '', ''];
    document.getElementById('product-spec1').value = specs[0] || '';
    document.getElementById('product-spec2').value = specs[1] || '';
    document.getElementById('product-spec3').value = specs[2] || '';

    document.getElementById('form-title').textContent = 'Редактировать товар';

    document.querySelectorAll('[data-admin-nav]').forEach(b => {
      b.classList.toggle('active', b.dataset.adminNav === 'add');
    });
    Object.entries(views).forEach(([key, el]) => {
      if (el) el.style.display = key === 'add' ? 'block' : 'none';
    });
  };

  window.deleteProduct = function(id) {
    if (!confirm('Удалить этот товар?')) return;
    const products = getProducts().filter(p => p.id !== id);
    saveProducts(products);
    renderProductsTable();
  };
}
