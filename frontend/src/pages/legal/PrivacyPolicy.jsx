import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './Legal.module.css'; // We will create this shared CSS module next

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <Helmet>
        <title>Privacy Policy | Nectar & Nut</title>
        <meta name="description" content="Learn how Nectar & Nut protects your data and privacy." />
      </Helmet>

      <div className={styles.legalContainer}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>

        <section className={styles.content}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Nectar & Nut</strong>. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>

          <h2>2. The Data We Collect About You</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data:</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data:</strong> includes payment card details (processed securely by our payment gateway providers like Razorpay).</li>
            <li><strong>Transaction Data:</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., delivering your order).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us in the following ways:<br/>
            Email address: support@nectarnut.example.com<br/>
            Postal address: [Your Physical Business Address Here]
          </p>
        </section>
      </div>
    </div>
  );
}
