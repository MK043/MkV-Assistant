import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

export default function Sidebar({ onOpenAuth }) {
  const navItems = [
    { label: 'Огляд платформи', path: '/hub' },
    { label: 'Дашборд аналітики', path: '/analytics' },
    { label: 'ШІ-Студія сценаріїв', path: '/creative' },
    { label: 'Кампанії та медіабаїнг', path: '/campaigns' },
    { label: 'Вигорання та хуки', path: '/fatigue' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div>
        <div className={styles.brand}>
          <div className={styles.logoBadge}>MkV</div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>MkV Sales Manager</span>
            <span className={styles.brandSubtitle}>CRM • Media Buying OS</span>
          </div>
        </div>

        <div className={styles.navGroup}>
          <span className={styles.groupLabel}>ОСНОВНЕ МЕНЮ</span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navDot} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className={styles.navGroup}>
          <span className={styles.groupLabel}>БЕЗПЕКА</span>
          <button
            type="button"
            className={styles.navItem}
            onClick={onOpenAuth}
          >
            <span className={styles.navDot} />
            <span>Авторизація / Вхід</span>
          </button>
        </div>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>МБ</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Михайло Багин</span>
          <span className={styles.userSub}>Студент ІПЗ-1 • УжНУ</span>
        </div>
        <div className={styles.statusDot} title="Online" />
      </div>
    </aside>
  );
}
