import { useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './About.module.css'

export default function About() {
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className={styles.page}>
      
      {/* ── HERO SECTION ── */}
      <section className={styles.hero}>
        <motion.div className={styles.heroBg} style={{ y: heroY }}>
          <img src="/animations/about_hero.png" alt="Heritage Orchard" />
          <div className={styles.overlay}></div>
        </motion.div>
        
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: heroOpacity }}
        >
          <span className={styles.subtitle}>Our Heritage</span>
          <h1 className={styles.title}>
            The Nectar & Nut<br/><em>Story.</em>
          </h1>
        </motion.div>
      </section>

      {/* ── OUR PHILOSOPHY SECTION ── */}
      <section className={styles.philosophySection}>
        <div className={styles.philosophyGrid}>
          <motion.div 
            className={styles.philTextCol}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={styles.philTitle}>Rooted in<br/><em>Tradition.</em></h2>
            <p className={styles.philDesc}>
              Nectar & Nut began with a singular vision: to bring the world’s finest, organically sourced dry fruits directly from heritage orchards to your table. We believe that true luxury lies in the purity of nature.
            </p>
            <p className={styles.philDesc}>
              Every almond, every walnut, and every pistachio is a testament to our commitment to quality, handpicked at the peak of perfection.
            </p>
          </motion.div>
          <motion.div 
            className={styles.philImageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/animations/about_quality.png" alt="Uncompromising Quality" className={styles.philImage} />
          </motion.div>
        </div>
      </section>

      {/* ── SUSTAINABILITY SECTION ── */}
      <section className={styles.sustainabilitySection}>
        <div className={styles.susGrid}>
          <motion.div 
            className={styles.susImageCol}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src="/animations/about_sustainability.png" alt="Heritage Orchard" className={styles.susImage} />
          </motion.div>
          <motion.div 
            className={styles.susTextCol}
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={styles.philTitle}>Nurturing the<br/><em>Earth.</em></h2>
            <p className={styles.philDesc}>
              We believe that the finest flavors can only be achieved when we respect the soil. Our heritage orchards utilize time-honored organic farming practices that enrich the earth and promote biodiversity.
            </p>
            <p className={styles.philDesc}>
              Every purchase supports sustainable agriculture and small-hold farmers who dedicate their lives to cultivating these extraordinary crops without synthetic fertilizers or harmful pesticides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── UNCOMPROMISING SECTION ── */}
      <section className={styles.uncompromisingSection}>
        <div className={styles.uncompContainer}>
          <motion.div 
            className={styles.uncompHeader}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1 }}
          >
            <h2>Uncompromising Quality</h2>
            <p>
              We partner exclusively with farmers who share our reverence for the land. Our rigorous selection process ensures that only the top 1% of the harvest makes it into our bespoke packaging.
            </p>
          </motion.div>

          <div className={styles.statsGrid}>
            {[
              { num: '100%', label: 'Organic Sourced' },
              { num: '50+', label: 'Partner Orchards' },
              { num: 'Top 1%', label: 'Selection Grade' },
              { num: '0', label: 'Artificial Preservatives' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className={styles.statBox}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              >
                <span className={styles.statNum}>{stat.num}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                <div className={styles.statLine}></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
