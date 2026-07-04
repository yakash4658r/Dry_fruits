import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './SearchOverlay.module.css'

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
          
          <div className={styles.content}>
            <span className={styles.subtitle}>Looking for something specific?</span>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Search premium nuts, dates & seeds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.submitBtn}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>

            <div className={styles.suggestions}>
              <span>Popular:</span>
              <button onClick={() => { navigate('/products?q=almonds'); onClose(); }}>Kashmiri Almonds</button>
              <button onClick={() => { navigate('/products?q=dates'); onClose(); }}>Medjool Dates</button>
              <button onClick={() => { navigate('/products?q=pistachios'); onClose(); }}>Roasted Pistachios</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
