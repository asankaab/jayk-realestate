import { Hero } from './components/Hero'
import { ExploreNeighborhoods } from './components/ExploreNeighborhoods'
import { Blog } from './components/Blog'
import RealtorDetails from './components/RealtorDetails'
import { RecentListings } from './components/RecentListings'
import { FAQ } from './components/FAQ'

export default async function HomePage() {
  return (
    <div className="home">
      <Hero />
      <RecentListings />
      <ExploreNeighborhoods />
      <Blog />
      <RealtorDetails />
      <FAQ />
    </div>
  )
}
