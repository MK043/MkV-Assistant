import React, { useState } from 'react';
import { X, PlusCircle, Loader2 } from 'lucide-react';
import styles from './CreateCampaignModal.module.css';

export default function CreateCampaignModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Meta Ads');
  const [budget, setBudget] = useState('120');
  const [roasTarget, setRoasTarget] = useState('4.20');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        platform,
        budget,
        roasTarget,
      });
      setName('');
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
          <h2 className={styles.title}>Створення нової кампанії</h2>
          <p className={styles.sub}>Підключення до аукціону Meta Marketing API або TikTok Ads API</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>НАЗВА КАМПАНІЇ</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="напр. EcoCream_Cold_Traffic_UA"
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
              <option value="Meta Ads">Meta Ads (Facebook & Instagram)</option>
              <option value="TikTok Ads">TikTok Ads (Spark Ads)</option>
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
                value={roasTarget}
                onChange={(e) => setRoasTarget(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Ініціалізація кампанії в API...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Запустити кампанію</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
