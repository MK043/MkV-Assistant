import React, { useState } from 'react';
import { Search, Calendar, Plus } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ title, breadcrumb, onActionClick, actionLabel = '+ Створити кампанію' }) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <header className={styles.navbar}>
      <div className={styles.headerInfo}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <span className={styles.breadcrumb}>{breadcrumb}</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={15} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.badgePill}>
          <span className={styles.dotGreen} />
          <span>Meta Ads</span>
        </div>

        <div className={styles.badgePill}>
          <span className={styles.dotGreen} />
          <span>TikTok Ads</span>
        </div>

        <div className={styles.dateFilter}>
          <Calendar size={14} />
          <span>Останні 30 днів</span>
        </div>

        {onActionClick && (
          <button type="button" className={styles.primaryBtn} onClick={onActionClick}>
            <Plus size={16} />
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
