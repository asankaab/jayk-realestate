import styles from './RealtorDetails.module.css'
import { Body, Heading2, Heading4, SectionTitle } from './Text/Text'
import Button from './Button'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function RealtorDetails() {
  return (
    <section>
      <div className="wrapper">
        <div className={styles.header}>
          <SectionTitle>Realtor Details</SectionTitle>
        </div>
        <div className={styles.content}>
          {/* Left Column - Bio */}
          <div className={styles.bioColumn}>
            <div className={styles.profileHeader}>
              <Image
                width={100}
                height={100}
                src="/avatar.jpeg" // Update with actual image path
                alt="Jay"
                className={styles.profileImage}
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className={styles.profileInfo}>
                <Heading2 className={styles.name}>Jay Konell</Heading2>
                <Heading4 className={styles.role}>FULL-TIME REALTOR</Heading4>
              </div>
            </div>
            <div className={styles.bioBody}>
              <Body>
                My real estate experience includes previous investments in and owning rental
                properties as a landlord. I also have purchased, remodeled, marketed, and re-sold
                properties prior to joining Mixed Realty. Military life has given me a great,
                first-hand understanding of the difficulties associated with moving from city to
                city, state to state, and even country to country.
              </Body>
              <br />
              <Body>
                With Mixed Realty's world-wide network of realtors and cutting-edge,
                industry-leading technology, I can help you sell your current home or assist you in
                buying your next home.
              </Body>
              <Link href="/about-us" className={styles.readMore}>
                Read More <ArrowRight size={16} className={styles.arrow} />
              </Link>
            </div>
          </div>
          {/* Right Column - Contact Card */}
          <div className={styles.cardColumn}>
            <div className={styles.contactCard}>
              <div className={styles.cardBlock}>
                <Body>REALTOR</Body>
                <Body>
                  U.S. Military on the Move
                  <br />
                  Certified Military Specialist
                </Body>
              </div>
              <hr className={styles.divider} />
              <div className={styles.cardBlock}>
                <Body>Orlando SW Office</Body>
                <Body>Mixed Realty Corp. REALTORS</Body>
              </div>
              <Body>(407)1234567</Body>
              <div className={styles.cardFooter}>
                <Button href="/contact">Contact</Button>
                <div className={styles.socialIcons}>
                  {/* Replace with actual SVG components or icons */}
                  <img src="/icons/facebook.svg" alt="Facebook" className={styles.icon} />
                  <img src="/icons/instagram.svg" alt="Instagram" className={styles.icon} />
                  <img src="/icons/linkedin.svg" alt="LinkedIn" className={styles.icon} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
