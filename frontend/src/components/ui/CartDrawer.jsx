import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '../../store'
import styles from './CartDrawer.module.css'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, total, count, removeFromCart } = useCartStore()

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  const handleCheckout = () => {
    // Redirect to Django checkout view
    window.location.href = '/checkout/'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            className={styles.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.header}>
              <h2>Your Selection</h2>
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
            </div>

            <div className={styles.content}>
              {count === 0 ? (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🛍️</span>
                  <p>Your luxury collection is empty.</p>
                  <button className={styles.shopBtn} onClick={onClose}>Continue Shopping</button>
                </div>
              ) : (
                <ul className={styles.itemList}>
                  {items.map((item, idx) => (
                    <li key={`${item.id}-${idx}`} className={styles.cartItem}>
                      <img src={item.images[0]} alt={item.name} className={styles.itemImage} />
                      <div className={styles.itemDetails}>
                        <h4 className={styles.itemName}>{item.name}</h4>
                        <p className={styles.itemPrice}>₹{item.price} <span className={styles.qty}>x {item.qty}</span></p>
                      </div>
                      <button 
                        className={styles.removeBtn} 
                        onClick={() => removeFromCart(item.id)}
                        title="Remove Item"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {count > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalValue}>₹{total}</span>
                </div>
                <p className={styles.shippingNote}>Shipping & taxes calculated at checkout.</p>
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  Proceed to Checkout →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
