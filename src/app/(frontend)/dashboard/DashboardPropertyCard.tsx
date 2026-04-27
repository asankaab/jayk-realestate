'use client'

import React, { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '../components/Button'
import styles from './DashboardPropertyCard.module.css'
import { deleteProperty } from './actions'
import { ExternalLink, Link2, View } from 'lucide-react'

type DashboardPropertyCardProps = {
  property: {
    id: string
    title: string
    price: number
    location: string
    status: string
    slug: string
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
          <div className={styles.title}>{property.title}</div>
          <div className={styles.location}>{property.location}</div>
          <div className={styles.priceStatusBlock}>
            <div className={styles.price}>${property.price.toLocaleString()}</div>
            <span
              className={`${styles.status} ${property.status === 'Sold' ? styles.statusSold : ''}`}
            >
              {property.status}
            </span>
          </div>
        </div>

        <div></div>

        <div className={styles.actions}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button href={`/dashboard/${property.id}/edit`} fill="outlined" size="small">
              Edit
            </Button>
            <Button onClick={handleDelete} color="accent" size="small" disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
          <Link href={`properties/${property.slug}`} target="_blank" className={styles.previewLink}>
            <ExternalLink size={18} color="var(--grey)" />
          </Link>
        </div>
      </div>
    </div>
  )
}
