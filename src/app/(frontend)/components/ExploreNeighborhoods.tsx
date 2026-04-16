'use client'
import React from 'react'
import Button from './Button'
import styles from './ExploreNeighborhoods.module.css'
import { Play } from 'lucide-react'
import { Heading2, Body } from './Text/Text'
import Image from 'next/image'

interface ExploreNeighborhoodsProps {
  featured?: {
    image?: string
    video?: string
    title: string
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
            <Heading2 className={styles.title}>Explore Our Neighborhoods</Heading2>
            <Body className={styles.description}>
              Tempor massa donec adipiscing egestas. Pretium facilisis massa tempor blandit eu
              curatitur orci risus. Justo lectus gravida aliquet non viverra egestas. Facilisi lorem
              eros arcu laoreet sagittis faucibus quisque fringilla. Egestas dignissim ipsum.
            </Body>
            <Button href="/properties" className={styles.ctaButton}>
              Explore
            </Button>
          </div>

          <div className={styles.mediaContent}>
            <div className={styles.mediaContainer}>
              {featured?.image && (
                <Image src={featured.image} alt={featured.title} className={styles.mediaImage} />
              )}

              <video
                width="640"
                height="360"
                controls
                disablePictureInPicture
                loading="lazy"
                loop
                preload="metadata"
              >
                <source
                  src="https://cdn.pixabay.com/video/2023/04/22/160065-820183310_medium.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

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
