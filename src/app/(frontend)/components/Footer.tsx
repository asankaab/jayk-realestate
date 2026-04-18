import Image from 'next/image'
import Link from 'next/link'
import styles from './Footer.module.css'
import { Body, Heading4, Small } from './Text/Text'

const buyLinks = [
  { href: '/property-search', label: 'Property Search' },
  { href: '/map-search', label: 'Map Search' },
  { href: '/open-house-search', label: 'Open House Search' },
  { href: '/luxury-homes', label: 'Luxury Homes' },
  { href: '/home-buying-guide', label: 'Home Buying Guide' },
  { href: '/moving-to-the-area', label: 'Moving to the Area' },
  { href: '/buy-vs-rent', label: 'Buy vs. Rent' },
  { href: '/virtual-tours', label: 'Virtual Tours' },
]

const sellLinks = [
  { href: '/home-value-estimate', label: 'Home Value Estimate' },
  { href: '/home-selling-guide', label: 'Home Selling Guide' },
  { href: '/moving-out-of-the-area', label: 'Moving Out of the Area' },
]

const utilityLinks = [
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/dmca-policy', label: 'DMCA Policy' },
  { href: '/terms-of-use', label: 'Terms of Use' },
]

const companyLinks = [
  { href: '/about-us', label: 'About Us' },
  { href: '/corporate-history', label: 'Corporate History' },
  { href: '/offices', label: 'Offices' },
  { href: '/executive-management', label: 'Executive Management' },
  { href: '/careers', label: 'Careers' },
  { href: '/referral-realty', label: 'Referral Realty' },
  { href: '/our-affiliations', label: 'Our Affiliations' },
  { href: '/blog', label: 'Blog' },
]

const footerMetaLinks = [
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
]

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.footerShell} fluid-container`}>
        <div className="wrapper">
          <div className={styles.topGrid}>
            <div className={styles.linkGroups}>
              <div className={styles.linkGroup}>
                <Heading4 className={styles.heading}>Buy</Heading4>
                <ul className={styles.linkList}>
                  {buyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <Heading4 className={styles.heading}>Sell</Heading4>
                <ul className={styles.linkList}>
                  {sellLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>

                <Heading4 className={`${styles.heading} ${styles.headingSecondary}`}>
                  Links
                </Heading4>
                <ul className={styles.linkList}>
                  {utilityLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linkGroup}>
                <Heading4 className={styles.heading}>Company</Heading4>
                <ul className={styles.linkList}>
                  {companyLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.brandPanel}>
              <Body className={styles.description}>
                We’re committed to helping you buy, sell, and invest in property with confidence.
                With expert agents and personalized service, your next move starts here.
              </Body>
              <Link href="/" className={styles.logoWrap} aria-label="JayK home">
                <Image src="/jayk-logo-white.svg" alt="JayK logo" width={418} height={122} />
              </Link>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <div className={styles.bottomRow}>
              <Body className={styles.copyright}>
                © 1994 - 2024 - Jayk Real Estate. All rights reserved.
              </Body>
              <div className={styles.metaLinks}>
                {footerMetaLinks.map((link, index) => (
                  <span key={link.href} className={styles.metaItem}>
                    <Link href={link.href}>
                      <Small>{link.label}</Small>
                    </Link>
                    {index < footerMetaLinks.length - 1 && (
                      <span className={styles.separator}>|</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <Small className={styles.disclaimer}>
              Disclaimer - All property information is deemed reliable but not guaranteed. Buyers
              and sellers are advised to verify independently.
            </Small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
