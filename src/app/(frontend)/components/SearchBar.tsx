import styles from './SearchBar.module.css'

export const SearchBar = () => {
  return (
    <div className={styles.searchBar}>
      <input type="text" placeholder="Search for properties..." />
    </div>
  )
}
