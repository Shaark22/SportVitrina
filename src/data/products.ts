import type { Product } from '../types/product'
import { getCategoryImage } from './images'

export const defaultProducts: Product[] = [
  {
    id: 'sportking-ljuks-belyi',
    name: 'Шведская стенка SportKing Люкс белый',
    slug: 'sportking-ljuks-belyi',
    category: 'swedish-walls',
    description:
      'Премиальная шведская стенка SportKing Люкс — надёжная металлическая конструкция для ежедневных домашних тренировок. Подходит для взрослых и детей.',
    price: 89990,
    image: getCategoryImage('swedish-walls'),
    rating: 4.9,
    reviewsCount: 105,
    badge: 'ХИТ',
    features: [
      'Прочная металлическая конструкция',
      'Многофункциональное оборудование',
      'Для домашних тренировок',
      'Белый цвет — современный интерьер',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-ljuks-belyi-118675315/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-ljuks-seryi',
    name: 'Шведская стенка SportKing Люкс белый (серый)',
    slug: 'sportking-ljuks-seryi',
    category: 'swedish-walls',
    description:
      'Шведская стенка SportKing Люкс в светло-сером исполнении. Универсальное решение для квартиры или частного дома.',
    price: 89990,
    image: getCategoryImage('swedish-walls'),
    rating: 4.8,
    reviewsCount: 14,
    badge: 'ХИТ',
    features: [
      'Усиленная рама',
      'Подходит для регулярных нагрузок',
      'Компактная установка у стены',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-ljuks-belyi-seryi--160499654/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-lait',
    name: 'Шведская стенка SportKing Лайт',
    slug: 'sportking-lait',
    category: 'swedish-walls',
    description:
      'Компактная шведская стенка SportKing Лайт — оптимальный выбор для небольших помещений и детских тренировок.',
    price: 74990,
    image: getCategoryImage('swedish-walls'),
    rating: 4.7,
    reviewsCount: 85,
    features: [
      'Лёгкая установка',
      'Компактные габариты',
      'Для детей и взрослых',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-lait-belyi-seryi--113759298/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-3v1-usilennyi-belyi',
    name: 'Турник 3 в 1 SportKing усиленный белый',
    slug: 'sportking-3v1-usilennyi-belyi',
    category: 'complexes-3in1',
    description:
      'Усиленный турник 3 в 1: подтягивания, брусья и пресс. Надёжная конструкция для интенсивных домашних тренировок.',
    price: 54990,
    image: getCategoryImage('complexes-3in1'),
    rating: 4.9,
    reviewsCount: 187,
    badge: 'ХИТ',
    features: [
      'Турник + брусья + пресс',
      'Усиленная рама',
      'Белый цвет',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-3-v-1-usilennyi-belyi-104370776/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-3v1-usilennyi-chernyi',
    name: 'Турник 3 в 1 SportKing усиленный чёрный',
    slug: 'sportking-3v1-usilennyi-chernyi',
    category: 'complexes-3in1',
    description:
      'Чёрный усиленный комплекс 3 в 1 для полноценных силовых тренировок дома. Выдерживает регулярные нагрузки.',
    price: 54990,
    image: getCategoryImage('complexes-3in1'),
    rating: 4.8,
    reviewsCount: 109,
    features: [
      'Три тренировочные зоны',
      'Усиленная конструкция',
      'Чёрный матовый цвет',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-3v1-usilennyi-chernyi-104370777/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-3v1-multihvat-belyi',
    name: 'Турник 3 в 1 SportKing Мультихват белый',
    slug: 'sportking-3v1-multihvat-belyi',
    category: 'complexes-3in1',
    description:
      'Турник с несколькими хватами для разнообразных подтягиваний. Комплекс 3 в 1 для функционального тренинга.',
    price: 49990,
    image: getCategoryImage('complexes-3in1'),
    rating: 4.9,
    reviewsCount: 131,
    badge: 'НОВИНКА',
    features: [
      'Несколько вариантов хвата',
      'Турник, брусья, пресс',
      'Для домашнего зала',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-3v1-mul-tihvat-belyi--104370774/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-3v1-multihvat-chernyi',
    name: 'Турник 3 в 1 SportKing Мультихват чёрный',
    slug: 'sportking-3v1-multihvat-chernyi',
    category: 'complexes-3in1',
    description:
      'Мультихват 3 в 1 в чёрном исполнении. Разнообразные хваты для проработки всех групп мышц спины и рук.',
    price: 49990,
    image: getCategoryImage('complexes-3in1'),
    rating: 4.8,
    reviewsCount: 48,
    features: [
      'Мультихватовая перекладина',
      'Комплекс 3 в 1',
      'Чёрный цвет',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-3v1-mul-tihvat-chernyi--113121253/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-m-10',
    name: 'Турник настенный SportKing M-10 белый',
    slug: 'sportking-m-10',
    category: 'pull-up-bars',
    description:
      'Настенный турник M-10 — компактное решение для подтягиваний в квартире. Простая установка, надёжная фиксация.',
    price: 29990,
    image: getCategoryImage('pull-up-bars'),
    rating: 4.7,
    reviewsCount: 16,
    features: [
      'Настенный монтаж',
      'Компактный размер',
      'Белый цвет',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-m-10-belyi-160000080/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-m-11',
    name: 'Турник настенный SportKing M-11 чёрный',
    slug: 'sportking-m-11',
    category: 'pull-up-bars',
    description:
      'Настенный турник M-11 «Мультихват» — несколько вариантов хвата для эффективных домашних тренировок.',
    price: 34990,
    image: getCategoryImage('pull-up-bars'),
    rating: 4.8,
    reviewsCount: 47,
    badge: 'ХИТ',
    features: [
      'Мультихватовая перекладина',
      'Настенная установка',
      'Чёрный цвет',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-m-11-chernyi-110479215/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-complex-03',
    name: 'Спортивно-игровой комплекс SportKing 03',
    slug: 'sportking-complex-03',
    category: 'swedish-walls',
    description:
      'Спортивно-игровой комплекс 90×56×220 см — шведская стенка с дополнительными элементами для детей и взрослых.',
    price: 119990,
    image: getCategoryImage('swedish-walls'),
    rating: 4.8,
    reviewsCount: 43,
    badge: 'НОВИНКА',
    features: [
      'Размер 90×56×220 см',
      'Для детей и взрослых',
      'Многофункциональный комплекс',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportivno-igrovoi-kompleks-sportking-03-90x56x220-sm-118114006/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-ljuks-sinii',
    name: 'Шведская стенка SportKing Люкс синий',
    slug: 'sportking-ljuks-sinii',
    category: 'swedish-walls',
    description:
      'Шведская стенка SportKing Люкс в синем цвете. Яркий акцент для детской или спортивной зоны дома.',
    price: 89990,
    image: getCategoryImage('swedish-walls'),
    rating: 4.7,
    reviewsCount: 22,
    features: [
      'Синий цвет',
      'Усиленная конструкция',
      'Для домашних тренировок',
    ],
    kaspiUrl:
      'https://kaspi.kz/shop/p/sportking-ljuks-sinii-118229001/?c=750000000&m=444052',
    inStock: true,
  },
  {
    id: 'sportking-boxing-bag',
    name: 'Боксёрский мешок SportKing',
    slug: 'sportking-boxing-bag',
    category: 'accessories',
    description:
      'Боксёрский мешок SportKing для кардио и силовых тренировок дома. Прочный материал, удобное крепление.',
    price: 24990,
    image: getCategoryImage('accessories'),
    rating: 4.6,
    reviewsCount: 18,
    features: [
      'Для бокса и фитнеса',
      'Прочное крепление',
      'Компактно для дома',
    ],
    kaspiUrl: 'https://kaspi.kz/shop/search/?q=:allMerchants:444052',
    inStock: true,
  },
]
