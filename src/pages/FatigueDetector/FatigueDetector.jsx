import React, { useState } from 'react';
import { Zap, CheckCircle2, RefreshCw } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './FatigueDetector.module.css';

export default function FatigueDetector() {
  const { fatigue, handleRotateHook } = useApp();
  const [selectedHookId, setSelectedHookId] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState('');

  const hooks = [
    {
      id: 1,
      variant: 'ВАРІАНТ 1 (ШІ)',
      quote: '«Ця помилка в догляді коштує тобі чистої шкіри...»',
      trigger: 'Психологічний тригер: страх втрати + інтрига.',
      forecast: 'Прогноз Hold: +24%',
    },
    {
      id: 2,
      variant: 'ВАРІАНТ 2 (ШІ)',
      quote: '«3 причини, чому твій крем не працює влітку...»',
      trigger: 'Психологічний тригер: список + сезонність.',
      forecast: 'Прогноз Hold: +19%',
    },
    {
      id: 3,
      variant: 'ВАРІАНТ 3 (ШІ)',
      quote: '«Показую засіб, який замінив мені 5 баночок...»',
      trigger: 'Психологічний тригер: особистий досвід (UGC).',
      forecast: 'Прогноз Hold: +28%',
    },
  ];

  const currentScore = fatigue?.score ?? 24;
  const currentStatusLabel = fatigue?.statusLabel ?? 'Норма';
  const currentFrequency = fatigue?.frequency ?? '1.8x';
  const creativesList = fatigue?.creatives ?? [
    { id: 1, name: 'EcoCream_Hook_Curiosity', platform: 'Meta Reels', holdRate: '48.2%', freq: '1.6x', status: 'effective', action: 'Масштабувати' },
    { id: 2, name: 'TikTok_Spark_Review', platform: 'TikTok Ads', holdRate: '39.5%', freq: '2.1x', status: 'stable', action: 'Спостереження' },
    { id: 3, name: 'SummerSale_OldHook', platform: 'TikTok / Reels', holdRate: '14.8%', freq: '3.4x', status: 'fatigued', action: 'Замінити хук ⚡' },
  ];

  const fatiguedCount = creativesList.filter((c) => c.status === 'fatigued').length;

  const handleApplyHook = async () => {
    const selected = hooks.find((h) => h.id === selectedHookId);
    if (!selected) return;

    setIsUpdating(true);
    try {
      await handleRotateHook(selected.variant);
      setNotification(
        `Хук «${selected.variant}» успішно синхронізовано з Meta Ads & TikTok Ads. Hold Rate відновлено!`
      );
      setTimeout(() => setNotification(''), 6000);
    } finally {
      setIsUpdating(false);
    }
  };

  const scrollToRotation = () => {
    const el = document.getElementById('hook-rotation-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar
        title="Детектор вигорання аудиторії та хуки"
        subtitle="Моніторинг втоми креативів, частоти показу та ротація хуків"
      />

      <div className={styles.container}>
        {notification && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* Top Summary Row */}
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>Загальний індекс втоми аудиторії (Fatigue Score)</span>
            <div
              className={styles.fatigueScoreVal}
              style={{ color: currentScore <= 20 ? 'var(--color-success)' : 'var(--accent-primary-light)' }}
            >
              {currentScore}% — {currentStatusLabel}
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${currentScore}%`,
                  backgroundColor: currentScore <= 20 ? 'var(--color-success)' : 'var(--accent-primary)',
                }}
              />
            </div>
          </div>

          <div className={styles.summaryCard}>
            <span className={styles.summaryTitle}>Стан аудиторії: {currentStatusLabel}</span>
            <p className={styles.statusDesc}>
              Частота показів (Frequency) {currentFrequency} знаходиться в безпечній зоні.
              {fatiguedCount > 0
                ? ` ${fatiguedCount} оголошення потребує заміни перших 3 секунд.`
                : ' Усі активні креативи мають високий рівень утримання (Hold Rate).'}
            </p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.creativesCount}>
              <span>Активних креативів: {creativesList.length}</span>
              <span style={{ color: fatiguedCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {fatiguedCount > 0
                  ? `Потребують оновлення: ${fatiguedCount} креатив`
                  : 'Потребують оновлення: 0 (Все оптимізовано)'}
              </span>
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
              {creativesList.map((c) => (
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
                      onClick={() => {
                        if (c.status === 'fatigued') {
                          scrollToRotation();
                        } else {
                          setNotification(`Параметри «${c.name}» зафіксовано для алгоритму авто-оптимізації.`);
                          setTimeout(() => setNotification(''), 4000);
                        }
                      }}
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
        <div id="hook-rotation-panel" className={styles.rotationPanel}>
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
            disabled={isUpdating}
            className={styles.applyAllBtn}
            onClick={handleApplyHook}
          >
            {isUpdating ? <RefreshCw size={16} className={styles.spin} /> : <Zap size={16} />}
            <span>
              {isUpdating
                ? 'Оновлення креативу в рекламних кабінетах...'
                : 'Оновити хук у Facebook & TikTok без перезапуску кампанії'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
