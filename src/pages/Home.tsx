import { usePageMeta } from '../hooks/usePageMeta'
import { Hero } from '../components/sections/Hero'
import { Benefits } from '../components/sections/Benefits'
import { Categories } from '../components/sections/Categories'
import { PopularProducts } from '../components/sections/PopularProducts'
import { CTASection } from '../components/sections/CTASection'
import { siteConfig } from '../data/site'

export function Home() {
  usePageMeta({
    title: 'SPORT KING — Спортивное оборудование для дома',
    description: siteConfig.description,
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
