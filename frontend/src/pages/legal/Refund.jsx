import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './Legal.module.css';

export default function Refund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <Helmet>
        <title>Refund & Cancellation Policy | Nectar & Nut</title>
        <meta name="description" content="Our policies on refunds, returns, and order cancellations." />
      </Helmet>

      <div className={styles.legalContainer}>
        <h1 className={styles.title}>Refund & Cancellation</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>

        <section className={styles.content}>
          <h2>1. Cancellation Policy</h2>
          <p>
            Orders can be cancelled within <strong>24 hours</strong> of placement, provided they have not yet been dispatched. If you wish to cancel an order, please contact our support team immediately at support@nectarnut.example.com.
          </p>
          <p>
            Once an order is shipped, we cannot process a cancellation, and you will need to follow our returns process upon receiving the item.
          </p>

          <h2>2. Return Policy</h2>
          <p>
            As we deal in premium food and perishable items, we only accept returns if the product received is damaged, expired, or incorrect. You must notify us within <strong>48 hours</strong> of delivery with photographic evidence.
          </p>

          <h2>3. Refund Process</h2>
          <p>
            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within <strong>5-7 business days</strong>.
          </p>

          <h2>4. Late or Missing Refunds</h2>
          <p>
            If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you've done all of this and you still have not received your refund, please contact us.
          </p>
        </section>
      </div>
    </div>
  );
}
