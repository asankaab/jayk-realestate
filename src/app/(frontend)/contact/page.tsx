import { Body, Heading1 } from '@/app/(frontend)/components/Text/Text'
import { ContactForm } from './ContactForm'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <div className={styles.contactPage}>
      <div className={`wrapper ${styles.contentWrapper}`}>
        <header className={styles.pageHeader}>
          <span className={styles.eyebrow}>Contact Us</span>
          <Heading1>Let's start the conversation</Heading1>
          <Body className={styles.pageDescription}>
            Whether you're looking to buy, sell, or just have a question about the market, 
            our team is ready to provide the answers and support you need.
          </Body>
        </header>

        <div className={styles.mainContent}>
          <aside className={styles.contactInfoSection}>
            <div className={styles.infoCard}>
              <div className={styles.infoBlock}>
                <span className={styles.infoBlockTitle}>Office</span>
                <p className={styles.infoBlockText}>
                  Mixed Realty Corp. REALTORS<br />
                  1234 Commerce Dr, Suite 200<br />
                  Orlando, FL 32801
                </p>
              </div>

              <div className={styles.infoBlock}>
                <span className={styles.infoBlockTitle}>Contact Info</span>
                <p className={styles.infoBlockText}>
                  <strong>Phone:</strong> <a href="tel:+14071234567" className={styles.infoBlockLink}>(407) 123-4567</a><br />
                  <strong>Email:</strong> <a href="mailto:info@mixedrealty.com" className={styles.infoBlockLink}>info@mixedrealty.com</a>
                </p>
              </div>

              <div className={styles.infoBlock}>
                <span className={styles.infoBlockTitle}>Business Hours</span>
                <p className={styles.infoBlockText}>
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday: 10:00 AM - 4:00 PM<br />
                  Sunday: Closed
                </p>
              </div>

              <div className={styles.socialSection}>
                <span className={styles.infoBlockTitle}>Follow Us</span>
                <div className={styles.socialIcons}>
                  <img src="/icons/facebook.svg" alt="Facebook" className={styles.icon} />
                  <img src="/icons/instagram.svg" alt="Instagram" className={styles.icon} />
                  <img src="/icons/linkedin.svg" alt="LinkedIn" className={styles.icon} />
                </div>
              </div>
            </div>
          </aside>

          <div className={styles.formSection}>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
