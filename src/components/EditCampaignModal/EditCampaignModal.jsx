import React, { useState, useEffect } from 'react';
import { X, Check, Save } from 'lucide-react';
import styles from './EditCampaignModal.module.css';

export default function EditCampaignModal({ campaign, isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Meta Ads');
  const [budget, setBudget] = useState(100);
  const [roas, setRoas] = useState(3.5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaign) {
      setName(campaign.name || '');
      setPlatform(campaign.platform || 'Meta Ads');
      const b = typeof campaign.budget === 'number'
        ? campaign.budget
        : parseFloat(String(campaign.budget).replace(/[^0-9.]/g, '')) || 100;
      setBudget(b);
      const r = typeof campaign.roas === 'number'
        ? campaign.roas
        : parseFloat(String(campaign.roas).replace(/[^0-9.]/g, '')) || 3.5;
      setRoas(r);
    }
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  const budgetNum = Number(budget) || 10;
  const roasNum = Number(roas) || 1.0;
  const projectedMonthlySpend = budgetNum * 30;
  const projectedLeads = Math.round(projectedMonthlySpend / 11.2);
  const projectedRevenue = Math.round(projectedMonthlySpend * roasNum);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave(campaign.id, {
        name: name.trim(),
        platform,
        budget: budgetNum,
        roas: roasNum,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          <X size={18} />
        </button>

        <div className={styles.header}>
          <h2 className={styles.title}>Редагування рекламної кампанії</h2>
          <p className={styles.sub}>Оновлення параметрів бюджету та таргетингу в режимі реального часу</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>НАЗВА КАМПАНІЇ</label>
            <input
              type="text"
              required
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>РЕКЛАМНА ПЛАТФОРМА</label>
            <select
              className={styles.select}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="Meta Ads">Meta Ads (Facebook Feed & Instagram Reels)</option>
              <option value="TikTok Ads">TikTok Ads (Spark Ads & In-Feed Video)</option>
            </select>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label className={styles.label}>ДОБОВИЙ БЮДЖЕТ ($)</label>
              <input
                type="number"
                required
                min="10"
                step="5"
                className={styles.input}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ЦІЛЬОВИЙ ROAS (X)</label>
              <input
                type="number"
                required
                min="1.0"
                step="0.1"
                className={styles.input}
                value={roas}
                onChange={(e) => setRoas(e.target.value)}
              />
            </div>
          </div>

          {/* Real-time scaling projection */}
          <div className={styles.projectionBox}>
            <span className={styles.projectionTitle}>Прогноз окупності при зміні бюджету (30 днів)</span>
            <div className={styles.projectionGrid}>
              <div className={styles.projectionItem}>
                <span className={styles.projectionLabel}>Витрати</span>
                <span className={styles.projectionVal}>${projectedMonthlySpend.toLocaleString()}</span>
              </div>
              <div className={styles.projectionItem}>
                <span className={styles.projectionLabel}>Очікувані ліди</span>
                <span className={styles.projectionVal} style={{ color: 'var(--color-success)' }}>
                  ~{projectedLeads}
                </span>
              </div>
              <div className={styles.projectionItem}>
                <span className={styles.projectionLabel}>Прогноз виручки</span>
                <span className={styles.projectionVal} style={{ color: 'var(--accent-primary-light)' }}>
                  ${projectedRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            <Save size={16} />
            <span>{isSubmitting ? 'Збереження в Meta API...' : 'Зберегти зміни'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
