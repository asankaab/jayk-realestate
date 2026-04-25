'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import styles from './SearchInput.module.css'
import Link from 'next/link'

export const SearchInput = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchValue(q)
    } else {
      setSearchValue('')
    }
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.replace(`/properties?q=${encodeURIComponent(searchValue.trim())}`, { scroll: false })
    } else {
      router.replace('/properties', { scroll: false })
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search for properties..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue ? (
        <Link href="/properties" replace className={styles.clearButton} aria-label="Clear Search">
          Clear <X size={18} />
        </Link>
      ) : null}
      <button type="submit" className={styles.searchButton} aria-label="Search">
        <Search size={20} />{' '}
      </button>
    </form>
  )
}
