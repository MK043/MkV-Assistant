import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import MetricCard from '../../components/MetricCard/MetricCard';
import styles from './Analytics.module.css';

export default function Analytics() {
  const [campaigns] = useState([
    { id: 1, name: 'EcoCream_Scale_EU', platform: 'Meta Ads', isMeta: true, budget: '$120/день', spend: '$3,450', leads: 312, roas: '4.12x', status: 'Активна' },
    { id: 2, name: 'TikTok_Viral_Spark_UA', platform: 'TikTok Ads', isMeta: false, budget: '$80/день', spend: '$2,180', leads: 240, roas: '3.95x', status: 'Активна' },
    { id: 3, name: 'Retargeting_AbandonedCart', platform: 'Meta Ads', isMeta: true, budget: '$50/день', spend: '$1,420', leads: 185, roas: '4.80x', status: 'Активна' },
    { id: 4, name: 'Lookalike_Broad_PL', platform: 'Meta Ads', isMeta: true, budget: '$70/день', spend: '$1,890', leads: 114, roas: '2.45x', status: 'На паузі' },
  ]);

  return (
    <div>
      <Navbar
        title="Головна панель аналітики (Analytics Dashboard)"
        breadcrumb="MkV CRM / Головна панель аналітики (Analytics Dashboard)"
      />

      <div className={styles.container}>
        {/* Top 4 KPI Metrics */}
        <div className={styles.metricsGrid}>
          <MetricCard
            title="Витрачений бюджет"
            value="$14,820.00"
            statusText="↑ +8.4% у нормі"
            statusType="positive"
          />
          <MetricCard
            title="Кількість лідів"
            value="1,240"
            statusText="↑ +12.1% приріст"
            statusType="positive"
          />
          <MetricCard
            title="Середня окупність (ROAS)"
            value="3.82x"
            statusText="Ціль > 3.0x виконано"
            statusType="positive"
          />
          <MetricCard
            title="Вартість ліда (CPL)"
            value="$11.95"
            statusText="↓ -1.5$ економія"
            statusType="positive"
          />
        </div>

        {/* Dynamic Curved Chart */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Динаміка конверсій та витрат за 30 днів</h2>
              <p className={styles.chartSub}>Порівняння ефективності реклами Meta Ads та TikTok Ads</p>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendMeta}>● Meta Ads ($8,920)</span>
              <span className={styles.legendTikTok}>● TikTok Ads ($5,900)</span>
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

              {/* Gridlines */}
              <line x1="0" y1="40" x2="800" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="800" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />

              {/* Area Fills */}
              <path
                d="M 0 160 Q 200 120, 350 140 T 600 90 T 800 50 L 800 200 L 0 200 Z"
                fill="url(#metaGrad)"
              />
              <path
                d="M 0 180 Q 200 150, 350 160 T 600 120 T 800 80 L 800 200 L 0 200 Z"
                fill="url(#tikGrad)"
              />

              {/* Smooth Curves */}
              <path
                d="M 0 160 Q 200 120, 350 140 T 600 90 T 800 50"
                fill="none"
                stroke="#818CF8"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 180 Q 200 150, 350 160 T 600 120 T 800 80"
                fill="none"
                stroke="#34D399"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className={styles.chartAxis}>
            <span>1 Лист</span>
            <span>5 Лист</span>
            <span>10 Лист</span>
            <span>15 Лист</span>
            <span>20 Лист</span>
            <span>25 Лист</span>
            <span>30 Лист</span>
          </div>
        </div>

        {/* Campaigns Summary Table */}
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Зведені результати рекламних кампаній</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>НАЗВА КАМПАНІЇ</th>
                <th>ПЛАТФОРМА</th>
                <th>БЮДЖЕТ/ДЕНЬ</th>
                <th>ВИТРАТИ</th>
                <th>ЛІДИ</th>
                <th>ROAS</th>
                <th>СТАТУС</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td className={styles.campaignName}>{c.name}</td>
                  <td>
                    <span className={`${styles.platformPill} ${!c.isMeta ? styles.platformTikTok : ''}`}>
                      {c.platform}
                    </span>
                  </td>
                  <td>{c.budget}</td>
                  <td style={{ fontWeight: 600 }}>{c.spend}</td>
                  <td>{c.leads}</td>
                  <td>
                    <span className={styles.roasVal} style={{ color: parseFloat(c.roas) > 3.0 ? 'var(--color-success)' : 'var(--color-warning)' }}>
                      {c.roas}
                    </span>
                  </td>
                  <td>
                    <span className={c.status === 'Активна' ? styles.statusActive : styles.statusPaused}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
