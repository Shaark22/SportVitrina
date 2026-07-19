import { usePageMeta } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'

import { Hero } from '../components/sections/Hero'
import { Benefits } from '../components/sections/Benefits'
import { Categories } from '../components/sections/Categories'
import { PopularProducts } from '../components/sections/PopularProducts'
import { CTASection } from '../components/sections/CTASection'

export function Home() {
  const { siteSettings } = useData()

  usePageMeta({
    title: 'SPORT KING — Спортивное оборудование для дома',
    description: siteSettings.description,
  })

  return (
    <>
      <Hero />
      <Benefits />
      <Categories />
      <PopularProducts />
      <CTASection />
    </>
  )
}
