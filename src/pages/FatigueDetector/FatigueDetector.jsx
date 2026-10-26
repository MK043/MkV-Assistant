import React, { useState, useMemo } from 'react';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  Activity,
  DollarSign,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './FatigueDetector.module.css';

export default function FatigueDetector() {
  const { fatigue, handleRotateHook } = useApp();

  // Active creative selected for hook rotation
  const [selectedCreativeId, setSelectedCreativeId] = useState(3);
  const [selectedHookId, setSelectedHookId] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState('');

  // Creatives list from context / storage
  const creativesList = useMemo(() => {
    return (
      fatigue?.creatives ?? [
        {
          id: 1,
          name: 'EcoCream_Hook_Curiosity',
          platform: 'Meta Reels',
          holdRate: '48.2%',
          holdRateNum: 48.2,
          freq: '1.6x',
          cpa: '$6.80',
          wasteDrain: 0,
          status: 'effective',
          action: 'Масштабувати',
        },
        {
          id: 2,
          name: 'TikTok_Spark_Review',
          platform: 'TikTok Ads',
          holdRate: '39.5%',
          holdRateNum: 39.5,
          freq: '2.1x',
          cpa: '$9.40',
          wasteDrain: 0,
          status: 'stable',
          action: 'Спостереження',
        },
        {
          id: 3,
          name: 'SummerSale_OldHook',
          platform: 'TikTok / Reels',
          holdRate: '14.8%',
          holdRateNum: 14.8,
          freq: '3.6x',
          cpa: '$18.90',
          wasteDrain: 280,
          status: 'fatigued',
          action: 'Замінити хук ⚡',
        },
      ]
    );
  }, [fatigue]);

  // Selected creative
  const activeCreative = useMemo(() => {
    return (
      creativesList.find((c) => c.id === selectedCreativeId) ||
      creativesList.find((c) => c.status === 'fatigued') ||
      creativesList[0]
    );
  }, [creativesList, selectedCreativeId]);

  // Summary Metrics
  const fatiguedCount = creativesList.filter((c) => c.status === 'fatigued').length;
  const currentScore = fatigue?.score ?? (fatiguedCount > 0 ? 28 : 12);
  const totalWaste = creativesList.reduce((acc, c) => acc + (c.wasteDrain || 0), 0);

  // 3 Tailored Hook Options (concise, high-impact)
  const hooks = useMemo(() => {
    return [
      {
        id: 1,
        tag: 'Біль → Рішення',
        quote: '«Ця помилка в догляді коштує тобі чистої шкіри та грошей на косметологів...»',
        trigger: 'Викриття прихованого болю + страх марних витрат',
        forecast: '+28% Hold • CPA -25%',
      },
      {
        id: 2,
        tag: 'Інтрига / Злам шаблону',
        quote: '«Чому дерматологи мовчать про компонент, який є в кожному кремі за $80?»',
        trigger: 'Pattern Interrupt у перші 1.5 сек + розкриття таємниці',
        forecast: '+34% Hold • CPA -30%',
      },
      {
        id: 3,
        tag: 'UGC / Відгук покупця',
        quote: '«Показую засіб, який замінив мені 5 баночок на полиці. Шкіра сяє без тоналки...»',
        trigger: 'Особистий досвід реальної людини (ефект подруги)',
        forecast: '+31% Hold • CPA -26%',
      },
    ];
  }, []);

  const handleApply = async () => {
    const selected = hooks.find((h) => h.id === selectedHookId);
    if (!selected || !activeCreative) return;

    setIsUpdating(true);
    try {
      await handleRotateHook(selected.tag, activeCreative.id);
      setNotification(
        `Хук «${selected.tag}» впроваджено для «${activeCreative.name}». Hold Rate піднято до 42.4%, злив бюджету зупинено!`
      );
      setTimeout(() => setNotification(''), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Navbar
        title="Детектор вигорання аудиторії та хуки"
        subtitle="Моніторинг втоми креативів та швидка заміна перших 3 секунд без втрати навчання пікселя"
      />

      <div className={styles.container}>
        {notification && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* 3 Sleek Summary Cards */}
        <div className={styles.summaryGrid}>
          {/* Card 1: Fatigue Score */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <Activity size={16} className={styles.iconMuted} />
              <span className={styles.summaryTitle}>Індекс втоми аудиторії (Fatigue)</span>
            </div>
            <div
              className={styles.kpiValue}
              style={{
                color: currentScore <= 20 ? 'var(--color-success)' : 'var(--accent-primary-light)',
              }}
            >
              {currentScore}% — {currentScore <= 20 ? 'Оптимально' : 'Потребує ротації'}
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

          {/* Card 2: Waste Drain */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <DollarSign
                size={16}
                style={{ color: totalWaste > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
              />
              <span className={styles.summaryTitle}>Злив бюджету від вигорання</span>
            </div>
            <div
              className={styles.kpiValue}
              style={{ color: totalWaste > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {totalWaste > 0 ? `-$${totalWaste} / тижд.` : '$0 (Зливу немає)'}
            </div>
            <span className={styles.cardFootnote}>
              {totalWaste > 0 ? 'Гроші на скипнуті покази (<3 сек)' : '✓ Усі кошти йдуть на цільові покази'}
            </span>
          </div>

          {/* Card 3: Status */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <AlertCircle
                size={16}
                style={{ color: fatiguedCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
              />
              <span className={styles.summaryTitle}>Стан креативів у рекламі</span>
            </div>
            <div
              className={styles.kpiValue}
              style={{ color: fatiguedCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {fatiguedCount > 0 ? `${fatiguedCount} з ${creativesList.length} вигорів` : 'Всі 100% у нормі'}
            </div>
            <span className={styles.cardFootnote}>
              {fatiguedCount > 0 ? 'Потрібно замінити перші 3 сек' : '✓ Hold Rate вище норми (>35%)'}
            </span>
          </div>
        </div>

        {/* Table of Active Creatives */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Активні креативи та утримання уваги (3s Hold Rate)</h2>
              <p className={styles.cardSub}>
                Натисніть на оголошення для швидкого підбору нового вхідного хука:
              </p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>КРЕАТИВ</th>
                  <th>ПЛАТФОРМА</th>
                  <th>3s HOLD RATE</th>
                  <th>ЧАСТОТА</th>
                  <th>CPA</th>
                  <th>СТАН</th>
                  <th>ДІЯ</th>
                </tr>
              </thead>
              <tbody>
                {creativesList.map((c) => {
                  const isSelected = activeCreative?.id === c.id;
                  const holdVal = c.holdRateNum || parseFloat(c.holdRate) || 30;
                  const isFatigued = c.status === 'fatigued';

                  return (
                    <tr
                      key={c.id}
                      className={isSelected ? styles.selectedRow : ''}
                      onClick={() => setSelectedCreativeId(c.id)}
                    >
                      <td className={styles.creativeNameCell}>
                        <span className={styles.creativeName}>{c.name}</span>
                        {isSelected && <span className={styles.activePill}>Обрано</span>}
                      </td>
                      <td>
                        <span className={styles.platformPill}>{c.platform}</span>
                      </td>
                      <td>
                        <div className={styles.holdCell}>
                          <span
                            style={{
                              fontWeight: 700,
                              color: isFatigued ? 'var(--color-danger)' : holdVal >= 35 ? 'var(--color-success)' : '#38BDF8',
                            }}
                          >
                            {c.holdRate}
                          </span>
                          <div className={styles.miniBarTrack}>
                            <div
                              className={styles.miniBarFill}
                              style={{
                                width: `${Math.min(100, (holdVal / 50) * 100)}%`,
                                backgroundColor: isFatigued
                                  ? 'var(--color-danger)'
                                  : holdVal >= 35
                                  ? 'var(--color-success)'
                                  : '#38BDF8',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{c.freq}</td>
                      <td style={{ fontWeight: 600 }}>{c.cpa}</td>
                      <td>
                        {c.status === 'effective' && (
                          <span className={styles.badgeEffective}>
                            {c.action?.includes('Оновлено') ? 'Оновлено ШІ ✓' : 'Ефективний ✓'}
                          </span>
                        )}
                        {c.status === 'stable' && <span className={styles.badgeStable}>Стабільний</span>}
                        {c.status === 'fatigued' && <span className={styles.badgeFatigued}>Вигорання ⚡</span>}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${isFatigued ? styles.actionBtnActive : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCreativeId(c.id);
                          }}
                        >
                          <Zap size={13} />
                          <span>{isFatigued ? 'Ротувати хук' : 'Підібрати хук'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact & Ergonomic AI Hook Lab */}
        <div className={styles.rotationPanel}>
          <div className={styles.rotationHeader}>
            <div className={styles.headerLeft}>
              <div className={styles.badgeLab}>
                <Sparkles size={13} />
                <span>ШІ-РОТАЦІЯ ХУКА</span>
              </div>
              <h2 className={styles.cardTitle}>
                Новий хук для «{activeCreative?.name}»
              </h2>
              <p className={styles.cardSub}>
                Замініть лише перші 3 секунди ролика — набрані лайки, коментарі та історія навчання пікселя збережуться.
              </p>
            </div>

            <div className={styles.currentCreativeStatus}>
              <span className={styles.statusLabel}>Поточне утримання:</span>
              <span
                className={styles.statusVal}
                style={{
                  color: activeCreative?.status === 'fatigued' ? 'var(--color-danger)' : 'var(--color-success)',
                }}
              >
                {activeCreative?.holdRate} • {activeCreative?.cpa} CPA
              </span>
            </div>
          </div>

          {/* 3 Clean Hook Cards */}
          <div className={styles.hooksGrid}>
            {hooks.map((h) => {
              const isSelected = selectedHookId === h.id;
              return (
                <div
                  key={h.id}
                  className={`${styles.hookCard} ${isSelected ? styles.hookCardActive : ''}`}
                  onClick={() => setSelectedHookId(h.id)}
                >
                  <div className={styles.hookCardTop}>
                    <span className={styles.hookTagPill}>{h.tag}</span>
                    <span className={styles.forecastBadge}>{h.forecast}</span>
                  </div>

                  <p className={styles.hookQuote}>{h.quote}</p>
                  <p className={styles.hookTrigger}>{h.trigger}</p>

                  <button
                    type="button"
                    className={`${styles.selectHookBtn} ${isSelected ? styles.selectHookBtnActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHookId(h.id);
                    }}
                  >
                    {isSelected ? '✓ Обрано' : 'Обрати'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Apply Button */}
          <div className={styles.applyContainer}>
            <button
              type="button"
              disabled={isUpdating}
              className={styles.applyBtn}
              onClick={handleApply}
            >
              {isUpdating ? <RefreshCw size={16} className={styles.spin} /> : <Zap size={16} />}
              <span>
                {isUpdating
                  ? 'Оновлення перших 3 секунд у Meta Ads & TikTok...'
                  : `Оновити хук у Meta & TikTok без перезапуску кампанії`}
              </span>
            </button>
            <span className={styles.applyNote}>
              Автоматично перепідключає перші 3с креативу через API без виходу з аукціону.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}