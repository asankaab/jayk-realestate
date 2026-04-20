import Image from 'next/image'
import Link from 'next/link'
import { Body, Heading1, Heading2, Heading4 } from '@/app/(frontend)/components/Text/Text'
import Button from '@/app/(frontend)/components/Button'
import styles from './AboutUsPage.module.css'

export default function AboutUsPage() {
  return (
    <div className={styles.aboutPage}>
      <div className={`wrapper ${styles.contentWrapper}`}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>Our Company</span>
          <Heading1>Dedicated to finding your perfect home</Heading1>
          <Body className={styles.pageDescription}>
            At Mixed Realty, we believe that finding a home is more than just a transaction. It's
            about discovering a place where memories are made and futures are built.
          </Body>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.storySection}>
            <Image
              src="/hero-background.jpg"
              alt="Beautiful house exterior"
              width={800}
              height={400}
              className={styles.storyImage}
              priority
            />

            <div className={styles.storyText}>
              <Heading2>Our Story</Heading2>
              <Body>
                Mixed Realty was founded with a single mission: to provide an unparalleled real
                estate experience through expertise, cutting-edge technology, and a deep
                understanding of our clients' needs. Whether you're a first-time homebuyer, a
                seasoned investor, or looking to sell your current property, our world-class network
                is here to guide you.
              </Body>
              <Body>
                My personal real estate journey includes investments in rental properties,
                landlording, and remodeling homes. Prior to joining Mixed Realty, I experienced
                firsthand the challenges of relocating — from city to city, and even across borders,
                during my time in the military. This unique perspective allows me to better serve
                families and individuals navigating complex transitions.
              </Body>
              <Body>
                Today, we combine local market expertise with industry-leading technology to ensure
                that your real estate journey is seamless, transparent, and successful.
              </Body>
            </div>

            <div className={styles.statsSection}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15+</span>
                <span className={styles.statLabel}>Years Experience</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>$50M+</span>
                <span className={styles.statLabel}>Properties Sold</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>250+</span>
                <span className={styles.statLabel}>Happy Families</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>5★</span>
                <span className={styles.statLabel}>Average Rating</span>
              </div>
            </div>
          </div>

          <aside className={styles.contactCardWrapper}>
            <div className={styles.contactCard}>
              <div className={styles.profileInfo}>
                <Image
                  width={80}
                  height={80}
                  src="/avatar.jpeg"
                  alt="Jay Konell"
                  className={styles.profileImage}
                />
                <div className={styles.profileDetails}>
                  <Heading4 className={styles.name}>Jay Konell</Heading4>
                  <span className={styles.role}>FULL-TIME REALTOR</span>
                </div>
              </div>

              <div className={styles.contactDetails}>
                <div className={styles.contactBlock}>
                  <strong>Certifications</strong>
                  <p>U.S. Military on the Move</p>
                  <p>Certified Military Specialist</p>
                </div>

                <div className={styles.contactBlock}>
                  <strong>Office</strong>
                  <p>Orlando SW Office</p>
                  <p>Mixed Realty Corp. REALTORS</p>
                </div>

                <div className={styles.contactBlock}>
                  <strong>Phone</strong>
                  <p>(407) 123-4567</p>
                </div>
              </div>

              <Button href="/contact" color="accent" className={styles.contactButton}>
                Get in Touch
              </Button>

              <div className={styles.socialIcons}>
                <img src="/icons/facebook.svg" alt="Facebook" className={styles.icon} />
                <img src="/icons/instagram.svg" alt="Instagram" className={styles.icon} />
                <img src="/icons/linkedin.svg" alt="LinkedIn" className={styles.icon} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
