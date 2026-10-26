import React, { useState } from 'react';
import { Plus, Shield, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './Campaigns.module.css';

export default function Campaigns() {
  const {
    campaigns,
    handleToggleCampaign,
    searchQuery,
    activePlatformFilter,
    setIsCreateModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [cpaGuardActive, setCpaGuardActive] = useState(true);
  const [roasScalerActive, setRoasScalerActive] = useState(true);

  // Dynamic Filtering by tab, platform pill filter, and search
  const filteredCampaigns = campaigns.filter((c) => {
    // Tab filter
    if (activeTab === 'active' && !c.active) return false;
    if (activeTab === 'paused' && c.active) return false;

    // Platform pill filter
    if (activePlatformFilter !== 'all' && c.platform !== activePlatformFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim() && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => c.active).length;
  const pausedCount = campaigns.filter((c) => !c.active).length;

  const formatBudget = (val) => {
    if (typeof val === 'number') return `$${val.toFixed(2)} / день`;
    return String(val);
  };

  const formatSpend = (val) => {
    if (typeof val === 'number') {
      return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return String(val);
  };

  const formatCpa = (val) => {
    if (typeof val === 'number') return `$${val.toFixed(2)}`;
    return String(val);
  };

  const formatRoas = (val) => {
    if (typeof val === 'number') return `${val.toFixed(2)}x`;
    return String(val);
  };

  const getCpaNumber = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  const getRoasNumber = (val) => {
    if (typeof val === 'number') return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, '')) || 0;
  };

  return (
    <div>
      <Navbar
        title="Центр управління кампаніями та медіабаїнгом"
        breadcrumb="MkV CRM / Центр управління кампаніями та медіабаїнгом"
      />

      <div className={styles.container}>
        {/* Filter Tabs & New Campaign CTA */}
        <div className={styles.topBar}>
          <div className={styles.tabsList}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'all' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Всі ({totalCount})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Активні ({activeCount})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'paused' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('paused')}
            >
              На паузі ({pausedCount})
            </button>
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            <span>Нова кампанія</span>
          </button>
        </div>

        {/* Campaigns Table */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Активні рекламні кампанії та медіабаїнг</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>НАЗВА КАМПАНІЇ</th>
                <th>ПЛАТФОРМА</th>
                <th>ДОБОВИЙ БЮДЖЕТ</th>
                <th>ВИТРАТИ</th>
                <th>CPA (ЛІД)</th>
                <th>ROAS</th>
                <th>ТОГЛ ON/OFF</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    Не знайдено кампаній за вибраними критеріями пошуку.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.campaignName}>{c.name}</td>
                    <td>
                      <span className={`${styles.platformPill} ${!c.isMeta ? styles.platformTikTok : ''}`}>
                        {c.platform}
                      </span>
                    </td>
                    <td>{formatBudget(c.budget)}</td>
                    <td style={{ fontWeight: 600 }}>{formatSpend(c.spend)}</td>
                    <td style={{ color: getCpaNumber(c.cpa) > 15 ? 'var(--color-danger)' : 'inherit' }}>
                      {formatCpa(c.cpa)}
                    </td>
                    <td>
                      <span
                        className={styles.roasVal}
                        style={{ color: getRoasNumber(c.roas) >= 3.0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                      >
                        {formatRoas(c.roas)}
                      </span>
                    </td>
                    <td>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          checked={c.active}
                          onChange={() => handleToggleCampaign(c.id)}
                        />
                        <span className={styles.slider} />
                      </label>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Auto-Rules Section */}
        <h2 className={styles.rulesSectionTitle}>Автоматичні правила захисту бюджету (Auto-Rules)</h2>
        <div className={styles.rulesGrid}>
          {/* Rule 1 */}
          <div className={styles.ruleCard}>
            <div>
              <div className={styles.ruleHeader}>
                <div className={styles.ruleTitleWrapper}>
                  <Shield size={18} className={styles.ruleIcon} />
                  <span className={styles.ruleTitle}>Захист від зливу: CPA Guard (&gt; $15.00)</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={cpaGuardActive}
                    onChange={() => setCpaGuardActive(!cpaGuardActive)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              <p className={styles.ruleCondition}>
                <strong>Умова:</strong> якщо за останні 6 годин вартість заявки перевищує $15.00, кампанія миттєво ставиться на паузу.
              </p>
            </div>
            <div className={styles.ruleSavedBadge}>
              Врятовано: $340.00
            </div>
          </div>

          {/* Rule 2 */}
          <div className={styles.ruleCard}>
            <div>
              <div className={styles.ruleHeader}>
                <div className={styles.ruleTitleWrapper}>
                  <TrendingUp size={18} className={styles.ruleIcon} />
                  <span className={styles.ruleTitle}>Авто-масштабування: ROAS Scaler (&gt; 4.0x)</span>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={roasScalerActive}
                    onChange={() => setRoasScalerActive(!roasScalerActive)}
                  />
                  <span className={styles.slider} />
                </label>
              </div>
              <p className={styles.ruleCondition}>
                <strong>Умова:</strong> якщо кампанія приносить ROAS понад 4.0x при мінімум 10 конверсіях, добовий бюджет зростає на +20%.
              </p>
            </div>
            <div
              className={styles.ruleSavedBadge}
              style={{
                color: 'var(--color-success)',
                borderColor: 'var(--color-success-border)',
                backgroundColor: 'var(--color-success-bg)',
              }}
            >
              Приріст лідів: +18%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
