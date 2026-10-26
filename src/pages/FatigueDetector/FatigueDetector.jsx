import React, { useState } from 'react';
import { Zap, Check, RefreshCw } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './FatigueDetector.module.css';

export default function FatigueDetector() {
  const [selectedHookId, setSelectedHookId] = useState(1);
  const [creatives, setCreatives] = useState([
    { id: 1, name: 'EcoCream_Hook_Curiosity', platform: 'Meta Reels', holdRate: '48.2% (Відмінно)', freq: '1.6x', status: 'effective', action: 'Масштабувати' },
    { id: 2, name: 'TikTok_Spark_Review', platform: 'TikTok Ads', holdRate: '39.5% (Добре)', freq: '2.1x', status: 'stable', action: 'Спостереження' },
    { id: 3, name: 'SummerSale_OldHook', platform: 'TikTok / Reels', holdRate: '14.8% (Падіння!)', freq: '3.4x', status: 'fatigued', action: 'Замінити хук ⚡' },
  ]);

  const hooks = [
    {
      id: 1,
      variant: 'ВАРІАНТ 1 (ШІ)',
      quote: '«Ця помилка в догляді коштує тобі чистої шкіри...»',
      trigger: 'Психологічний тригер: страх втрати + інтрига.',
      forecast: 'Прогноз Hold: +24%'
    },
    {
      id: 2,
      variant: 'ВАРІАНТ 2 (ШІ)',
      quote: '«3 причини, чому твій крем не працює влітку...»',
      trigger: 'Психологічний тригер: список + сезонність.',
      forecast: 'Прогноз Hold: +19%'
    },
    {
      id: 3,
      variant: 'ВАРІАНТ 3 (ШІ)',
      quote: '«Показую засіб, який замінив мені 5 баночок...»',
      trigger: 'Психологічний тригер: особистий досвід (UGC).',
      forecast: 'Прогноз Hold: +28%'
    }
  ];

  const handleApplyHook = () => {
    const selected = hooks.find(h => h.id === selectedHookId);
    alert(`Хук "${selected.variant}" успішно замінено у Meta & TikTok через Conversions API без скидання навчання!`);
  };

  return (
    <div>
      <Navbar
        title="Детектор вигорання аудиторії та хуки (Ad Fatigue)"
        breadcrumb="MkV CRM / Детектор вигорання аудиторії та хуки (Ad Fatigue)"
      />

      <div className={styles.container}>
        {/* Top Summary Row */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>Загальний індекс втоми аудиторії (Fatigue Score)</span>
            <div className={styles.fatigueScoreVal}>24% — Норма</div>
            <div className={styles.progressBarTrack}>
              <div className={styles.progressBarFill} />
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>Стан аудиторії: Стабільний</span>
            <p className={styles.statusDesc}>
              Частота показів (Frequency) 1.8x знаходиться в безпечній зоні. Лише 1 оголошення потребує заміни початкових 3 секунд.
            </p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.creativesCount}>
              <span>Активних креативів: 12</span>
              <span>Потребують оновлення: 1 креатив</span>
            </div>
          </div>
        </div>

        {/* 3s Hold Rate Analysis Table */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Аналіз утримання уваги на перших секундах (3s Hold Rate)</h2>
            <p className={styles.cardSub}>Показник того, скільки людей дивляться відео після перших 3 секунд (хука)</p>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>КРЕАТИВ ТА ХУК</th>
                <th>ПЛАТФОРМА</th>
                <th>3s HOLD RATE</th>
                <th>ЧАСТОТА (FREQ)</th>
                <th>СТАН КРЕАТИВУ</th>
                <th>ДІЯ</th>
              </tr>
            </thead>
            <tbody>
              {creatives.map((c) => (
                <tr key={c.id}>
                  <td className={styles.creativeName}>{c.name}</td>
                  <td>
                    <span className={styles.platformPill}>{c.platform}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: c.status === 'fatigued' ? 'var(--color-danger)' : 'inherit' }}>
                    {c.holdRate}
                  </td>
                  <td>{c.freq}</td>
                  <td>
                    {c.status === 'effective' && <span className={styles.badgeEffective}>Ефективний ✓</span>}
                    {c.status === 'stable' && <span className={styles.badgeStable}>Стабільний</span>}
                    {c.status === 'fatigued' && <span className={styles.badgeFatigued}>Вигорання креативу</span>}
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${c.status === 'fatigued' ? styles.actionBtnActive : ''}`}
                      onClick={() => c.status === 'fatigued' ? alert('Відкрито швидку ротацію хуків нижче') : alert(`Дію "${c.action}" запущено`)}
                    >
                      {c.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Hook Rotation Panel */}
        <div className={styles.rotationPanel}>
          <div>
            <h2 className={styles.cardTitle}>Швидка ротація хука для «SummerSale_OldHook»</h2>
            <p className={styles.cardSub}>
              Не потрібно перезапускати кампанію та втрачати історію навчання пікселя — просто замініть перші 3 секунди ролика:
            </p>
          </div>

          <div className={styles.hooksGrid}>
            {hooks.map((h) => {
              const isSelected = selectedHookId === h.id;
              return (
                <div
                  key={h.id}
                  className={`${styles.hookCard} ${isSelected ? styles.hookCardActive : ''}`}
                >
                  <span className={styles.hookVariantBadge}>{h.variant}</span>
                  <p className={styles.hookQuote}>{h.quote}</p>
                  <p className={styles.hookTrigger}>{h.trigger}</p>
                  <span className={styles.hookForecast}>{h.forecast}</span>
                  <button
                    type="button"
                    className={`${styles.selectHookBtn} ${isSelected ? styles.selectHookBtnActive : ''}`}
                    onClick={() => setSelectedHookId(h.id)}
                  >
                    {isSelected ? '✓ Обрати цей хук' : 'Обрати варіант'}
                  </button>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.applyAllBtn}
            onClick={handleApplyHook}
          >
            <Zap size={16} />
            <span>Оновити хук у Facebook & TikTok без перезапуску кампанії</span>
          </button>
        </div>
      </div>
    </div>
  );
}
