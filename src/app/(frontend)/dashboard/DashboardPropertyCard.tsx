'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './DashboardPropertyCard.module.css'
import { deleteProperty } from './actions'

type DashboardPropertyCardProps = {
  property: {
    id: string
    title: string
    price: number
    location: string
    status: string
  }
}

export const DashboardPropertyCard: React.FC<DashboardPropertyCardProps> = ({ property }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property?')) {
      startTransition(async () => {
        try {
          await deleteProperty(property.id)
        } catch (error) {
          alert('Failed to delete property')
        }
      })
    }
  }

  return (
    <div className={styles.dashboardCard}>
      <div className={styles.details}>
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{property.title}</div>
            <div className={styles.location}>{property.location}</div>
          </div>
          <div className={styles.price}>${property.price.toLocaleString()}</div>
        </div>
        
        <div>
          <span className={`${styles.status} ${property.status === 'Sold' ? styles.statusSold : ''}`}>
            {property.status}
          </span>
        </div>

        <div className={styles.actions}>
          <Link href={`/dashboard/${property.id}/edit`} className={styles.editButton}>
            Edit
          </Link>
          <button 
            onClick={handleDelete} 
            className={styles.deleteButton}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
