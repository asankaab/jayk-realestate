import { Heading1 } from './Text/Text'
import { SearchBar } from './SearchBar'
import styles from './Hero.module.css'

export const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <Heading1>Find your dream home</Heading1>
        <SearchBar />
      </div>
    </div>
  )
}
