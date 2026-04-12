'use client'
import React from 'react'
import Button from './Button'
import styles from './ExploreNeighborhoods.module.css'
import { Play } from 'lucide-react'

interface ExploreNeighborhoodsProps {
  featured?: {
    image?: string
    video?: string
    title?: string
  }
}

export const ExploreNeighborhoods: React.FC<ExploreNeighborhoodsProps> = ({
  featured = {
    image: undefined,
    video: undefined,
    title: 'Neighborhoods Overview',
  },
}) => {
  return (
    <section className={styles.exploreSectionContainer + ' fluid-container'}>
      <div className={`wrapper ${styles.sectionContent}`}>
        <div className={styles.contentWrapper}>
          <div className={styles.textContent}>
            <h2 className={styles.title}>Explore Our Neighborhoods</h2>
            <p className={styles.description}>
              Tempor massa donec adipiscing egestas. Pretium facilisis massa tempor blandit eu
              curatitur orci risus. Justo lectus gravida aliquet non viverra egestas. Facilisi lorem
              eros arcu laoreet sagittis faucibus quisque fringilla. Egestas dignissim ipsum.
            </p>
            <Button className={styles.ctaButton}>Explore</Button>
          </div>

          <div className={styles.mediaContent}>
            <div className={styles.mediaContainer}>
              {featured?.image && (
                <img src={featured.image} alt={featured.title} className={styles.mediaImage} />
              )}
              {featured?.video && (
                <video
                  src={featured.video}
                  className={styles.mediaImage}
                  controls
                  poster={featured.image}
                />
              )}
              {!featured?.image && !featured?.video && (
                <div className={styles.mediaPlaceholder}>
                  <div className={styles.playButton}>
                    <Play fill="currentColor" />
                  </div>
                </div>
              )}
              {(featured?.image || featured?.video) && (
                <div className={styles.playOverlay}>
                  <div className={styles.playButton}>
                    <Play fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
