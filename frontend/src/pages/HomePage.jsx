import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '@/utils/api'
import { useScrollReveal } from '@/hooks/useGSAP'
import { ProductCard } from '@/components/ui/ProductCard'
import HeroSection from '@/components/sections/HeroSection'
import styles from './HomePage.module.css'

/* ── Features Strip ── */
const FEATURES = [
  { icon: '🚚', title: 'Free Express Shipping', desc: 'On orders above ₹999' },
  { icon: '🌿', title: '100% Organic',          desc: 'Direct from local farms' },
  { icon: '📦', title: 'Eco-Safe Packaging',    desc: 'Vacuum-sealed freshness' },
  { icon: '🔒', title: 'Secure Payments',       desc: '100% safe via Razorpay' },
]

/* ── Category Cards ── */
const CATEGORIES = [
  { key: 'almonds',    label: 'Almonds',         icon: '🥜' },
  { key: 'cashews',    label: 'Cashews',         icon: '🌰' },
  { key: 'pistachios', label: 'Pistachios',      icon: '💚' },
  { key: 'walnuts',    label: 'Walnuts',         icon: '🤎' },
  { key: 'raisins',    label: 'Raisins & Dates', icon: '🍇' },
  { key: 'mix_seeds',  label: 'Seeds & Mixes',   icon: '🌱' },
]

/* ── Testimonials ── */
const TESTIMONIALS = [
  { stars: 5, text: '"The Kashmiri walnuts are absolutely outstanding. Buttery texture, no bitter aftertaste. Will definitely buy again!"', name: 'Priya S.', loc: 'Chennai, TN' },
  { stars: 5, text: '"Top notch packaging. The cashews were whole and vacuum sealed, extremely crunchy. Highly recommended!"', name: 'Rahul M.', loc: 'Bengaluru, KA' },
  { stars: 5, text: '"Fabulous seeds mix! I add a spoonful to my morning oatmeal every day. Clean, fresh, zero dust."', name: 'Ananya K.', loc: 'Mumbai, MH' },
]

export default function HomePage() {
  const [data, setData] = useState(null)
  const pageRef = useRef()
  useScrollReveal(pageRef)

  useEffect(() => {
    api.get('/api/home/').then(r => setData(r.data))
  }, [])

  return (
    <div ref={pageRef}>
      {/* ── HERO ── */}
      <HeroSection />

      {/* ── FEATURES ── */}
      <section className={styles.features}>
        <div className="container">
          <div className="grid grid-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16,1,0.3,1] }}
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                <div>
                  <strong>{f.title}</strong>
                  <p>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section">
        <div className="container">
          <div className={`${styles.sectionHead} reveal-up`}>
            <span className="section-label">Browse</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Discover hand-sorted premium dry fruits, rich in health and flavor</p>
          </div>
          <div className="grid grid-3" style={{ gridTemplateColumns: 'repeat(6,1fr)', gap: '16px' }}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
              >
                <Link to={`/products?category=${cat.key}`} className={styles.catCard}>
                  <span className={styles.catIcon}>{cat.icon}</span>
                  <span className={styles.catName}>{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {data?.featured_products?.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className={`${styles.sectionHead} reveal-up`}>
              <span className="section-label">Hand-Picked</span>
              <h2 className="section-title">✨ Featured Delicacies</h2>
              <p className="section-subtitle">Slow-dried, hand-selected signature favorites</p>
              <Link to="/products" className={styles.viewAll}>View Entire Catalogue →</Link>
            </div>
            <div className="grid grid-3">
              {data.featured_products.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── PARALLAX ORCHARD ── */}
      <section className={styles.parallax}>
        <div className={styles.parallaxOverlay} />
        <div className={`container ${styles.parallaxText}`}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            From Sun-Drenched Orchards<br />to Your Kitchen
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.9 }}
          >
            Our walnuts are sourced from Kashmiri orchards, almonds from California,
            and dates from Saudi Arabia. Every batch is graded by size, slow-dried to
            lock in natural oils, and vacuum-sealed for maximum crunchiness.
          </motion.p>
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section className="section">
        <div className="container">
          <div className={styles.promoGrid}>
            <Link to="/products?category=almonds" className={`${styles.promoCard} ${styles.promoDark}`}>
              <div className={styles.promoContent}>
                <span className={styles.promoTag}>Limited Harvest</span>
                <h3>California Almonds<br /><small>Save up to 15%</small></h3>
                <p>Extra crunchy, rich in Vitamin E & dietary fiber.</p>
                <span className={`btn btn-primary ${styles.promoBtn}`}>Order Now →</span>
              </div>
              <span className={styles.promoEmoji}>🥜</span>
            </Link>

            <Link to="/products?category=cashews" className={`${styles.promoCard} ${styles.promoLight}`}>
              <div className={styles.promoContent}>
                <span className={styles.promoTag}>New Season</span>
                <h3>Jumbo Cashew Nuts<br /><small>Grade W240 Whole</small></h3>
                <p>Rich, creamy, buttery cashews sourced fresh.</p>
                <span className={`btn btn-dark ${styles.promoBtn}`}>Order Now →</span>
              </div>
              <span className={styles.promoEmoji}>🌰</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      {data?.best_sellers?.length > 0 && (
        <section className="section section-alt">
          <div className="container">
            <div className={`${styles.sectionHead} reveal-up`}>
              <span className="section-label">Most Loved</span>
              <h2 className="section-title">🔥 Bestselling Selection</h2>
              <p className="section-subtitle">Highly requested by health enthusiasts</p>
              <Link to="/products?sort=popular" className={styles.viewAll}>View All Bestsellers →</Link>
            </div>
            <div className="grid grid-3">
              {data.best_sellers.slice(0, 6).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className={`${styles.sectionHead} text-center reveal-up`}>
            <span className="section-label">Harvest Notes</span>
            <h2 className="section-title">💬 What Our Customers Say</h2>
          </div>
          <div className="grid grid-3">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.8 }}
              >
                <div className={styles.testimonialStars}>{'★'.repeat(t.stars)}</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.reviewer}>
                  <div className={styles.avatar}>{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <small>{t.loc}</small>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="section">
        <div className="container">
          <div className={styles.newsletter}>
            <div>
              <h3>🎁 Healthy Deals, Direct to You!</h3>
              <p>Subscribe for health tips, premium harvest releases &amp; exclusive discounts.</p>
            </div>
            <form className={styles.newsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address…" className={styles.emailInput} />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
