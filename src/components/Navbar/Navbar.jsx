import React from 'react';
import styles from './Navbar.module.css';

export default function Navbar({ title, subtitle, actions, children }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.headerInfo}>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <span className={styles.pageSubtitle}>{subtitle}</span>}
      </div>

      {(actions || children) && (
        <div className={styles.controls}>
          {actions}
          {children}
        </div>
      )}
    </header>
  );
}
