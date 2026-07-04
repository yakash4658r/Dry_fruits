import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerOverlay}></div>
      <div className={`container ${styles.grid}`}>
        
        {/* Left Column */}
        <div className={styles.leftCol}>
          <h2 className={styles.whispers}>
            Whispers from the <em>harvest.</em>
          </h2>
          <p className={styles.desc}>
            Receive private dispatches on new batches, rare allocations and atelier invitations. Sent four times a year.
          </p>
          
          <form className={styles.subscribeForm} onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your address" className={styles.input} />
            <button type="submit" className={styles.joinBtn}>JOIN</button>
          </form>
        </div>

        {/* Middle Column */}
        <div className={styles.midCol}>
          <h6 className={styles.heading}>M A I S O N</h6>
          <ul className={styles.links}>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/products">Collection</Link></li>
            <li><Link to="/products">Gifting</Link></li>
          </ul>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          <h6 className={styles.heading}>C O N C I E R G E</h6>
          <ul className={styles.links}>
            <li><a href="mailto:hello@nectarandnut.com">hello@nectarandnut.com</a></li>
            <li className={styles.textOnly}>Paris • Dubai • London</li>
            <li className={styles.textOnly}>Private orders by appointment</li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Copy & Legal */}
      <div className={styles.bottomCopy} style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5%', alignItems: 'center' }}>
        <p style={{ margin: 0 }}>© 2026 Nectar & Nut.</p>
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li><Link to="/privacy-policy" style={{ color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy Policy</Link></li>
          <li><Link to="/terms" style={{ color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms of Service</Link></li>
          <li><Link to="/refund-policy" style={{ color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '0.85rem' }}>Refunds</Link></li>
          <li><Link to="/shipping-policy" style={{ color: 'var(--color-text-light)', textDecoration: 'none', fontSize: '0.85rem' }}>Shipping</Link></li>
        </ul>
      </div>
    </footer>
  )
}
