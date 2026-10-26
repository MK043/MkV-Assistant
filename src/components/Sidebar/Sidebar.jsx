import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const { user, setIsAuthModalOpen, handleLogout } = useApp();

  const navItems = [
    { label: 'Огляд платформи', path: '/hub' },
    { label: 'Дашборд аналітики', path: '/analytics' },
    { label: 'ШІ-Студія сценаріїв', path: '/creative' },
    { label: 'Кампанії та медіабаїнг', path: '/campaigns' },
    { label: 'Вигорання та хуки', path: '/fatigue' },
  ];

  const getInitials = (name) => {
    if (!name) return 'MK';
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : name.slice(0, 2).toUpperCase();
  };

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
          <span className={styles.groupLabel}>БЕЗПЕКА ТА ДОСТУП</span>
          {user.isLoggedIn ? (
            <button
              type="button"
              className={styles.navItem}
              onClick={handleLogout}
              title="Натисніть для виходу"
            >
              <span className={styles.navDot} />
              <span>Вийти з кабінету</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.navItem}
              onClick={() => setIsAuthModalOpen(true)}
            >
              <span className={styles.navDot} />
              <span>Авторизація / Вхід</span>
            </button>
          )}
        </div>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{getInitials(user.name)}</div>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userSub}>{user.role}</span>
        </div>
        <div
          className={styles.statusDot}
          style={{ backgroundColor: user.isLoggedIn ? 'var(--color-success)' : 'var(--text-disabled)' }}
          title={user.isLoggedIn ? 'Авторизовано в системі' : 'Гість'}
        />
      </div>
    </aside>
  );
}
