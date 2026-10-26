import React, { useState } from 'react';
import { Plus, Shield, TrendingUp } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Campaigns.module.css';

export default function Campaigns() {
  const [activeTab, setActiveTab] = useState('all');
  const [cpaGuardActive, setCpaGuardActive] = useState(true);
  const [roasScalerActive, setRoasScalerActive] = useState(true);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'EcoCream_Broad_Traffic', platform: 'Meta Ads', isMeta: true, budget: '$150.00 / день', spend: '$4,120.00', cpa: '$10.40', roas: '4.20x', active: true },
    { id: 2, name: 'TikTok_Spark_TopHook', platform: 'TikTok Ads', isMeta: false, budget: '$100.00 / день', spend: '$2,650.00', cpa: '$9.80', roas: '4.50x', active: true },
    { id: 3, name: 'Retargeting_Catalog_UA', platform: 'Meta Ads', isMeta: true, budget: '$60.00 / день', spend: '$1,280.00', cpa: '$12.10', roas: '3.80x', active: true },
    { id: 4, name: 'Promo_BlackFriday_Teaser', platform: 'TikTok Ads', isMeta: false, budget: '$50.00 / день', spend: '$840.00', cpa: '$18.90', roas: '1.80x', active: false },
    { id: 5, name: 'Old_Creative_Test_PL', platform: 'Meta Ads', isMeta: true, budget: '$30.00 / день', spend: '$420.00', cpa: '$16.20', roas: '2.10x', active: false },
  ]);

  const toggleCampaign = (id) => {
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (activeTab === 'active') return c.active;
    if (activeTab === 'paused') return !c.active;
    return true;
  });

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
              Всі (8)
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'active' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Активні (5)
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeTab === 'paused' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('paused')}
            >
              На паузі (3)
            </button>
          </div>

          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => alert('Створення нової кампанії: підключення Meta Graph API v19')}
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
              {filteredCampaigns.map((c) => (
                <tr key={c.id}>
                  <td className={styles.campaignName}>{c.name}</td>
                  <td>
                    <span className={`${styles.platformPill} ${!c.isMeta ? styles.platformTikTok : ''}`}>
                      {c.platform}
                    </span>
                  </td>
                  <td>{c.budget}</td>
                  <td style={{ fontWeight: 600 }}>{c.spend}</td>
                  <td style={{ color: parseFloat(c.cpa.replace('$', '')) > 15 ? 'var(--color-danger)' : 'inherit' }}>
                    {c.cpa}
                  </td>
                  <td>
                    <span className={styles.roasVal} style={{ color: parseFloat(c.roas) >= 3.0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {c.roas}
                    </span>
                  </td>
                  <td>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        checked={c.active}
                        onChange={() => toggleCampaign(c.id)}
                      />
                      <span className={styles.slider} />
                    </label>
                  </td>
                </tr>
              ))}
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
            <div className={styles.ruleSavedBadge} style={{ color: 'var(--color-success)', borderColor: 'var(--color-success-border)', backgroundColor: 'var(--color-success-bg)' }}>
              Приріст лідів: +18%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
