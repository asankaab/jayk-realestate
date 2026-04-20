import { Hero } from './components/sections/Hero'
import { Sponsors } from './components/sections/Sponsors'
import { ExploreNeighborhoods } from './components/sections/ExploreNeighborhoods'
import { Blog } from './components/sections/Blog'
import RealtorDetails from './components/sections/RealtorDetails'
import { RecentListings } from './components/sections/RecentListings'
import { FAQ } from './components/sections/FAQ'

export default async function HomePage() {
  return (
    <div className="home">
      <Hero />
      <RecentListings />
      <ExploreNeighborhoods />
      <Blog />
      <RealtorDetails />
      <FAQ />
      <Sponsors />
    </div>
  )
}
