import React from 'react';
import styles from './MetricCard.module.css';

export default function MetricCard({ title, value, statusText, statusType = 'positive' }) {
  const statusClass = 
    statusType === 'positive' ? styles.positive :
    statusType === 'negative' ? styles.negative : styles.neutral;

  return (
    <div className={styles.card}>
      <span className={styles.title}>{title}</span>
      <div className={styles.value}>{value}</div>
      <div className={`${styles.badge} ${statusClass}`}>
        <span>{statusText}</span>
      </div>
    </div>
  );
}
