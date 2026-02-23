import { Heading1, Heading4 } from './Text/Text'
import { SearchBar } from './SearchBar'
import styles from './Hero.module.css'
import Button from './Button'

export const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.leftColumn}>
        <Heading1>
          Unlock the door to <br />
          your future.
        </Heading1>
        <Heading4>
          We are a full-service real estate company, and we can help <br />
          you find the perfect place to live.
        </Heading4>
        <div className={styles.buttons}>
          <Button fill="outlined">Explore</Button>
          <Button color="accent">Sign Up</Button>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <SearchBar />
      </div>
    </div>
  )
}
