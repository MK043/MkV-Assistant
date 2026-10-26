import React from 'react';
import { Search, Calendar, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Navbar.module.css';

export default function Navbar({ title, breadcrumb, onActionClick, actionLabel = '+ Створити кампанію' }) {
  const {
    searchQuery,
    setSearchQuery,
    activePlatformFilter,
    togglePlatform,
    dateRange,
    setDateRange,
    setIsCreateModalOpen,
  } = useApp();

  const handleAction = onActionClick || (() => setIsCreateModalOpen(true));

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button
          type="button"
          className={`${styles.badgePill} ${activePlatformFilter === 'Meta Ads' ? styles.badgePillActive : ''}`}
          onClick={() => togglePlatform('Meta Ads')}
          title="Фільтрувати кампанії Meta Ads"
        >
          <span className={styles.dotGreen} />
          <span>Meta Ads</span>
        </button>

        <button
          type="button"
          className={`${styles.badgePill} ${activePlatformFilter === 'TikTok Ads' ? styles.badgePillActive : ''}`}
          onClick={() => togglePlatform('TikTok Ads')}
          title="Фільтрувати кампанії TikTok Ads"
        >
          <span className={styles.dotGreen} />
          <span>TikTok Ads</span>
        </button>

        <select
          className={styles.dateFilter}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option>Останні 7 днів</option>
          <option>Останні 30 днів</option>
          <option>Останні 90 днів</option>
        </select>

        <button type="button" className={styles.primaryBtn} onClick={handleAction}>
          <Plus size={16} />
          <span>{actionLabel}</span>
        </button>
      </div>
    </header>
  );
}
