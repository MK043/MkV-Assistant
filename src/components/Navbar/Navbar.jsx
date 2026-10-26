import React from 'react';
import { Search, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Navbar.module.css';

export default function Navbar({ title, onActionClick, actionLabel = '+ Створити кампанію' }) {
  const {
    searchQuery,
    setSearchQuery,
    dateRange,
    setDateRange,
    setIsCreateModalOpen,
  } = useApp();

  const handleAction = onActionClick || (() => setIsCreateModalOpen(true));

  return (
    <header className={styles.navbar}>
      <div className={styles.headerInfo}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <Search size={15} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Пошук по системі..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.dateFilter}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option>Сьогодні</option>
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
