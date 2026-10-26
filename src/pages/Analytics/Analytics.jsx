import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MetricCard from '../../components/MetricCard/MetricCard';
import RoasCalculator from '../../components/RoasCalculator/RoasCalculator';
import { useApp } from '../../context/AppContext';
import styles from './Analytics.module.css';

export default function Analytics() {
  const { campaigns, searchQuery, activePlatformFilter, dateRange } = useApp();

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = activePlatformFilter === 'all' || c.platform === activePlatformFilter;
    return matchesSearch && matchesPlatform;
  });

  const dateMultiplier = {
    'Сьогодні': 0.08,
    'Останні 7 днів': 0.28,
    'Останні 30 днів': 1.0,
    'Останні 90 днів': 2.9,
  }[dateRange] || 1.0;

  const rawSpend = filteredCampaigns.reduce((acc, c) => acc + (c.spend || 0), 0) || 14820;
  const rawLeads = filteredCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0) || 1240;

  const totalSpend = Math.round(rawSpend * dateMultiplier);
  const totalLeads = Math.round(rawLeads * dateMultiplier);
  const avgRoas = filteredCampaigns.length
    ? (filteredCampaigns.reduce((acc, c) => acc + Number(c.roas || 3.5), 0) / filteredCampaigns.length).toFixed(2)
    : '3.82';
  const cpl = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(2) : '11.95';

  const metaSpend = Math.round(8920 * dateMultiplier);
  const tikTokSpend = Math.round(5900 * dateMultiplier);

  return (
    <div>
      <Navbar
        title="Головна панель аналітики (Analytics Dashboard)"
        breadcrumb={`MkV CRM / Аналітика (${dateRange})`}
      />

      <div className={styles.container}>
        {/* Top 4 KPI Metrics */}
        <div className={styles.metricsGrid}>
          <MetricCard
            title="Витрачений бюджет"
            value={`$${totalSpend.toLocaleString()}`}
            statusText={`Період: ${dateRange}`}
            statusType="positive"
          />
          <MetricCard
            title="Кількість лідів"
            value={totalLeads.toLocaleString()}
            statusText="↑ +12.1% приріст"
            statusType="positive"
          />
          <MetricCard
            title="Середня окупність (ROAS)"
            value={`${avgRoas}x`}
            statusText="Ціль > 3.0x виконано"
            statusType="positive"
          />
          <MetricCard
            title="Вартість ліда (CPL)"
            value={`$${cpl}`}
            statusText="↓ -1.5$ економія"
            statusType="positive"
          />
        </div>

        {/* Dynamic Curved Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Динаміка конверсій та витрат ({dateRange})</h2>
              <p className={styles.chartSub}>
                {activePlatformFilter === 'all'
                  ? 'Порівняння ефективності реклами Meta Ads та TikTok Ads'
                  : `Фільтр за платформою: ${activePlatformFilter}`}
              </p>
            </div>
            <div className={styles.chartLegend}>
              {(activePlatformFilter === 'all' || activePlatformFilter === 'Meta Ads') && (
                <span className={styles.legendMeta}>● Meta Ads (${metaSpend.toLocaleString()})</span>
              )}
              {(activePlatformFilter === 'all' || activePlatformFilter === 'TikTok Ads') && (
                <span className={styles.legendTikTok}>● TikTok Ads (${tikTokSpend.toLocaleString()})</span>
              )}
            </div>
          </div>

          <div className={styles.chartSvgWrapper}>
            <svg viewBox="0 0 800 200" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="metaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818CF8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="tikGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34D399" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#34D399" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {(activePlatformFilter === 'all' || activePlatformFilter === 'Meta Ads') && (
                <>
                  <path
                    d="M 0 160 Q 200 120, 350 140 T 600 90 T 800 50 L 800 200 L 0 200 Z"
                    fill="url(#metaGrad)"
                  />
                  <path
                    d="M 0 160 Q 200 120, 350 140 T 600 90 T 800 50"
                    fill="none"
                    stroke="#818CF8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              )}

              {(activePlatformFilter === 'all' || activePlatformFilter === 'TikTok Ads') && (
                <>
                  <path
                    d="M 0 180 Q 200 150, 350 160 T 600 120 T 800 80 L 800 200 L 0 200 Z"
                    fill="url(#tikGrad)"
                  />
                  <path
                    d="M 0 180 Q 200 150, 350 160 T 600 120 T 800 80"
                    fill="none"
                    stroke="#34D399"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </div>

          <div className={styles.chartAxis}>
            <span>Початок періоду</span>
            <span>+25% часу</span>
            <span>Середина</span>
            <span>+75% часу</span>
            <span>Сьогодні</span>
          </div>
        </div>

        {/* Campaigns Summary Table */}
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>
            Зведені результати рекламних кампаній ({filteredCampaigns.length})
          </h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>НАЗВА КАМПАНІЇ</th>
                <th>ПЛАТФОРМА</th>
                <th>БЮДЖЕТ/ДЕНЬ</th>
                <th>ВИТРАТИ ({dateRange})</th>
                <th>ЛІДИ</th>
                <th>ROAS</th>
                <th>СТАТУС</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((c) => {
                const cSpend = Math.round((c.spend || 0) * dateMultiplier);
                const cLeads = Math.round((c.leads || 0) * dateMultiplier);
                return (
                  <tr key={c.id}>
                    <td className={styles.campaignName}>{c.name}</td>
                    <td>
                      <span className={`${styles.platformPill} ${!c.isMeta ? styles.platformTikTok : ''}`}>
                        {c.platform}
                      </span>
                    </td>
                    <td>${c.budget}/день</td>
                    <td style={{ fontWeight: 600 }}>${cSpend.toLocaleString()}</td>
                    <td>{cLeads}</td>
                    <td>
                      <span
                        className={styles.roasVal}
                        style={{ color: parseFloat(c.roas) >= 3.0 ? 'var(--color-success)' : 'var(--color-warning)' }}
                      >
                        {c.roas}x
                      </span>
                    </td>
                    <td>
                      <span className={c.active ? styles.statusActive : styles.statusPaused}>
                        {c.active ? 'Активна' : 'На паузі'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Unit Economics & Scale Simulator */}
        <RoasCalculator />
      </div>
    </div>
  );
}
