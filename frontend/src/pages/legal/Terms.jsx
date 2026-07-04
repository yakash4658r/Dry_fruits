import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import styles from './Legal.module.css';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.legalPage}>
      <Helmet>
        <title>Terms of Service | Nectar & Nut</title>
        <meta name="description" content="Terms and conditions for using the Nectar & Nut website." />
      </Helmet>

      <div className={styles.legalContainer}>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.lastUpdated}>Last Updated: July 2026</p>

        <section className={styles.content}>
          <h2>1. Terms</h2>
          <p>
            By accessing this Website, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on Nectar & Nut's Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            All the materials on Nectar & Nut's Website are provided "as is". Nectar & Nut makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, Nectar & Nut does not make any representations concerning the accuracy or reliability of the use of the materials on its Website.
          </p>

          <h2>4. Limitations</h2>
          <p>
            Nectar & Nut or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on Nectar & Nut's Website, even if Nectar & Nut or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage.
          </p>
        </section>
      </div>
    </div>
  );
}
