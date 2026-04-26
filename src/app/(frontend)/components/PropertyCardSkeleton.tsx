import React from 'react'
import styles from './PropertyCard.module.css'
import skeletonStyles from './PropertyCardSkeleton.module.css'

export const PropertyCardSkeleton = () => {
  return (
    <div className={`${styles.propertyCard} ${skeletonStyles.skeletonCard}`}>
      <div className={styles.propertyImageContainer}>
        <div className={skeletonStyles.pulse} style={{ width: '100%', height: '100%' }} />
      </div>
      <div className={styles.propertyDetails}>
        <div>
          <div className={skeletonStyles.pulse} style={{ width: '40%', height: '2rem', marginBottom: '0.5rem', borderRadius: '4px' }} />
          <div className={skeletonStyles.pulse} style={{ width: '80%', height: '1.5rem', borderRadius: '4px' }} />
        </div>
        <div className={skeletonStyles.pulse} style={{ width: '60%', height: '1rem', marginTop: '0.5rem', borderRadius: '4px' }} />
        
        <div>
          <div className={styles.propertySpecs}>
            <div className={styles.propertyFeatures} style={{ gap: '1rem' }}>
              <div className={skeletonStyles.pulse} style={{ width: '3rem', height: '1rem', borderRadius: '4px' }} />
              <div className={skeletonStyles.pulse} style={{ width: '3rem', height: '1rem', borderRadius: '4px' }} />
            </div>
            <div className={skeletonStyles.pulse} style={{ width: '4rem', height: '1rem', borderRadius: '4px' }} />
          </div>
          
          <div className={styles.buttonContainer} style={{ marginTop: '1rem' }}>
            <div className={skeletonStyles.pulse} style={{ width: '8rem', height: '2.5rem', borderRadius: '999px' }} />
            <div className={styles.actionContainer} style={{ gap: '0.5rem' }}>
              <div className={skeletonStyles.pulse} style={{ width: '3rem', height: '2rem', borderRadius: '5px' }} />
              <div className={skeletonStyles.pulse} style={{ width: '2rem', height: '2rem', borderRadius: '5px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
