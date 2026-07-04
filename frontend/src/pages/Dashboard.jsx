import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import api from '@/utils/api'
import { useUserStore } from '@/store'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user } = useUserStore()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/api/my-orders/')
        setOrders(data.orders || [])
      } catch (err) {
        setError('Could not load your orders. Please ensure you are logged in.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className={styles.loaderPage}>
        <div className={styles.spinner}></div>
        <span>Accessing your atelier...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorPage}>
        <Helmet><title>Error | Nectar & Nut</title></Helmet>
        <p>{error}</p>
        <a href="/accounts/login/" className={styles.loginBtn}>Sign In</a>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Helmet>
        <title>My Account | Nectar & Nut</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.subtitle}>Welcome Back</span>
          <h1 className={styles.title}>
            {user?.first_name || user?.username || 'Client'} <em>Atelier.</em>
          </h1>
          <p className={styles.heroDesc}>Manage your private collection and track recent orders.</p>
        </div>
      </section>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <button className={`${styles.navItem} ${styles.active}`}>Order History</button>
            <a href="/wishlist/" className={styles.navItem}>Wishlist</a>
            <a href="/accounts/logout/" className={styles.navItemLogout}>Sign Out</a>
          </nav>
        </aside>

        <main className={styles.content}>
          <h2 className={styles.sectionTitle}>Recent Acquisitions</h2>
          
          {orders.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📦</span>
              <h3>No orders yet</h3>
              <p>Your private collection awaits.</p>
              <a href="/products" className={styles.shopBtn}>Explore Catalogue</a>
            </div>
          ) : (
            <div className={styles.orderList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <span className={styles.orderLabel}>Order ID</span>
                      <span className={styles.orderValue}>#{order.id.split('-')[0].toUpperCase()}</span>
                    </div>
                    <div>
                      <span className={styles.orderLabel}>Date</span>
                      <span className={styles.orderValue}>{order.date}</span>
                    </div>
                    <div>
                      <span className={styles.orderLabel}>Status</span>
                      <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || ''}`}>
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <span className={styles.orderLabel}>Total</span>
                      <span className={styles.orderValue}>₹{order.total_amount}</span>
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    <div className={styles.itemsList}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.itemRow}>
                          {item.image ? (
                            <img src={item.image} alt={item.product_name} className={styles.itemImage} />
                          ) : (
                            <div className={styles.itemImagePlaceholder}>🌰</div>
                          )}
                          <div className={styles.itemInfo}>
                            <h4>{item.product_name}</h4>
                            <p>Qty: {item.qty} × ₹{item.price}</p>
                          </div>
                          <div className={styles.itemTotal}>
                            ₹{item.total}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.shippingInfo}>
                      <h5>Shipping To</h5>
                      <p><strong>{order.address.name}</strong></p>
                      <p>{order.address.full_address}</p>
                      <p>{order.address.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
