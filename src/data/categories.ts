import type { Category } from '../types/category'
import { placeholderImages } from './images'

export const defaultCategories: Category[] = [
  {
    id: 'swedish-walls',
    name: 'Шведские стенки',
    slug: 'swedish-walls',
    description:
      'Многофункциональные шведские стенки для силовых тренировок, растяжки и детского спорта дома.',
    image: placeholderImages.swedishWall,
    priceFrom: 74990,
  },
  {
    id: 'pull-up-bars',
    name: 'Турники',
    slug: 'pull-up-bars',
    description:
      'Настенные и наддверные турники для подтягиваний и функциональных тренировок.',
    image: placeholderImages.pullUpBar,
    priceFrom: 24990,
  },
  {
    id: 'parallel-bars',
    name: 'Брусья',
    slug: 'parallel-bars',
    description:
      'Настенные брусья для отжиманий, работы с собственным весом и развития верхней части тела.',
    image: placeholderImages.parallelBars,
    priceFrom: 29990,
  },
  {
    id: 'crossbars',
    name: 'Перекладины',
    slug: 'crossbars',
    description:
      'Перекладины и дополнительные снаряды для расширения возможностей домашнего спортзала.',
    image: placeholderImages.crossbar,
    priceFrom: 14990,
  },
  {
    id: 'complexes-3in1',
    name: 'Комплексы 3-в-1',
    slug: 'complexes-3in1',
    description:
      'Универсальные комплексы: турник, брусья и пресс-брусья в одной конструкции.',
    image: placeholderImages.complex3in1,
    priceFrom: 39990,
  },
  {
    id: 'accessories',
    name: 'Аксессуары',
    slug: 'accessories',
    description:
      'Боксёрские мешки, тарзанки и дополнительное оборудование для домашних тренировок.',
    image: placeholderImages.accessories,
    priceFrom: 19990,
  },
  {
    id: 'skami',
    name: 'Скамьи',
    slug: 'skami',
    description: 'Скамьи для жима, пресса и силовых тренировок дома.',
    image: placeholderImages.product,
    priceFrom: 34900,
  },
  {
    id: 'supports',
    name: 'Упоры',
    slug: 'supports',
    description: 'Упоры для пресса и функциональных тренировок.',
    image: placeholderImages.crossbar,
    priceFrom: 9900,
  },
]
