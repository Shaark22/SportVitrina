const STORAGE_KEY = 'sport_vitrina_products';
const SETTINGS_KEY = 'sport_vitrina_settings';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Турник настенный PRO',
    category: 'tourniki',
    categoryLabel: 'Турники',
    price: 24990,
    description: 'Профессиональный настенный турник для домашних тренировок. Выдерживает до 150 кг, компактная установка, антискользящее покрытие рук.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: true,
    specs: { 'Макс. нагрузка': '150 кг', 'Материал': 'Сталь', 'Крепление': 'Настенное' }
  },
  {
    id: '2',
    name: 'Турник в дверной проём',
    category: 'tourniki',
    categoryLabel: 'Турники',
    price: 18990,
    description: 'Универсальный турник-эспандер для дверного проёма. Не требует сверления, быстрый монтаж за 2 минуты.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: true,
    specs: { 'Макс. нагрузка': '120 кг', 'Монтаж': 'Без сверления', 'Ширина': '62–100 см' }
  },
  {
    id: '3',
    name: 'Брусья параллельные',
    category: 'brusya',
    categoryLabel: 'Брусья',
    price: 45990,
    description: 'Напольные параллельные брусья для отжиманий, подтягиваний и L-sit. Регулируемая ширина, стальная рама.',
    image: 'https://images.unsplash.com/photo-1599058945522-28d584b6f5ff?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: true,
    specs: { 'Макс. нагрузка': '200 кг', 'Высота': '110 см', 'Ширина': 'Регулируемая' }
  },
  {
    id: '4',
    name: 'Скамья для жима',
    category: 'lavochki',
    categoryLabel: 'Скамьи',
    price: 52990,
    description: 'Многофункциональная скамья для жима и гиперэкстензии. 7 положений спинки, складная конструкция.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: false,
    specs: { 'Макс. нагрузка': '250 кг', 'Положений': '7', 'Складная': 'Да' }
  },
  {
    id: '5',
    name: 'Скамья прямая',
    category: 'lavochki',
    categoryLabel: 'Скамьи',
    price: 32990,
    description: 'Классическая прямая скамья для силовых тренировок. Устойчивая стальная рама, мягкая обивка.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: false,
    specs: { 'Макс. нагрузка': '300 кг', 'Длина': '140 см', 'Обивка': 'Эко-кожа' }
  },
  {
    id: '6',
    name: 'Шведская стенка',
    category: 'stoyki',
    categoryLabel: 'Стойки',
    price: 68990,
    description: 'Шведская стенка с турником и брусьями — полноценный домашний спорткомплекс для всей семьи.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: true,
    specs: { 'Высота': '220 см', 'Ширина': '80 см', 'Комплектация': 'Турник + брусья' }
  },
  {
    id: '7',
    name: 'Стойка для приседаний',
    category: 'stoyki',
    categoryLabel: 'Стойки',
    price: 89990,
    description: 'Силовая стойка для приседаний и жима. Страховочные стойки, J-крюки, усиленная база.',
    image: 'https://images.unsplash.com/photo-1434682881348-9858980d672d?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: false,
    specs: { 'Макс. нагрузка': '350 кг', 'Высота': '220 см', 'J-крюки': 'В комплекте' }
  },
  {
    id: '8',
    name: 'Набор гантелей 20 кг',
    category: 'aksessuary',
    categoryLabel: 'Аксессуары',
    price: 15990,
    description: 'Разборные гантели с набором дисков. Компактное хранение, быстрая смена веса.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&h=450&fit=crop',
    kaspiUrl: 'https://kaspi.kz/shop',
    featured: false,
    specs: { 'Макс. вес': '20 кг (пара)', 'Тип': 'Разборные', 'Диски': '4×2.5 кг' }
  }
];

const DEFAULT_SETTINGS = {
  companyName: 'IRON HOME',
  tagline: 'Спортивный инвентарь для дома',
  phone: '+7 (777) 123-45-67',
  whatsapp: '77771234567',
  kaspiShopUrl: 'https://kaspi.kz/shop',
  address: 'г. Алматы, Казахстан',
  adminPassword: 'admin123'
};

const CATEGORIES = [
  { id: 'all', label: 'Все товары', icon: '🏋️' },
  { id: 'tourniki', label: 'Турники', icon: '💪' },
  { id: 'brusya', label: 'Брусья', icon: '🤸' },
  { id: 'lavochki', label: 'Скамьи', icon: '🛋️' },
  { id: 'stoyki', label: 'Стойки', icon: '🏗️' },
  { id: 'aksessuary', label: 'Аксессуары', icon: '⚙️' }
];

function getProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function getSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch (e) { /* ignore */ }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function formatPrice(price) {
  return new Intl.NumberFormat('ru-KZ').format(price) + ' ₸';
}

function getWhatsAppLink(product, settings) {
  const text = encodeURIComponent(
    `Здравствуйте! Интересует товар: ${product.name} (${formatPrice(product.price)}). Подскажите, пожалуйста, наличие и условия доставки.`
  );
  return `https://wa.me/${settings.whatsapp}?text=${text}`;
}

function getProductById(id) {
  return getProducts().find(p => p.id === id);
}

function renderProductCard(product, settings) {
  const badge = product.featured ? '<span class="product-card__badge">Хит</span>' : '';
  return `
    <article class="product-card" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="product-card__image">
        ${badge}
        <img src="${product.image}" alt="${product.name}" loading="lazy"
             onerror="this.src='data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23f5f5f5' width='400' height='300'/><text x='50%' y='50%' text-anchor='middle' fill='%23c41e3a' font-size='24' font-family='sans-serif'>${product.categoryLabel}</text></svg>`)}'">
      </a>
      <div class="product-card__body">
        <div class="product-card__category">${product.categoryLabel}</div>
        <h3 class="product-card__title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <p class="product-card__desc">${product.description}</p>
        <div class="product-card__footer">
          <div class="product-card__price">${formatPrice(product.price)}</div>
        </div>
        <div class="product-card__actions">
          <a href="${product.kaspiUrl}" target="_blank" rel="noopener" class="btn btn--kaspi btn--sm">
            🛒 Kaspi
          </a>
          <a href="${getWhatsAppLink(product, settings)}" target="_blank" rel="noopener" class="btn btn--whatsapp btn--sm">
            💬 Написать
          </a>
        </div>
      </div>
    </article>
  `;
}

function initHeader() {
  const settings = getSettings();
  const header = document.querySelector('.header');
  const logoText = document.querySelector('.logo__text');
  const phoneEl = document.querySelector('.header__phone');

  if (logoText) {
    const parts = settings.companyName.split(' ');
    logoText.innerHTML = parts.length > 1
      ? `${parts[0]} <span>${parts.slice(1).join(' ')}</span>`
      : `<span>${settings.companyName}</span>`;
  }
  if (phoneEl) phoneEl.textContent = settings.phone;

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 20);
  });

  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  burger?.addEventListener('click', () => {
    mobileNav?.classList.toggle('open');
  });
}

function initFooter() {
  const settings = getSettings();
  const year = document.getElementById('footer-year');
  if (year) year.textContent = new Date().getFullYear();

  const companyEls = document.querySelectorAll('[data-company]');
  companyEls.forEach(el => { el.textContent = settings.companyName; });

  const phoneEls = document.querySelectorAll('[data-phone]');
  phoneEls.forEach(el => { el.textContent = settings.phone; });

  const addressEl = document.querySelector('[data-address]');
  if (addressEl) addressEl.textContent = settings.address;
}

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initFooter();
});
