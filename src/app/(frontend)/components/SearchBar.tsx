'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './SearchBar.module.css'
import Button from './Button'

export const SearchBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('find')
  const [searchValue, setSearchValue] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [area, setArea] = useState('')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchValue(q)
    }
  }, [searchParams])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab !== 'find') {
      setSearchValue('')
    } else {
      const q = searchParams.get('q')
      if (q) setSearchValue(q)
    }
    setBathrooms('')
    setBedrooms('')
    setArea('')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchValue.trim())}`)
    } else {
      router.push('/properties')
    }
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'find' ? styles.active : ''}`}
          onClick={() => handleTabChange('find')}
        >
          Find a Home
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'value' ? styles.active : ''}`}
          onClick={() => handleTabChange('value')}
        >
          Value Estimate
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'find' ? (
          <form className={styles.searchBar} onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for properties..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit" style={{ display: 'none' }}>Search</button>
          </form>
        ) : (
          <div className={styles.valueForm}>
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(e.target.value)}
            />
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
            />
            <input
              type="number"
              placeholder="Area (sqft)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <Button>Calculate</Button>
          </div>
        )}
      </div>
    </div>
  )
}
