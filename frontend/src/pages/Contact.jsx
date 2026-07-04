import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import styles from './Contact.module.css'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/contact/', formData)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', message: '' })
      }, 4000)
    } catch (error) {
      console.error("Failed to send message", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      
      {/* ── HERO / BG ── */}
      <div className={styles.bgWrapper}>
        <img src="/animations/contact_bg.png" alt="Premium Dry Fruits Desk" className={styles.bgImage} />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.container}>
        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={styles.subtitle}>Get in Touch</span>
          <h1 className={styles.title}>
            Private <em>Concierge.</em>
          </h1>
          <p className={styles.headerDesc}>
            Whether you are inquiring about a bespoke gifting collection, bulk atelier orders, or simply need assistance, our private concierge is at your service.
          </p>
        </motion.div>

        <div className={styles.content}>
          
          {/* Contact Info Panel */}
          <motion.div 
            className={styles.infoPanel}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.infoBlock}>
              <h3>Atelier</h3>
              <p>Nectar & Nut Boutique<br/>124 Heritage Avenue<br/>Kashmir, India</p>
            </div>
            
            <div className={styles.infoBlock}>
              <h3>Direct Connect</h3>
              <p>hello@nectarnut.in<br/>+91 98765 43210</p>
            </div>

            <div className={styles.infoBlock}>
              <h3>Private Hours</h3>
              <p>Monday - Friday: 9am - 6pm<br/>Weekends by appointment only.</p>
            </div>
          </motion.div>

          {/* Form Panel */}
          <motion.div 
            className={styles.formPanel}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.checkIcon}>✧</div>
                <h3>Message Received</h3>
                <p>Our concierge will reach out to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input 
                    type="text" 
                    id="name"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <input 
                    type="email" 
                    id="email"
                    required
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <textarea 
                    id="message" 
                    rows="4"
                    required
                    placeholder="How may we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? 'Sending...' : 'Send Request →'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* ── FAQ SECTION ── */}
        <motion.div 
          className={styles.faqSection}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <div className={styles.faqHeader}>
            <h2>Frequently Asked</h2>
          </div>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>Do you ship internationally?</h4>
              <p>Yes, we ship our premium collections globally using climate-controlled express logistics.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Are your products organically certified?</h4>
              <p>Absolutely. Every product we harvest comes from 100% certified organic heritage orchards.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Do you handle corporate gifting?</h4>
              <p>We offer bespoke gifting solutions in luxury bento boxes for corporate clients and private events.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>How do you ensure freshness?</h4>
              <p>Our products are nitrogen-flushed and vacuum-sealed immediately after grading to lock in crispness and nutrients.</p>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
