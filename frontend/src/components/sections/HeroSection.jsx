import { useRef, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './HeroSection.module.css'

// Lazy-load the heavy Three.js canvas to avoid blocking page paint
const ParticleScene = lazy(() => import('../3d/ParticleScene'))

const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }
  }),
}

export default function HeroSection() {
  const heroRef = useRef()

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* 3D Three.js Particle Canvas Background */}
      <div className={styles.canvasWrap}>
        <Suspense fallback={null}>
          <ParticleScene />
        </Suspense>
      </div>

      {/* Gradient Overlays */}
      <div className={styles.overlayBottom} />
      <div className={styles.overlayLeft} />

      <div className={`container ${styles.content}`}>
        {/* Left — Text */}
        <div className={styles.textCol}>
          <motion.span
            className={styles.badge}
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
          >
            🌿 100% Organic &amp; Handpicked
          </motion.span>

          <motion.h1
            className={styles.headline}
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
          >
            Nature's Finest<br />
            Crafted for{' '}
            <em className={styles.goldText}>Vitality.</em>
          </motion.h1>

          <motion.p
            className={styles.sub}
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
          >
            Indulge in premium quality dry fruits, crunchy nuts, and
            nutrient-rich seeds. Pure goodness, sealed in freshness —
            delivered right to your door.
          </motion.p>

          <motion.div
            className={styles.ctas}
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
          >
            <Link to="/products" className={`btn btn-primary ${styles.ctaMain}`}>
              <ShopIcon /> Explore Catalogue
            </Link>
            <Link to="/products?category=almonds" className={`btn btn-outline ${styles.ctaSecond}`}>
              🥜 Premium Almonds
            </Link>
          </motion.div>

          <motion.div
            className={styles.stats}
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
          >
            {[
              { num: '100%', lbl: 'Organic' },
              { num: '5K+',  lbl: 'Families' },
              { num: '4.9★', lbl: 'Rating' },
            ].map((s, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLbl}>{s.lbl}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — 3D Floating Emoji Visual */}
        <motion.div
          className={styles.visualCol}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.ring}>
            <span className={styles.mainEmoji}>🥣</span>
            {/* Orbiting nuts */}
            <FloatNut emoji="🥜" cls={styles.nut1} />
            <FloatNut emoji="🍇" cls={styles.nut2} />
            <FloatNut emoji="🌰" cls={styles.nut3} />
            <FloatNut emoji="🌱" cls={styles.nut4} />
          </div>
        </motion.div>
      </div>

      {/* Marquee Ticker */}
      <div className={styles.ticker}>
        <div className={styles.tickerTrack}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className={styles.tickerContent}>
              CRUNCHY ALMONDS&nbsp;&nbsp;•&nbsp;&nbsp;
              CREAMY CASHEWS&nbsp;&nbsp;•&nbsp;&nbsp;
              SALTED PISTACHIOS&nbsp;&nbsp;•&nbsp;&nbsp;
              OMEGA-3 WALNUTS&nbsp;&nbsp;•&nbsp;&nbsp;
              ORGANIC DATES&nbsp;&nbsp;•&nbsp;&nbsp;
              SUPERFOOD SEEDS&nbsp;&nbsp;•&nbsp;&nbsp;
              DELIVERED FRESH&nbsp;&nbsp;•&nbsp;&nbsp;
              100% PURE &amp; VEGAN&nbsp;&nbsp;•&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function FloatNut({ emoji, cls }) {
  return <div className={`${styles.floatNut} ${cls}`}>{emoji}</div>
}

const ShopIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
