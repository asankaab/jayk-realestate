'use client'
import React from 'react'
import Image from 'next/image'
import { SectionTitle } from './Text/Text'
import styles from './Sponsors.module.css'

const sponsorsList = [
  { src: '/brands/brand-logo-01.svg', alt: 'Sponsor 1' },
  { src: '/brands/brand-logo-02.svg', alt: 'Sponsor 2' },
  { src: '/brands/brand-logo-03.svg', alt: 'Sponsor 3' },
  { src: '/brands/brand-logo-05.svg', alt: 'Sponsor 5' },
  { src: '/brands/brand-logo-06.svg', alt: 'Sponsor 6' },
  { src: '/brands/brand-logo-04.svg', alt: 'Sponsor 4' },
]

export const Sponsors = () => {
  return (
    <section className={styles.sponsorsSection}>
      <div className="wrapper">
        <SectionTitle>Our Sponsors & Partners</SectionTitle>
        <div className={styles.logoContainer}>
          {sponsorsList.map((sponsor, index) => (
            <div key={index} className={styles.logoItem}>
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={120}
                height={60}
                className={styles.logoImage}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
