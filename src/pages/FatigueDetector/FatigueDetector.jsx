import React, { useState, useMemo } from 'react';
import {
  Zap,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Plus,
  Sliders,
  DollarSign,
  Activity,
  Eye,
  Layers,
  ArrowRight,
  X,
  Sparkles,
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './FatigueDetector.module.css';

export default function FatigueDetector() {
  const { fatigue, handleRotateHook, handleAddCreativeToFatigue } = useApp();

  // Active creative selected for Hook Lab
  const [selectedCreativeId, setSelectedCreativeId] = useState(3);
  const [selectedHookId, setSelectedHookId] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState('');

  // Table filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'fatigued' | 'effective'

  // Modal for adding a new creative
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCreative, setNewCreative] = useState({
    name: '',
    platform: 'Meta Reels',
    holdRate: '19.5',
    freq: '3.1',
    cpa: '16.80',
  });

  // Automated Protection Rules State
  const [rules, setRules] = useState({
    frequencyCap: true,
    holdRateAlert: true,
    autoCycle: true,
  });

  const toggleRule = (ruleKey) => {
    setRules((prev) => {
      const next = { ...prev, [ruleKey]: !prev[ruleKey] };
      const statusText = next[ruleKey] ? 'активовано' : 'деактивовано';
      setNotification(`Правило захисту «${getRuleName(ruleKey)}» ${statusText}.`);
      setTimeout(() => setNotification(''), 4000);
      return next;
    });
  };

  const getRuleName = (key) => {
    switch (key) {
      case 'frequencyCap':
        return 'Frequency Cap Guard (>2.8x)';
      case 'holdRateAlert':
        return '3s Hold Rate Guard (<20%)';
      case 'autoCycle':
        return '14-денна авто-ротація';
      default:
        return 'Правило';
    }
  };

  // Safe fallback list from context
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
          cpaTrend: '-14% (Стабільно)',
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
          cpaTrend: '+5% (Норма)',
          wasteDrain: 35,
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
          cpaTrend: '+46% ⚠️ (Ріст CPA)',
          wasteDrain: 280,
          status: 'fatigued',
          action: 'Замінити хук ⚡',
        },
        {
          id: 4,
          name: 'AntiAging_Serum_DirectOffer',
          platform: 'Meta Feed',
          holdRate: '28.4%',
          holdRateNum: 28.4,
          freq: '2.6x',
          cpa: '$12.40',
          cpaTrend: '+16% (Початок спаду)',
          wasteDrain: 25,
          status: 'stable',
          action: 'Ротувати хук',
        },
      ]
    );
  }, [fatigue]);

  // Selected creative details
  const activeCreative = useMemo(() => {
    return (
      creativesList.find((c) => c.id === selectedCreativeId) ||
      creativesList.find((c) => c.status === 'fatigued') ||
      creativesList[0]
    );
  }, [creativesList, selectedCreativeId]);

  // Summary Metrics
  const currentScore = fatigue?.score ?? (creativesList.some((c) => c.status === 'fatigued') ? 24 : 12);
  const currentStatusLabel =
    fatigue?.statusLabel ?? (currentScore > 20 ? 'Потребує оптимізації' : 'Оптимально');
  const totalWasteDrain =
    fatigue?.wasteDrainWeekly ??
    creativesList.reduce((acc, c) => acc + (c.wasteDrain || 0), 0);
  const fatiguedCount = creativesList.filter((c) => c.status === 'fatigued').length;

  const avgHoldRateNum = useMemo(() => {
    const sum = creativesList.reduce((acc, c) => {
      const val = c.holdRateNum || parseFloat(c.holdRate) || 30;
      return acc + val;
    }, 0);
    return (sum / (creativesList.length || 1)).toFixed(1);
  }, [creativesList]);

  // Filtered creatives list
  const filteredCreatives = useMemo(() => {
    return creativesList.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.platform.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'fatigued'
          ? c.status === 'fatigued'
          : c.status !== 'fatigued';
      return matchSearch && matchStatus;
    });
  }, [creativesList, searchQuery, statusFilter]);

  // Hook Variants tailored to chosen creative context
  const hooks = useMemo(() => {
    const isBeautyOrSkin =
      activeCreative?.name?.toLowerCase().includes('cream') ||
      activeCreative?.name?.toLowerCase().includes('serum') ||
      activeCreative?.name?.toLowerCase().includes('summer');

    if (isBeautyOrSkin) {
      return [
        {
          id: 1,
          tag: 'БІЛЬ → РІШЕННЯ',
          variant: 'Варіант 1 (Agitation Hook)',
          quote: '«Ця помилка в щоденному догляді коштує тобі чистої шкіри та грошей на косметологів...»',
          trigger: 'Психологічний тригер: страх втрати грошей + інтрига власної помилки.',
          holdForecast: '+28%',
          cpaReduction: '-24%',
        },
        {
          id: 2,
          tag: 'ІНТРИГА / ЗЛАМ ШАБЛОНУ',
          variant: 'Варіант 2 (Pattern Interrupt)',
          quote: '«Чому дерматологи мовчать про цей простий компонент, який є в кожному кремі за $80?»',
          trigger: 'Психологічний тригер: Pattern Interrupt у перші 1.5 сек + розкриття таємниці.',
          holdForecast: '+34%',
          cpaReduction: '-31%',
        },
        {
          id: 3,
          tag: 'UGC / СОЦІАЛЬНИЙ ДОКАЗ',
          variant: 'Варіант 3 (Social Proof)',
          quote: '«Показую засіб, який замінив мені 5 баночок на полиці. Шкіра ніколи не була такою чистою...»',
          trigger: 'Психологічний тригер: особистий досвід реальної людини (ефект подруги).',
          holdForecast: '+31%',
          cpaReduction: '-26%',
        },
        {
          id: 4,
          tag: 'ШОК-ОФЕР / ДЕФІЦИТ',
          variant: 'Варіант 4 (Offer Hook)',
          quote: '«Останні 48 годин: отримай подвійний об’єм за ціною одного перед повним солдаутом літа...»',
          trigger: 'Психологічний тригер: комерційний дефіцит + висока додана вартість (FOMO).',
          holdForecast: '+22%',
          cpaReduction: '-19%',
        },
      ];
    }

    return [
      {
        id: 1,
        tag: 'БІЛЬ → РІШЕННЯ',
        variant: 'Варіант 1 (Agitation Hook)',
        quote: '«Якщо ти досі витрачаєш більше 2 годин на це щодня — подивись це коротке відео...»',
        trigger: 'Психологічний тригер: збереження часу та усунення рутинного болю.',
        holdForecast: '+27%',
        cpaReduction: '-22%',
      },
      {
        id: 2,
        tag: 'ІНТРИГА / ЗЛАМ ШАБЛОНУ',
        variant: 'Варіант 2 (Pattern Interrupt)',
        quote: '«Зупинись! 90% людей роблять це неправильно і навіть не здогадуються про це...»',
        trigger: 'Психологічний тригер: раптова команда "Зупинись" + руйнування звички.',
        holdForecast: '+36%',
        cpaReduction: '-33%',
      },
      {
        id: 3,
        tag: 'UGC / СОЦІАЛЬНИЙ ДОКАЗ',
        variant: 'Варіант 3 (Social Proof)',
        quote: '«Я теж не вірив у рекламу, поки не протестував цей метод особисто на практиці...»',
        trigger: 'Психологічний тригер: подолання первинного скепсису покупця.',
        holdForecast: '+30%',
        cpaReduction: '-25%',
      },
      {
        id: 4,
        tag: 'ШОК-ОФЕР / ДЕФІЦИТ',
        variant: 'Варіант 4 (Offer Hook)',
        quote: '«Лімітована пропозиція: зафіксуй знижку -50% для перших 20 замовлень просто зараз!»',
        trigger: 'Психологічний тригер: жорсткий ліміт кількості + імпульсивна покупка.',
        holdForecast: '+24%',
        cpaReduction: '-20%',
      },
    ];
  }, [activeCreative]);

  const handleApplyHook = async () => {
    const selected = hooks.find((h) => h.id === selectedHookId);
    if (!selected || !activeCreative) return;

    setIsUpdating(true);
    try {
      await handleRotateHook(selected.tag, activeCreative.id);
      setNotification(
        `Хук «${selected.tag}» успішно впроваджено для «${activeCreative.name}». Hold Rate відновлено до 42.4%, бюджетний злив зупинено!`
      );
      setTimeout(() => setNotification(''), 6000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCreative.name.trim()) return;

    await handleAddCreativeToFatigue({
      name: newCreative.name.trim(),
      platform: newCreative.platform,
      holdRate: parseFloat(newCreative.holdRate) || 20,
      freq: parseFloat(newCreative.freq) || 2.0,
      cpa: parseFloat(newCreative.cpa) || 12.0,
    });

    setIsAddModalOpen(false);
    setNewCreative({
      name: '',
      platform: 'Meta Reels',
      holdRate: '19.5',
      freq: '3.1',
      cpa: '16.80',
    });

    setNotification('Новий креатив додано до моніторингу вигорання.');
    setTimeout(() => setNotification(''), 4500);
  };

  const scrollToRotation = (creativeId) => {
    if (creativeId) setSelectedCreativeId(creativeId);
    const el = document.getElementById('hook-rotation-panel');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Navbar
        title="Детектор вигорання аудиторії та хуки"
        subtitle="Центр контролю втоми креативів, захист від зливу бюджету та ШІ-ротація перших секунд"
      />

      <div className={styles.container}>
        {notification && (
          <div className={styles.successBanner}>
            <CheckCircle2 size={18} />
            <span>{notification}</span>
          </div>
        )}

        {/* 4 Top KPI & Financial Impact Summary Cards */}
        <div className={styles.summaryGrid}>
          {/* Card 1: Fatigue Score */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <Activity size={16} className={styles.iconMuted} />
              <span className={styles.summaryTitle}>Індекс втоми аудиторії (Fatigue Score)</span>
            </div>
            <div
              className={styles.fatigueScoreVal}
              style={{
                color: currentScore <= 20 ? 'var(--color-success)' : 'var(--accent-primary-light)',
              }}
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
            <span className={styles.cardFootnote}>
              {currentScore <= 20
                ? '✓ Аукціон стабільний, аудиторія реагує активно'
                : '⚠️ Виявлено падіння утримання на перших секундах'}
            </span>
          </div>

          {/* Card 2: Ad Waste Drain */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <DollarSign size={16} style={{ color: totalWasteDrain > 0 ? 'var(--color-danger)' : 'var(--color-success)' }} />
              <span className={styles.summaryTitle}>Бюджетний злив від вигорання</span>
            </div>
            <div
              className={styles.fatigueScoreVal}
              style={{ color: totalWasteDrain > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {totalWasteDrain > 0 ? `-$${totalWasteDrain} / тиждень` : '$0 (Немає втрат)'}
            </div>
            <p className={styles.statusDesc}>
              {totalWasteDrain > 0
                ? 'Витрати на покази користувачам, які скипають відео в перші 3 сек через втому від хука.'
                : 'Усі витрати приносять цільові конверсії без марного відкручування.'}
            </p>
          </div>

          {/* Card 3: Avg 3s Hold Rate */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <Eye size={16} className={styles.iconMuted} />
              <span className={styles.summaryTitle}>Середній 3s Hold Rate</span>
            </div>
            <div className={styles.fatigueScoreVal} style={{ color: '#38BDF8' }}>
              {avgHoldRateNum}%
            </div>
            <p className={styles.statusDesc}>
              Цільовий бенчмарк Meta Reels & TikTok Ads: <strong>&gt; 35%</strong>.
              {Number(avgHoldRateNum) >= 35 ? ' Рівень залучення відмінний.' : ' Потребує підсилення інтро.'}
            </p>
          </div>

          {/* Card 4: Creatives At Risk */}
          <div className={styles.summaryCard}>
            <div className={styles.cardHeaderSmall}>
              <AlertTriangle
                size={16}
                style={{ color: fatiguedCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
              />
              <span className={styles.summaryTitle}>Креативи в зоні ризику</span>
            </div>
            <div
              className={styles.fatigueScoreVal}
              style={{ color: fatiguedCount > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}
            >
              {fatiguedCount} з {creativesList.length}
            </div>
            <p className={styles.statusDesc}>
              {fatiguedCount > 0
                ? `${fatiguedCount} оголошення вигоріло та терміново потребує ротації хука.`
                : 'Усі 100% активних оголошень мають стабільні показники.'}
            </p>
          </div>
        </div>

        {/* Creative Decay Monitor Table */}
        <div className={styles.card}>
          <div className={styles.tableHeaderRow}>
            <div>
              <h2 className={styles.cardTitle}>Моніторинг вигорання креативів та динаміка CPA (7 днів)</h2>
              <p className={styles.cardSub}>
                Алгоритмічний аналіз частоти показів (Frequency) та утримання уваги (3s Hold Rate).
              </p>
            </div>

            <div className={styles.tableActionsRow}>
              <input
                type="text"
                placeholder="Пошук креативу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <div className={styles.filterPills}>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${statusFilter === 'all' ? styles.filterBtnActive : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  Всі ({creativesList.length})
                </button>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${statusFilter === 'fatigued' ? styles.filterBtnActive : ''}`}
                  onClick={() => setStatusFilter('fatigued')}
                >
                  Вигорілі ({fatiguedCount})
                </button>
                <button
                  type="button"
                  className={`${styles.filterBtn} ${statusFilter === 'effective' ? styles.filterBtnActive : ''}`}
                  onClick={() => setStatusFilter('effective')}
                >
                  Ефективні ({creativesList.length - fatiguedCount})
                </button>
              </div>
              <button
                type="button"
                className={styles.addCreativeBtn}
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={15} />
                <span>+ Додати на моніторинг</span>
              </button>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>КРЕАТИВ</th>
                  <th>ПЛАТФОРМА</th>
                  <th>3s HOLD RATE</th>
                  <th>ЧАСТОТА (FREQ)</th>
                  <th>ДИНАМІКА CPA (7 ДНІВ)</th>
                  <th>ЗЛИВ БЮДЖЕТУ</th>
                  <th>СТАН КРЕАТИВУ</th>
                  <th>ДІЯ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreatives.map((c) => {
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
                        <div className={styles.creativeNameTitle}>{c.name}</div>
                        {isSelected && <span className={styles.activePill}>Обрано для ротації</span>}
                      </td>
                      <td>
                        <span className={styles.platformPill}>{c.platform}</span>
                      </td>
                      <td>
                        <div className={styles.holdRateCell}>
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
                                width: `${Math.min(100, (holdVal / 60) * 100)}%`,
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
                      <td>
                        <span className={parseFloat(c.freq) > 3.0 ? styles.freqHigh : styles.freqNormal}>
                          {c.freq}
                        </span>
                      </td>
                      <td>
                        <span className={c.cpaTrend?.includes('+') ? styles.cpaUp : styles.cpaDown}>
                          {c.cpaTrend || 'Стабільно'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: (c.wasteDrain || 0) > 0 ? 'var(--color-danger)' : 'var(--text-muted)' }}>
                          {(c.wasteDrain || 0) > 0 ? `-$${c.wasteDrain}` : '$0'}
                        </span>
                      </td>
                      <td>
                        {c.status === 'effective' && (
                          <span className={styles.badgeEffective}>
                            {c.action === 'Оновлено ШІ ✓' ? 'Оновлено ШІ ✓' : 'Ефективний ✓'}
                          </span>
                        )}
                        {c.status === 'stable' && <span className={styles.badgeStable}>Стабільний</span>}
                        {c.status === 'fatigued' && <span className={styles.badgeFatigued}>Вигорання креативу ⚡</span>}
                      </td>
                      <td>
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${isFatigued ? styles.actionBtnActive : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCreativeId(c.id);
                            scrollToRotation(c.id);
                          }}
                        >
                          <Zap size={13} />
                          <span>{isFatigued ? 'Ротувати хук ⚡' : 'Підібрати хук'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Hook Lab (ШІ-Лабораторія швидкої ротації хуків) */}
        <div id="hook-rotation-panel" className={styles.rotationPanel}>
          <div className={styles.labHeader}>
            <div className={styles.labTitleArea}>
              <div className={styles.badgeLab}>
                <Sparkles size={14} />
                <span>ШІ-ЛАБОРАТОРІЯ ХУКІВ</span>
              </div>
              <h2 className={styles.cardTitle}>
                Ротація перших 3 секунд для «{activeCreative?.name || 'Креативу'}»
              </h2>
              <p className={styles.cardSub}>
                Не перезапускайте кампанію та не збивайте машинне навчання пікселя — замініть лише перші 3 секунди
                відео (хук), щоб зберегти набраний соціал-пруф (лайки, збереження, коментарі) та знизити CPA на 25-35%.
              </p>
            </div>

            {/* Target Creative Quick Switcher */}
            <div className={styles.targetSwitcher}>
              <span className={styles.switcherLabel}>Цільовий ролик:</span>
              <select
                className={styles.creativeSelect}
                value={activeCreative?.id}
                onChange={(e) => setSelectedCreativeId(Number(e.target.value))}
              >
                {creativesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.holdRate} • {c.platform})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4 Dynamic Psychological Hook Cards */}
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
                    <span className={styles.hookVariantBadge}>{h.variant}</span>
                  </div>

                  <p className={styles.hookQuote}>{h.quote}</p>
                  <p className={styles.hookTrigger}>{h.trigger}</p>

                  <div className={styles.hookMetricsRow}>
                    <span className={styles.metricHold}>Hold: {h.holdForecast}</span>
                    <span className={styles.metricCpa}>CPA: {h.cpaReduction}</span>
                  </div>

                  <button
                    type="button"
                    className={`${styles.selectHookBtn} ${isSelected ? styles.selectHookBtnActive : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedHookId(h.id);
                    }}
                  >
                    {isSelected ? '✓ Обрано для впровадження' : 'Обрати варіант'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Sync / Apply Action */}
          <div className={styles.applyActionContainer}>
            <div className={styles.applyActionInfo}>
              <ShieldCheck size={20} style={{ color: 'var(--color-success)' }} />
              <div>
                <strong>Безпечна заміна без виходу з аукціону</strong>
                <p>
                  Meta Ads API & TikTok Business API оновлять відеоряд без скидання статусу навчання адсету.
                </p>
              </div>
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
                  ? 'Оновлення перших 3 секунд у Meta Ads & TikTok...'
                  : `Оновити хук для «${activeCreative?.name}»`}
              </span>
            </button>
          </div>
        </div>

        {/* A/B Hook Split Comparison Simulator */}
        <div className={styles.splitCard}>
          <div className={styles.splitHeader}>
            <Sliders size={18} className={styles.iconMuted} />
            <h2 className={styles.cardTitle}>A/B Hook Split Simulator: Прогноз відновлення ефективності</h2>
          </div>

          <div className={styles.splitGrid}>
            {/* Left: Fatigued Hook */}
            <div className={styles.splitColOld}>
              <span className={styles.splitBadgeOld}>ПОТОЧНИЙ ВИГОРІЛИЙ ХУК</span>
              <h3 className={styles.splitColTitle}>
                {activeCreative?.status === 'fatigued'
                  ? 'Фаза критичного вигорання (Ad Decay)'
                  : 'Поточні базові показники'}
              </h3>
              <ul className={styles.splitList}>
                <li>
                  <span>3s Hold Rate:</span>
                  <strong style={{ color: 'var(--color-danger)' }}>{activeCreative?.holdRate}</strong>
                </li>
                <li>
                  <span>Вартість ліда (CPA):</span>
                  <strong>{activeCreative?.cpa || '$18.90'}</strong>
                </li>
                <li>
                  <span>Частота показів:</span>
                  <span>{activeCreative?.freq || '3.4x'}</span>
                </li>
                <li>
                  <span>Статус аукціону:</span>
                  <span style={{ color: 'var(--color-danger)' }}>Штраф аукціону (високий CPM)</span>
                </li>
              </ul>
            </div>

            {/* Center Arrow */}
            <div className={styles.splitArrowWrapper}>
              <ArrowRight size={24} className={styles.splitArrow} />
            </div>

            {/* Right: New AI Hook */}
            <div className={styles.splitColNew}>
              <span className={styles.splitBadgeNew}>НОВИЙ ШІ-ХУК ПІСЛЯ РОТАЦІЇ</span>
              <h3 className={styles.splitColTitle}>Оптимізований вхідний потік уваги</h3>
              <ul className={styles.splitList}>
                <li>
                  <span>Прогноз 3s Hold Rate:</span>
                  <strong style={{ color: 'var(--color-success)' }}>42.4% (+187% уваги)</strong>
                </li>
                <li>
                  <span>Цільовий CPA:</span>
                  <strong style={{ color: 'var(--color-success)' }}>$8.20 (Економія $10.70 на замовленні)</strong>
                </li>
                <li>
                  <span>Зниження CPM Meta/TikTok:</span>
                  <span style={{ color: '#38BDF8' }}>-28% за рахунок високого залучення</span>
                </li>
                <li>
                  <span>Прогноз окупності:</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                    + $460 чистої економії на кожні $1,000 спенду
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fatigue Auto-Protection Rules Section */}
        <div className={styles.rulesCard}>
          <div className={styles.rulesHeader}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-primary-light)' }} />
            <div>
              <h2 className={styles.cardTitle}>Автоматичні правила захисту від вигорання (Fatigue Auto-Rules)</h2>
              <p className={styles.cardSub}>
                Розумні алгоритми, які автоматично рятують рекламний бюджет у фоновому режимі 24/7.
              </p>
            </div>
          </div>

          <div className={styles.rulesGrid}>
            {/* Rule 1 */}
            <div className={styles.ruleItem}>
              <div className={styles.ruleItemTop}>
                <div>
                  <h4 className={styles.ruleTitle}>Frequency Cap Guard (&gt; 2.8x)</h4>
                  <p className={styles.ruleDesc}>
                    При перевищенні частоти 2.8x за 7 днів система автоматично розширює аудиторію (Lookalike 3-5%) або
                    знижує добовий спенд на 20%, щоб зупинити спад конверсії.
                  </p>
                </div>
                <button
                  type="button"
                  className={`${styles.toggleSwitch} ${rules.frequencyCap ? styles.toggleOn : ''}`}
                  onClick={() => toggleRule('frequencyCap')}
                >
                  <span className={styles.togglePin} />
                </button>
              </div>
              <div className={styles.ruleFoot}>
                <span className={styles.ruleSavings}>Зекономлено: $420 за останні 30 днів</span>
                <span className={styles.ruleStatusPill}>
                  {rules.frequencyCap ? 'Правило активно ✓' : 'Вимкнено'}
                </span>
              </div>
            </div>

            {/* Rule 2 */}
            <div className={styles.ruleItem}>
              <div className={styles.ruleItemTop}>
                <div>
                  <h4 className={styles.ruleTitle}>3s Hold Rate Drop Alert (&lt; 20%)</h4>
                  <p className={styles.ruleDesc}>
                    При раптовому падінні утримання перших секунд нижче 20% надсилається миттєвий алерт та готується
                    чернетка з новим ШІ-хуком.
                  </p>
                </div>
                <button
                  type="button"
                  className={`${styles.toggleSwitch} ${rules.holdRateAlert ? styles.toggleOn : ''}`}
                  onClick={() => toggleRule('holdRateAlert')}
                >
                  <span className={styles.togglePin} />
                </button>
              </div>
              <div className={styles.ruleFoot}>
                <span className={styles.ruleSavings}>Відловлено 3 випадки вигорання</span>
                <span className={styles.ruleStatusPill}>
                  {rules.holdRateAlert ? 'Правило активно ✓' : 'Вимкнено'}
                </span>
              </div>
            </div>

            {/* Rule 3 */}
            <div className={styles.ruleItem}>
              <div className={styles.ruleItemTop}>
                <div>
                  <h4 className={styles.ruleTitle}>Планова 14-денна ротація аутро/хуків</h4>
                  <p className={styles.ruleDesc}>
                    Попереджувальна заміна перших 3 секунд для топ-креативів кожні 2 тижні для постійної свіжості в
                    аукціоні без втрати навченого пікселя.
                  </p>
                </div>
                <button
                  type="button"
                  className={`${styles.toggleSwitch} ${rules.autoCycle ? styles.toggleOn : ''}`}
                  onClick={() => toggleRule('autoCycle')}
                >
                  <span className={styles.togglePin} />
                </button>
              </div>
              <div className={styles.ruleFoot}>
                <span className={styles.ruleSavings}>4 креативи в черзі на ротацію</span>
                <span className={styles.ruleStatusPill}>
                  {rules.autoCycle ? 'Правило активно ✓' : 'Вимкнено'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add Creative to Monitoring */}
        {isAddModalOpen && (
          <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3 className={styles.modalTitle}>Додати креатив на моніторинг вигорання</h3>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className={styles.modalForm}>
                <div className={styles.formGroup}>
                  <label>Назва оголошення / креативу</label>
                  <input
                    type="text"
                    required
                    placeholder="наприклад, SummerSale_Reels_V3"
                    value={newCreative.name}
                    onChange={(e) => setNewCreative({ ...newCreative, name: e.target.value })}
                  />
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Платформа</label>
                    <select
                      value={newCreative.platform}
                      onChange={(e) => setNewCreative({ ...newCreative, platform: e.target.value })}
                    >
                      <option value="Meta Reels">Meta Reels</option>
                      <option value="TikTok Ads">TikTok Ads</option>
                      <option value="Meta Feed">Meta Feed</option>
                      <option value="YouTube Shorts">YouTube Shorts</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>3s Hold Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="18.5"
                      value={newCreative.holdRate}
                      onChange={(e) => setNewCreative({ ...newCreative, holdRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.formGrid2}>
                  <div className={styles.formGroup}>
                    <label>Частота показів (Freq)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="3.2"
                      value={newCreative.freq}
                      onChange={(e) => setNewCreative({ ...newCreative, freq: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Поточний CPA ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="16.80"
                      value={newCreative.cpa}
                      onChange={(e) => setNewCreative({ ...newCreative, cpa: e.target.value })}
                    />
                  </div>
                </div>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Скасувати
                  </button>
                  <button type="submit" className={styles.submitBtn}>
                    Додати до моніторингу
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}