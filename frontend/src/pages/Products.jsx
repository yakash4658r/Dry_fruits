import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useProductsStore } from '@/store'
import { ProductCard } from '@/components/ui/ProductCard'
import { motion } from 'framer-motion'
import styles from './Products.module.css'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, categories, loading, fetchProducts, totalPages, currentPage } = useProductsStore()

  const currentCategory = searchParams.get('category') || ''
  const currentSort = searchParams.get('sort') || 'newest'
  const currentSearch = searchParams.get('q') || ''

  useEffect(() => {
    fetchProducts({
      category: currentCategory,
      sort: currentSort,
      q: currentSearch,
      page: searchParams.get('page') || 1
    })
    window.scrollTo(0, 0)
  }, [currentCategory, currentSort, searchParams])

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    newParams.delete('page') 
    setSearchParams(newParams)
  }

  return (
    <div className={styles.productsPage}>
      <Helmet>
        <title>The Collection | Nectar & Nut</title>
        <meta name="description" content="Shop our exclusive collection of organic dry fruits, nuts, and seeds. Hand-picked for the finest quality." />
      </Helmet>
      
      {/* ── LUXURY HERO BANNER ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img src="/animations/products_hero.png" alt="Premium Collection" />
          <div className={styles.overlay}></div>
        </div>
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.subtitle}>Curated Selection</span>
          <h1 className={styles.title}>The <em>Catalogue.</em></h1>
          <p className={styles.heroDesc}>Discover the finest selection of premium dry fruits and nuts, sourced globally for uncompromising quality.</p>
        </motion.div>
      </section>

      <div className={styles.container}>
        
        {/* ── SIDEBAR FILTERS ── */}
        <aside className={styles.sidebar}>
          <div className={styles.filterBar}>
            <div className={styles.filterLeft}>
              {currentSearch ? (
                <h3>Search Results for: <em>"{currentSearch}"</em></h3>
              ) : (
                <h3>{currentCategory ? currentCategory.replace('_', ' ') : 'All Products'}</h3>
              )}
            </div>
            
            <div className={styles.filterRight}>
              <select 
                value={currentSort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className={styles.sortSelect}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
          <div className={styles.filterGroup}>
            <h3>Category</h3>
            <ul className={styles.categoryList}>
              <li 
                className={!currentCategory ? styles.active : ''} 
                onClick={() => handleFilterChange('category', '')}
              >
                All Collections
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.key}
                  className={currentCategory === cat.key ? styles.active : ''}
                  onClick={() => handleFilterChange('category', cat.key)}
                >
                  {cat.label}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterGroup}>
            <h3>Sort By</h3>
            <select 
              value={currentSort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className={styles.sortSelect}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <main className={styles.main}>
          {loading ? (
            <div className={styles.loader}>
              <div className={styles.spinner}></div>
              Curating selection...
            </div>
          ) : products.length > 0 ? (
            <>
              <div className={styles.grid}>
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handleFilterChange('page', currentPage - 1)}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>Page {currentPage} of {totalPages}</span>
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handleFilterChange('page', currentPage + 1)}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <p>No products found in this collection.</p>
              <button onClick={() => setSearchParams({})}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* ── HEALTH SECTION ── */}
      <section className={styles.healthSection}>
        <div className={styles.healthContent}>
          <div className={styles.healthTextCol}>
            <h2 className={styles.healthTitle}>
              Fuel Your<br/>
              <em>Body.</em>
            </h2>
            <p className={styles.healthDesc}>
              Nature’s ultimate superfood. Dry fruits and nuts are densely packed with essential vitamins, heart-healthy fats, and powerful antioxidants.
            </p>
            <p className={styles.healthDesc}>
              Whether you need sustained energy for your workout, a boost in cognitive function, or a guilt-free midnight snack, our organic collection provides the profound nutrition your body craves.
            </p>
          </div>
          <div className={styles.healthImageCol}>
            <img src="/animations/products_health.png" alt="Healthy Dry Fruits" className={styles.healthImage} />
          </div>
        </div>
      </section>

      {/* ── PROMISE BAND ── */}
      <section className={styles.promiseBand}>
        <div className={styles.promiseGrid}>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <h4>Hand Selected</h4>
            <p>Only the top 1% grade</p>
          </div>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <h4>Zero Additives</h4>
            <p>100% pure & natural</p>
          </div>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <h4>Vacuum Sealed</h4>
            <p>Locked in freshness</p>
          </div>
        </div>
      </section>

    </div>
  )
}
