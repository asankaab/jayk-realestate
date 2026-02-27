'use client'
import { useState } from 'react'
import styles from './SearchBar.module.css'
import Button from './Button'

export const SearchBar = () => {
  const [activeTab, setActiveTab] = useState('find')
  const [searchValue, setSearchValue] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [area, setArea] = useState('')

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setSearchValue('')
    setBathrooms('')
    setBedrooms('')
    setArea('')
  }

  return (
    <div className={styles.searchContainer}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'find' ? styles.active : ''}`}
          onClick={() => handleTabChange('find')}
        >
          Find a home
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'value' ? styles.active : ''}`}
          onClick={() => handleTabChange('value')}
        >
          Value estimate
        </button>
      </div>
      <div className={styles.content}>
        {activeTab === 'find' ? (
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search for properties..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
            />
          </div>
        ) : (
          <div className={styles.valueForm}>
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={e => setBathrooms(e.target.value)}
            />
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={e => setBedrooms(e.target.value)}
            />
            <input
              type="number"
              placeholder="Area (sqft)"
              value={area}
              onChange={e => setArea(e.target.value)}
            />
            <Button>Calculate</Button>
          </div>
        )}
      </div>
    </div>
  )
}
