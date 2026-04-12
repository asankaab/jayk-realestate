import { Building2, Home, LandPlot, Store } from 'lucide-react'
import { Heading1, Heading4, Small } from './Text/Text'
import { SearchBar } from './SearchBar'
import styles from './Hero.module.css'
import Button from './Button'

export const Hero = () => {
  return (
    <div className={styles.heroContainer + ' fluid-container'}>
      <div className={styles.hero + ' wrapper'}>
        <div className={styles.leftColumn}>
          <Heading1>Unlock the door to your future.</Heading1>
          <Heading4>
            We are a full-service real estate company, and we can help you find the perfect place to
            live.
          </Heading4>
          <div className={styles.buttons}>
            <Button href="properties" fill="outlined">
              Explore
            </Button>
            <Button href="signup" color="accent">
              Sign Up
            </Button>
          </div>
        </div>
        <div className={styles.rightColumn}>
          <div className={styles.propertyTypes}>
            <div className={styles.propertyTypeBoxes}>
              <div className={styles.propertyTypeBox}>
                <Home />
                <Small>Houses</Small>
              </div>
              <div className={styles.propertyTypeBox}>
                <LandPlot />
                <Small>Lands</Small>
              </div>
              <div className={styles.propertyTypeBox}>
                <Building2 />
                <Small>Offices</Small>
              </div>
              <div className={styles.propertyTypeBox}>
                <Store />
                <Small>Stores</Small>
              </div>
            </div>
          </div>
          <SearchBar />
        </div>
      </div>
    </div>
  )
}
