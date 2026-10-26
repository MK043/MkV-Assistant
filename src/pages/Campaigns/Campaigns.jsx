import React, { useState } from 'react';
import { Plus, Shield, TrendingUp, Edit3, Copy, Trash2, Download, RefreshCw, Activity } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './Campaigns.module.css';

export default function Campaigns() {
  const {
    campaigns,
    handleToggleCampaign,
    handleDuplicateCampaign,
    handleDeleteCampaign,
    handleSimulateLiveTick,
    setEditingCampaign,
    liveAlert,
    liveSyncActive,
    setLiveSyncActive,
    searchQuery,
    activePlatformFilter,
    setIsCreateModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [cpaGuardActive, setCpaGuardActive] = useState(true);
  const [roasScalerActive, setRoasScalerActive] = useState(true);

  // Dynamic Filtering by tab and search
  const filteredCampaigns = campaigns.filter((c) => {
    // Tab filter
    if (activeTab === 'active' && !c.active) return false;
    if (activeTab === 'paused' && c.active) return false;
    if (activeTab === 'Meta Ads' && c.platform !== 'Meta Ads') return false;
    if (activeTab === 'TikTok Ads' && c.platform !== 'TikTok Ads') return false;

    // Search query filter
    if (searchQuery.trim() && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  const totalCount = campaigns.length;
  const activeCount = campaigns.filter((c) => c.active).length;
  const pausedCount = campaigns.filter((c) => !c.active).length;
  const metaCount = campaigns.filter((c) => c.platform === 'Meta Ads').length;
  const tikTokCount = campaigns.filter((c) => c.platform === 'TikTok Ads').length;

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

  const handleExportCsv = () => {
    const headers = ['ID,Назва кампанії,Платформа,Добовий бюджет ($),Витрати ($),Ліди,CPA ($),ROAS,Статус'];
    const rows = campaigns.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.platform}"`,
      c.budget,
      c.spend,
      c.leads || 0,
      c.cpa,
      c.roas,
      c.active ? 'Активна' : 'На паузі',
    ].join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MkV_Campaigns_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Navbar title="Управління рекламними кампаніями" />

      <div className={styles.container}>
        {liveAlert && (
          <div className={styles.alertBanner}>
            <Activity size={16} />
            <span>{liveAlert}</span>
          </div>
        )}

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
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'Meta Ads' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('Meta Ads')}
            >
              Meta ({metaCount})
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'TikTok Ads' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('TikTok Ads')}
            >
              TikTok ({tikTokCount})
            </button>
          </div>

          <div className={styles.actionsWrapper}>
            <button
              type="button"
              className={`${styles.secondaryBtn} ${liveSyncActive ? styles.liveBtnActive : ''}`}
              onClick={() => setLiveSyncActive(!liveSyncActive)}
              title="Автоматичний пульс лідів кожні 7 секунд"
            >
              <Activity size={15} />
              <span>{liveSyncActive ? '● Live Sync (Увімкнено)' : 'Live Sync (Пульс)'}</span>
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleSimulateLiveTick}
              title="Оновити витрати та отримати нові заявки"
            >
              <RefreshCw size={15} />
              <span>Оновити метрики</span>
            </button>

            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleExportCsv}
              title="Завантажити звіт кампаній у форматі CSV"
            >
              <Download size={15} />
              <span>Експорт CSV</span>
            </button>

            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={16} />
              <span>Нова кампанія</span>
            </button>
          </div>
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
                <th>СТАТУС</th>
                <th>ДІЇ ТАРГЕТОЛОГА</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
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
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Редагувати параметри кампанії"
                          onClick={() => setEditingCampaign(c)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.iconBtn}
                          title="Дублювати кампанію"
                          onClick={() => handleDuplicateCampaign(c.id)}
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Видалити або архівувати"
                          onClick={() => handleDeleteCampaign(c.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
