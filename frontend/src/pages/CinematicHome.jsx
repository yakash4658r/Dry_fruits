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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
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

    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleAdd = async (id) => {
    await addToCart(id, 1)
  }

  return (
    <div className={styles.page}>
      {/* Background Image Sequence Canvas (Desktop Only) */}
      {!isMobile && (
        <div className={styles.desktopOnly}>
          <ImageSequenceCanvas 
            folder="/duck"
            prefix="ezgif-frame-"
            padCount={3}
          />
        </div>
      )}
      {/* Mobile Global Static Background */}
      <div className={styles.mobileOnlyGlobalBg}></div>

      {/* ════════════════════════════════
          DAWN SECTION (Hero Video)
          ════════════════════════════════ */}
      <motion.section 
        className={styles.dawn} 
        ref={heroRef}
        style={{ opacity: heroOpacity }}
      >
        {/* Auto-playing banner video (Desktop) & Static Fallback (Mobile) */}
        <div className={styles.heroVideoContainer}>
          
          <div className={styles.desktopOnly}>
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className={styles.heroVideo}
              src="/Banner_video.mp4"
            />
          </div>
          
          <div className={styles.mobileOnly}>
            <img 
              src="/animations/hero_mobile_static.png" 
              alt="Premium Dry Fruits" 
              className={styles.heroMobileImg}
            />
          </div>

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
      <div className={styles.scrollyBgContainer}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10, 46, 40, 0.3), rgba(5, 13, 11, 0.95))', zIndex: -1, pointerEvents: 'none' }} />
      <ScrollyCollection products={products} categories={CATEGORIES} />

      {/* ════════════════════════════════
          STORY SECTION (Scarcity Principle)
          ════════════════════════════════ */}
      <section className={styles.storySection}>
        <div className={styles.storyContent}>
          <div className={styles.storyTextCol}>
            <h2 className={styles.storyTitle}>
              Founded on the<br />
              principle of<br />
              <em>uncompromising<br />scarcity.</em>
            </h2>
            <p className={styles.storyDesc}>
              NECTAR & NUT began in a single atelier with one conviction: treat the world's finest nuts and dried fruits with the reverence reserved for rare gemstones.
            </p>
            <p className={styles.storyDesc}>
              We work only with small-hold farmers who preserve heritage species, ensuring that every piece delivers an unparalleled tasting experience.
            </p>
          </div>
          <div className={styles.storyImageCol}>
            <img src="/animations/heritage_sorting.png" alt="Luxury sorting of dry fruits" className={styles.storyImage} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          GIFTING SECTION
          ════════════════════════════════ */}
      <section className={styles.giftingSection}>
        <div className={styles.giftingContent}>
          <div className={styles.giftingImageCol}>
            <picture>
              <source media="(max-width: 768px)" srcSet="/animations/home_gifting_mobile.png" />
              <img src="/animations/home_gifting.png" alt="Luxury Gifting" className={styles.giftingImage} />
            </picture>
          </div>
          <div className={styles.giftingTextCol}>
            <h2 className={styles.giftingTitle}>
              The Art of<br/>
              <em>Gifting.</em>
            </h2>
            <p className={styles.giftingDesc}>
              Elevate your corporate or personal gifting with our bespoke bento boxes. Each box is a masterclass in luxury, filled with hand-selected, premium dry fruits and nuts that leave a lasting impression.
            </p>
            <p className={styles.giftingDesc}>
              Perfect for festive seasons, weddings, and exclusive corporate events. Experience gifting that speaks volumes of your exquisite taste.
            </p>
          </div>
        </div>
      </section>

      
      {/* ════════════════════════════════
          NUTRITION SECTION
          ════════════════════════════════ */}
      <section className={styles.nutritionSection}>
        <div className={styles.nutritionContent}>
          <div className={styles.nutTextCol}>
            <span className={styles.timeLabel}>VITALITY</span>
            <h2 className={styles.duskTitle}>
              Unrivaled<br />
              <span className={styles.dawnItalic}>Nutrition.</span>
            </h2>
            <p className={styles.giftingDesc}>
              Every nut is a powerhouse of essential vitamins, minerals, and heart-healthy fats. Our slow-drying process ensures that the nutritional integrity of every harvest is preserved flawlessly from tree to table.
            </p>
            <div className={styles.nutStats}>
              <div className={styles.nutStatItem}>
                <h4>Rich in Omega-3</h4>
                <p>Essential for cognitive function and heart health.</p>
              </div>
              <div className={styles.nutStatItem}>
                <h4>High Antioxidants</h4>
                <p>Combats oxidative stress and promotes cellular health.</p>
              </div>
            </div>
          </div>
          <div className={styles.nutImageCol}>
            {/* Responsive image */}
            <picture>
              <source media="(max-width: 768px)" srcSet="/animations/about_quality_mobile.png" />
              <img src="/animations/about_quality.png" alt="Nutritional Quality" className={styles.nutImage} />
            </picture>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          HARVEST SEASONS
          ════════════════════════════════ */}
      <section className={styles.harvestSection}>
        <div className={styles.harvestHeader}>
          <h2 className={styles.giftingTitle}>The Cycle of <em>Nature.</em></h2>
          <p className={styles.giftingDesc}>We follow the earth's natural rhythm. We do not force nature; we wait for it to offer its finest.</p>
        </div>
        <div className={styles.harvestGrid}>
          <div className={styles.harvestCard}>
            <h3>Spring Blossom</h3>
            <p>Our almond orchards awake, setting the stage for the year's harvest.</p>
          </div>
          <div className={styles.harvestCard}>
            <h3>Summer Sun</h3>
            <p>Pistachios soak in the intense summer heat, developing their signature rich flavor.</p>
          </div>
          <div className={styles.harvestCard}>
            <h3>Autumn Harvest</h3>
            <p>The peak season. Walnuts and cashews are hand-plucked and immediately shade-dried.</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          INNER CIRCLE TESTIMONIALS
          ════════════════════════════════ */}
      <section className={styles.testimonialSection}>
        <div className={styles.testimonialContainer}>
          <h2 className={styles.giftingTitle} style={{ textAlign: 'center' }}>Words of the <em>Ritualists.</em></h2>
          <div className={styles.testimonialGrid}>
            <div className={styles.testiCard}>
              <p className={styles.testiQuote}>"The best pistachios I've ever tasted. The crunch is unbelievable and the packaging is stunning."</p>
              <div className={styles.testiAuthor}>- Arjun K., Fitness Enthusiast</div>
            </div>
            <div className={styles.testiCard}>
              <p className={styles.testiQuote}>"Finally, a brand that doesn't compromise on quality. The Medjool dates are simply melt-in-your-mouth."</p>
              <div className={styles.testiAuthor}>- Meera S., Nutritionist</div>
            </div>
          </div>
        </div>
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

    </div>
  )
}
