import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import api from '@/utils/api'
import { useCartStore } from '@/store'
import styles from './CinematicHome.module.css'
import ImageSequenceCanvas from '@/components/ui/ImageSequenceCanvas'
import ScrollyCollection from '@/components/ui/ScrollyCollection'

/* ── Category config ── */
const CATEGORIES = [
  { key: 'almonds',    icon: '🥜', label: 'Almonds',         desc: 'Rich in Vitamin E & Protein' },
  { key: 'cashews',    icon: '🌰', label: 'Cashews',         desc: 'Buttery smooth, high magnesium' },
  { key: 'pistachios', icon: '💚', label: 'Pistachios',      desc: 'Antioxidant powerhouse' },
  { key: 'walnuts',    icon: '🤎', label: 'Walnuts',         desc: 'Omega-3 rich, brain fuel' },
  { key: 'raisins',    icon: '🍇', label: 'Raisins & Dates', desc: 'Natural sugar, iron boost' },
  { key: 'mix_seeds',  icon: '🌱', label: 'Seeds & Mixes',   desc: 'Superfood blend daily mix' },
]

/* ── Ritual Cards ── */
const RITUALS = [
  {
    num: '01', step: 'Harvest', icon: '🌿',
    title: 'Orchard to Batch',
    desc: 'We handpick only the finest grade nuts directly from certified organic orchards in Kashmir, California & Saudi Arabia.',
  },
  {
    num: '02', step: 'Process', icon: '☀️',
    title: 'Sun-Dried & Graded',
    desc: 'Slow dried under natural sun, then machine-graded by size and density. Zero artificial preservatives, ever.',
  },
  {
    num: '03', step: 'Sealed', icon: '📦',
    title: 'Vacuum Locked Fresh',
    desc: 'Triple-sealed nitrogen-flush packaging locks in crunch, aroma and nutritional integrity for months.',
  },
]

/* ── Ticker content ── */
const TICKER_ITEMS = [
  'PREMIUM ALMONDS', 'CREAMY CASHEWS', 'ORGANIC PISTACHIOS',
  'KASHMIRI WALNUTS', 'MEDJOOL DATES', 'SUPERFOOD SEEDS',
  'FREE DELIVERY', 'VACUUM SEALED', '100% ORGANIC',
]

export default function CinematicHome() {
  const [products, setProducts] = useState([])
  const { addToCart } = useCartStore()
  const heroRef = useRef()

  // Scroll-driven values for parallax
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const dawnY = useTransform(scrollYProgress, [0, 0.2], [0, -100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  
  const dawnScale  = useTransform(scrollY, [0, 600], [1, 1.05])
  const nightY     = useTransform(scrollY, [1200, 2400], [60, -60])

  useEffect(() => {
    api.get('/api/home/').then(r => {
      setProducts(r.data.featured_products || [])
    })
  }, [])

  const handleAdd = async (id) => {
    await addToCart(id, 1)
  }

  return (
    <div className={styles.page}>
      {/* Background Image Sequence Canvas */}
      <ImageSequenceCanvas 
        folder="/duck"
        prefix="ezgif-frame-"
        padCount={3}
      />

      {/* ════════════════════════════════
          DAWN SECTION (Hero Video)
          ════════════════════════════════ */}
      <motion.section 
        className={styles.dawn} 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
      >
        {/* Auto-playing banner video for the initial hero */}
        <div className={styles.heroVideoContainer}>
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className={styles.heroVideo}
            src="/Banner_video.mp4"
          />
          <div className={styles.heroVideoOverlay} />
        </div>

        {/* Background glow */}
        <div className={styles.dawnBg}>
          <div className={styles.dawnGlow} />
        </div>

      </motion.section>

      {/* ════════════════════════════════
          DUSK SECTION
          ════════════════════════════════ */}
      <section className={styles.dusk} id="dusk-section">
        <div className={styles.duskOrb} />

        {/* Second 3D Scene instance removed, global sequence handles it */}
        <div className={styles.dusk3dPanel}>
        </div>

        <div className={styles.duskContent}>
          {/* Left: empty — 3D canvas fills */}
          <div />

          <motion.div
            className={styles.duskRight}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.timeLabel}>DUSK</span>
            <h2 className={styles.duskTitle}>
              The<br />Afternoon<br />
              <span className={styles.dawnItalic}>Ritual.</span>
            </h2>
            <Link to="/products" className={`${styles.dawnBtn} ${styles.dawnBtnPrimary}`}>
              Shop Afternoon Mix →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          RITUAL STACKING CARDS
          ════════════════════════════════ */}
      <section className={styles.stackSection} id="process-section">
        {/* Static Background Image */}
        <img 
          src="/animations/0292.jpg" 
          alt="Process Background"
          className={styles.stackBgImage}
        />

        <div className={styles.stackHead}>
          <motion.span
            className={styles.stackLabel}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Process
          </motion.span>
          <motion.h2
            className={styles.stackTitle}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            From Earth to Your Table
          </motion.h2>
        </div>

        <div className={styles.stackGrid}>
          {RITUALS.map((r, i) => (
            <motion.div
              key={i}
              className={styles.stackCard}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className={styles.cardEmojiWrap}>{r.icon}</div>
              <div className={styles.cardBody}>
                <span className={styles.cardNumber}>{r.num}</span>
                <span className={styles.cardStep}>{r.step}</span>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardDesc}>{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════
          SCROLLYTELLING PRODUCT COLLECTION
          ════════════════════════════════ */}
      <ScrollyCollection products={products} categories={CATEGORIES} />

      {/* ════════════════════════════════
          NIGHT SECTION
          ════════════════════════════════ */}
      <section className={styles.night}>
        <div className={styles.nightVideo} />
        <div className={styles.nightOrb1} />
        <div className={styles.nightOrb2} />

        <motion.div
          className={styles.nightContent}
          style={{ y: nightY }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className={styles.nightEye}
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          >
            🌙
          </motion.span>

          <h2 className={styles.nightTitle}>
            Eat what the earth<br />
            <strong>intended.</strong>
          </h2>

          <br/><br/>
          <Link to="/products" className={`${styles.dawnBtn} ${styles.dawnBtnPrimary}`}
            style={{ fontSize: '1rem', padding: '17px 50px' }}>
            Begin Your Ritual
          </Link>
        </motion.div>
      </section>

      {/* ════════════════════════════════
          FINAL CTA BAND
          ════════════════════════════════ */}
      <div className={styles.ctaBand}>
        <motion.h2
          className={styles.ctaTitle}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Ready to Start Your<br />Nut Ritual?
        </motion.h2>
        <motion.p
          className={styles.ctaSub}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Free express delivery on orders above ₹999. 100% organic. Vacuum sealed fresh.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          <Link to="/products" className={`${styles.dawnBtn} ${styles.dawnBtnPrimary}`}
            style={{ fontSize: '1.05rem', padding: '18px 56px' }}>
            Shop Now →
          </Link>
        </motion.div>
      </div>

    </div>
  )
}
