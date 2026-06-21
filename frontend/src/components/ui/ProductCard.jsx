import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/utils/api'
import { useCartStore } from '@/store'
import styles from './ProductCard.module.css'

function StarRating({ rating, count }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? styles.starFill : styles.starEmpty}>★</span>
      ))}
      <span className={styles.ratingCount}>({count})</span>
    </div>
  )
}

export function ProductCard({ product, wishlistIds = [] }) {
  const { addToCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const inWishlist = wishlistIds.includes(product.id)

  const handleAdd = async () => {
    await addToCart(product.id, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className={styles.card}>
      {/* Badges */}
      {product.is_discount && (
        <span className={`${styles.badge} ${styles.badgeDiscount}`}>-{product.discount_pct}%</span>
      )}
      {!product.is_discount && product.is_featured && (
        <span className={`${styles.badge} ${styles.badgeFeatured}`}>Featured</span>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className={styles.imgLink}>
        <div className={styles.imgHolder}>
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} loading="lazy" />
          ) : (
            <div className={styles.imgPlaceholder}>🥜</div>
          )}
          <div className={styles.imgOverlay}>
            <span>View Details</span>
          </div>
        </div>
      </Link>

      {/* Body */}
      <div className={styles.body}>
        <span className={styles.category}>{product.category_display}</span>
        <h3 className={styles.name}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <StarRating rating={product.avg_rating} count={product.review_count} />

        <div className={styles.footer}>
          <div className={styles.prices}>
            {product.is_discount && (
              <span className={styles.origPrice}>₹{product.price}</span>
            )}
            <span className={styles.sellPrice}>₹{product.display_price}</span>
          </div>

          {product.is_in_stock ? (
            <motion.button
              className={styles.addBtn}
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              animate={added ? { scale: [1, 1.2, 1] } : {}}
            >
              {added ? '✓' : '+'}
            </motion.button>
          ) : (
            <span className={styles.oos}>Out of Stock</span>
          )}
        </div>
      </div>
    </div>
  )
}
