import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './Legal.module.css';

export default function Shipping() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <Helmet>
        <title>Shipping & Delivery | Nectar & Nut</title>
        <meta name="description" content="Information regarding shipping rates and delivery timelines." />
      </Helmet>

      <div className={styles.legalContainer}>
        <h1 className={styles.title}>Shipping & Delivery</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>

        <section className={styles.content}>
          <h2>1. Processing Time</h2>
          <p>
            All orders are processed within <strong>1-2 business days</strong>. Orders are not shipped or delivered on weekends or holidays. If we are experiencing a high volume of orders, shipments may be delayed by a few days.
          </p>

          <h2>2. Shipping Rates & Delivery Estimates</h2>
          <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
          <ul>
            <li><strong>Standard Delivery:</strong> ₹100 Flat Rate (3-5 business days)</li>
            <li><strong>Express Delivery:</strong> ₹250 (1-2 business days)</li>
            <li><strong>Free Shipping:</strong> On all orders over ₹999</li>
          </ul>

          <h2>3. Shipment Confirmation & Order Tracking</h2>
          <p>
            You will receive a Shipment Confirmation email once your order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
          </p>

          <h2>4. Damages</h2>
          <p>
            Nectar & Nut is not liable for any products damaged or lost during shipping. If you received your order damaged, please contact the shipment carrier to file a claim. Please save all packaging materials and damaged goods before filing a claim.
          </p>

          <h2>5. International Shipping</h2>
          <p>
            Currently, we do not ship outside of India. We are looking to expand our delivery zones in the future.
          </p>
        </section>
      </div>
    </div>
  );
}
