import Link from 'next/link'
import styles from './MiniFooter.module.css'
import { Body, Small } from './Text/Text'

const footerMetaLinks = [
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
]

const MiniFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerShell + ' fluid-container'}>
        <div className="wrapper">
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

export default MiniFooter
