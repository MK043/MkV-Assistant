import React, { useState, useMemo } from 'react';
import {
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Target,
  Layers,
  Zap,
  ArrowRight,
  ShieldCheck,
  Percent,
  Sliders,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './RoasCalculator.module.css';

export default function RoasCalculator() {
  const { setLiveAlert } = useApp() || {};

  // Selected advertising platform
  const [platform, setPlatform] = useState('meta'); // 'meta' | 'tiktok' | 'omni'

  // Unit Economics Inputs
  const [aov, setAov] = useState(48); // Average order value ($)
  const [cogs, setCogs] = useState(16); // Cost of goods sold + delivery ($)
  const [desiredProfitMargin, setDesiredProfitMargin] = useState(25); // Desired net margin (%)
  const [cr, setCr] = useState(2.8); // Website conversion rate (%)
  const [cpc, setCpc] = useState(0.38); // Cost per click ($)
  const [dailyBudget, setDailyBudget] = useState(130); // Current or planned daily budget ($)

  // Niche presets
  const presets = [
    {
      label: '🚗 Авто з США / Сервіс',
      aov: 280,
      cogs: 70,
      margin: 30,
      cr: 1.4,
      cpc: 0.95,
      budget: 250,
      platform: 'meta',
    },
    {
      label: '💄 E-commerce Косметика',
      aov: 48,
      cogs: 14,
      margin: 25,
      cr: 3.0,
      cpc: 0.35,
      budget: 130,
      platform: 'meta',
    },
    {
      label: '📱 Гаджети / Аксесуари',
      aov: 85,
      cogs: 36,
      margin: 20,
      cr: 2.2,
      cpc: 0.45,
      budget: 160,
      platform: 'tiktok',
    },
    {
      label: '👗 Одяг / Fashion',
      aov: 62,
      cogs: 24,
      margin: 25,
      cr: 2.6,
      cpc: 0.38,
      budget: 120,
      platform: 'meta',
    },
    {
      label: '🏠 Послуги / B2B',
      aov: 550,
      cogs: 110,
      margin: 35,
      cr: 1.0,
      cpc: 1.40,
      budget: 320,
      platform: 'omni',
    },
  ];

  const handleApplyPreset = (p) => {
    setAov(p.aov);
    setCogs(p.cogs);
    setDesiredProfitMargin(p.margin);
    setCr(p.cr);
    setCpc(p.cpc);
    setDailyBudget(p.budget);
    setPlatform(p.platform);

    if (setLiveAlert) {
      setLiveAlert(`Застосовано пресет «${p.label}» для ${p.platform === 'meta' ? 'Meta Ads' : p.platform === 'tiktok' ? 'TikTok Ads' : 'Омніканалу'}.`);
    }
  };

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    if (newPlatform === 'meta') {
      setCpc((prev) => (prev < 0.3 ? 0.42 : prev));
    } else if (newPlatform === 'tiktok') {
      setCpc((prev) => (prev > 0.5 ? 0.26 : prev));
    } else {
      setCpc((prev) => (prev < 0.25 ? 0.35 : prev));
    }
  };

  // Math & Media-buying Calculations
  const calculations = useMemo(() => {
    const marginPerUnit = Math.max(0, aov - cogs);
    const marginPercent = aov > 0 ? (marginPerUnit / aov) * 100 : 0;
    const breakEvenRoas = marginPerUnit > 0 ? aov / marginPerUnit : 0;
    const maxAllowableCpa = marginPerUnit;

    // Target CPA factoring required net profit
    const targetProfitPerUnit = (desiredProfitMargin / 100) * aov;
    const targetCpa = Math.max(1, marginPerUnit - targetProfitPerUnit);
    const targetRoas = targetCpa > 0 ? aov / targetCpa : breakEvenRoas;

    // Traffic funnel CPA: CPC / (CR / 100)
    const funnelCpa = cr > 0 ? cpc / (cr / 100) : 0;

    // Platform minimum budget constraints
    const platformMinBudget = platform === 'tiktok' ? 20 : 15;

    // Media Buying Budget Rules (Learning Exit standard: 50 events in 7 days = 7.15 events/day)
    const testDailyBudget = Math.max(platformMinBudget, Math.round(3 * targetCpa));
    const optimalDailyBudget = Math.max(platformMinBudget * 2, Math.round(7.15 * targetCpa));
    const scaleDailyBudget = Math.max(optimalDailyBudget * 1.8, Math.round(15 * targetCpa));

    // Performance projections for currently inputted dailyBudget
    const effectiveCpa = funnelCpa > 0 && isFinite(funnelCpa) ? funnelCpa : targetCpa;
    const projectedDailyOrders = effectiveCpa > 0 ? dailyBudget / effectiveCpa : 0;
    const projectedWeeklyOrders = projectedDailyOrders * 7;
    const projectedDailyRevenue = projectedDailyOrders * aov;
    const projectedDailyCogs = projectedDailyOrders * cogs;
    const projectedDailyNetProfit = projectedDailyRevenue - projectedDailyCogs - dailyBudget;

    const projectedMonthlySpend = dailyBudget * 30;
    const projectedMonthlyRevenue = projectedDailyRevenue * 30;
    const projectedMonthlyNetProfit = projectedDailyNetProfit * 30;
    const projectedMonthlyRoas = dailyBudget > 0 ? projectedDailyRevenue / dailyBudget : 0;

    // Diagnosis status zones
    const isUnitProfitable = effectiveCpa <= maxAllowableCpa;
    const isLearningExit = projectedWeeklyOrders >= 50;
    const isHealthy = isUnitProfitable && isLearningExit && projectedDailyNetProfit > 0;

    let zoneStatus = 'green';
    let zoneMessage = 'Зелена зона: Готово до масштабування (50+ конверсій/тиждень)';

    if (!isUnitProfitable) {
      zoneStatus = 'red';
      zoneMessage = 'Червона зона: Збиткова юніт-економіка (CPA перевищує маржу)';
    } else if (!isLearningExit) {
      zoneStatus = 'yellow';
      zoneMessage = 'Жовта зона: Ризик обмеженого навчання (< 50 конверсій/тиждень)';
    }

    return {
      marginPerUnit,
      marginPercent,
      breakEvenRoas,
      maxAllowableCpa,
      targetCpa,
      targetRoas,
      funnelCpa,
      testDailyBudget,
      optimalDailyBudget,
      scaleDailyBudget,
      effectiveCpa,
      projectedDailyOrders,
      projectedWeeklyOrders,
      projectedDailyRevenue,
      projectedDailyNetProfit,
      projectedMonthlySpend,
      projectedMonthlyRevenue,
      projectedMonthlyNetProfit,
      projectedMonthlyRoas,
      isUnitProfitable,
      isLearningExit,
      isHealthy,
      zoneStatus,
      zoneMessage,
    };
  }, [aov, cogs, desiredProfitMargin, cr, cpc, dailyBudget, platform]);

  const handleApplyBudget = (amount, label) => {
    setDailyBudget(amount);
    if (setLiveAlert) {
      setLiveAlert(`Добовий бюджет змінено на $${amount}/день (${label}). Прогнози оновлено.`);
    }
  };

  return (
    <div className={styles.calculatorCard}>
      {/* Header */}
      <div className={styles.calcHeader}>
        <div>
          <div className={styles.titleBadgeRow}>
            <h3 className={styles.calcTitle}>
              Калькулятор оптимального добового бюджету (Meta Ads &amp; TikTok Ads)
            </h3>
            <span className={styles.metaTikBadge}>
              {platform === 'meta' ? 'Meta Advantage+ Pixel' : platform === 'tiktok' ? 'TikTok Spark Ads' : 'Omnichannel Multi-Touch'}
            </span>
          </div>
          <p className={styles.calcSub}>
            Розрахунок мінімального та ідеального бюджету для виходу з фази навчання (50 подій/тиждень) та максимізації чистого прибутку
          </p>
        </div>

        <div
          className={`${styles.badgeZone} ${
            calculations.zoneStatus === 'green'
              ? styles.badgeGreen
              : calculations.zoneStatus === 'yellow'
              ? styles.badgeYellow
              : styles.badgeRed
          }`}
        >
          {calculations.zoneStatus === 'green' ? (
            <CheckCircle2 size={14} />
          ) : calculations.zoneStatus === 'yellow' ? (
            <TrendingUp size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          <span>{calculations.zoneMessage}</span>
        </div>
      </div>

      {/* Target Advertising Platform Switcher */}
      <div className={styles.platformSelectorRow}>
        <div className={styles.platformTabs}>
          <button
            type="button"
            className={`${styles.platformTabBtn} ${platform === 'meta' ? styles.platformTabActive : ''}`}
            onClick={() => handlePlatformChange('meta')}
          >
            <span className={styles.platformDotMeta} />
            <span>Meta Ads (Instagram &amp; Facebook)</span>
          </button>
          <button
            type="button"
            className={`${styles.platformTabBtn} ${platform === 'tiktok' ? styles.platformTabActive : ''}`}
            onClick={() => handlePlatformChange('tiktok')}
          >
            <span className={styles.platformDotTikTok} />
            <span>TikTok Ads (Feed &amp; Spark)</span>
          </button>
          <button
            type="button"
            className={`${styles.platformTabBtn} ${platform === 'omni' ? styles.platformTabActive : ''}`}
            onClick={() => handlePlatformChange('omni')}
          >
            <span className={styles.platformDotOmni} />
            <span>Омніканал (Meta 65% + TikTok 35%)</span>
          </button>
        </div>

        <span className={styles.benchmarkHint}>
          {platform === 'meta'
            ? 'Бенчмарк: CPM ~$7.20, CPC ~$0.42 • Поріг оптимізації: 50 покупок за 7 днів'
            : platform === 'tiktok'
            ? 'Бенчмарк: CPM ~$3.50, CPC ~$0.26 • Мінімальний AdGroup бюджет: $20/день'
            : 'Збалансований спліт: Meta на ретаргетинг + TikTok на холодний вірусний трафік'}
        </span>
      </div>

      {/* Quick Presets for Real Niches */}
      <div className={styles.presetsBar}>
        <span className={styles.presetsLabel}>Галузеві пресети:</span>
        <div className={styles.presetsList}>
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              className={styles.presetBtn}
              onClick={() => handleApplyPreset(preset)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.calcBody}>
        {/* Left Column: Configurator & Strategy Cards */}
        <div className={styles.leftColumn}>
          {/* Inputs Grid */}
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Середній чек (AOV, $)</span>
                <span className={styles.labelHint}>Ціна продажу</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  min="5"
                  step="1"
                  className={styles.inputField}
                  value={aov}
                  onChange={(e) => setAov(Math.max(1, Number(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Собівартість (COGS, $)</span>
                <span className={styles.labelHint}>Товар + доставка</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className={styles.inputField}
                  value={cogs}
                  onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Бажаний прибуток (%)</span>
                <span className={styles.labelHint}>Чиста маржа від чеку</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="1"
                  className={styles.inputField}
                  value={desiredProfitMargin}
                  onChange={(e) => setDesiredProfitMargin(Math.max(1, Number(e.target.value) || 0))}
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Конверсія сайту (CR, %)</span>
                <span className={styles.labelHint}>Лендінг / чекаут</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  min="0.1"
                  max="25"
                  step="0.1"
                  className={styles.inputField}
                  value={cr}
                  onChange={(e) => setCr(Math.max(0.1, Number(e.target.value) || 0))}
                />
                <span className={styles.inputSuffix}>%</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Ціна кліка (CPC, $)</span>
                <span className={styles.labelHint}>{platform === 'meta' ? 'Instagram/FB' : 'TikTok Feed'}</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  min="0.05"
                  max="10"
                  step="0.01"
                  className={styles.inputField}
                  value={cpc}
                  onChange={(e) => setCpc(Math.max(0.01, Number(e.target.value) || 0))}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>
                <span>Добовий бюджет ($)</span>
                <span className={styles.labelHint}>Поточний спенд</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  min="10"
                  step="5"
                  className={`${styles.inputField} ${styles.inputFieldHighlight}`}
                  value={dailyBudget}
                  onChange={(e) => setDailyBudget(Math.max(5, Number(e.target.value) || 0))}
                />
              </div>
            </div>
          </div>

          {/* 3 High-Impact Media Buying Budget Strategy Cards */}
          <div className={styles.strategiesSection}>
            <div className={styles.strategiesHeader}>
              <span className={styles.strategiesTitle}>
                <Flame size={14} className={styles.flameIcon} />
                Рекомендовані варіанти добового спенду за алгоритмами Meta / TikTok:
              </span>
              <span className={styles.strategiesSub}>Клікніть для миттєвого встановлення в розрахунок</span>
            </div>

            <div className={styles.strategiesGrid}>
              {/* Option 1: Testing */}
              <div
                className={`${styles.strategyCard} ${dailyBudget === calculations.testDailyBudget ? styles.strategyCardActive : ''}`}
                onClick={() => handleApplyBudget(calculations.testDailyBudget, 'Мінімальний тест')}
              >
                <div className={styles.strategyTop}>
                  <span className={styles.strategyTag}>1. ТЕСТ КРЕАТИВІВ</span>
                  <span className={styles.strategyPrice}>${calculations.testDailyBudget} / день</span>
                </div>
                <p className={styles.strategyDesc}>
                  <strong>3 × Target CPA:</strong> валідація 2–3 хуків без зливу. Дозволяє виявити виграшний креатив перед масштабуванням.
                </p>
                <button type="button" className={styles.strategySelectBtn}>
                  {dailyBudget === calculations.testDailyBudget ? '✓ Вибрано' : 'Застосувати тест'}
                </button>
              </div>

              {/* Option 2: Recommended Optimal (Learning Exit) */}
              <div
                className={`${styles.strategyCard} ${styles.strategyCardFeatured} ${
                  dailyBudget === calculations.optimalDailyBudget ? styles.strategyCardActive : ''
                }`}
                onClick={() => handleApplyBudget(calculations.optimalDailyBudget, 'Оптимальний вихід з Learning Phase')}
              >
                <div className={styles.strategyTop}>
                  <span className={styles.strategyTagFeatured}>🎯 ІДЕАЛЬНИЙ БЮДЖЕТ</span>
                  <span className={styles.strategyPriceFeatured}>${calculations.optimalDailyBudget} / день</span>
                </div>
                <p className={styles.strategyDesc}>
                  <strong>7.2 × Target CPA:</strong> генерує <strong>50+ конверсій за 7 днів</strong>. Виводить піксель з фази навчання та знижує фінальний CPA на 20%.
                </p>
                <button type="button" className={styles.strategySelectBtnFeatured}>
                  {dailyBudget === calculations.optimalDailyBudget ? '✓ Активний оптимум' : '🎯 Застосувати оптимум'}
                </button>
              </div>

              {/* Option 3: Aggressive Scaling */}
              <div
                className={`${styles.strategyCard} ${dailyBudget === calculations.scaleDailyBudget ? styles.strategyCardActive : ''}`}
                onClick={() => handleApplyBudget(calculations.scaleDailyBudget, 'Масштабування')}
              >
                <div className={styles.strategyTop}>
                  <span className={styles.strategyTag}>3. МАСШТАБУВАННЯ</span>
                  <span className={styles.strategyPrice}>${calculations.scaleDailyBudget} / день</span>
                </div>
                <p className={styles.strategyDesc}>
                  <strong>15 × Target CPA:</strong> максимальний об'єм замовлень. Горизонтальний спліт на 3–4 AdSets (Advantage+ та Lookalike 1-3%).
                </p>
                <button type="button" className={styles.strategySelectBtn}>
                  {dailyBudget === calculations.scaleDailyBudget ? '✓ Вибрано' : 'Застосувати скейл'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Results & Media Buying Guidance */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultsGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Break-Even ROAS</span>
              <span className={styles.resultVal} style={{ color: 'var(--color-success)' }}>
                {calculations.breakEvenRoas.toFixed(2)}x
              </span>
              <span className={styles.resultSub}>Точка беззбитковості</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Target CPA (з прибутком)</span>
              <span className={styles.resultVal} style={{ color: '#38BDF8' }}>
                ${calculations.targetCpa.toFixed(2)}
              </span>
              <span className={styles.resultSub}>Прибуток {desiredProfitMargin}% з чеку</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>CPA за воронкою (CPC / CR)</span>
              <span
                className={styles.resultVal}
                style={{
                  color:
                    calculations.funnelCpa <= calculations.targetCpa
                      ? 'var(--color-success)'
                      : calculations.funnelCpa <= calculations.maxAllowableCpa
                      ? '#F59E0B'
                      : 'var(--color-danger)',
                }}
              >
                ${calculations.funnelCpa.toFixed(2)}
              </span>
              <span className={styles.resultSub}>
                {calculations.funnelCpa <= calculations.targetCpa ? 'Нижче таргету (Супер)' : 'Потребує оптимізації'}
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Граничний Max CPA</span>
              <span className={styles.resultVal}>
                ${calculations.maxAllowableCpa.toFixed(2)}
              </span>
              <span className={styles.resultSub}>Маржа: {calculations.marginPercent.toFixed(1)}%</span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Прогноз замовлень / день</span>
              <div className={styles.ordersRow}>
                <span className={styles.resultValHighlight}>
                  {calculations.projectedDailyOrders.toFixed(1)}
                </span>
                <span className={styles.ordersWeeklyBadge}>
                  {Math.round(calculations.projectedWeeklyOrders)} / тиждень
                </span>
              </div>
              <span className={styles.resultSub}>
                {calculations.isLearningExit ? '✓ Достатньо для навчання' : '⚠️ Менше 50 подій/тиждень'}
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Прогноз чистого прибутку</span>
              <span
                className={styles.resultVal}
                style={{
                  color: calculations.projectedMonthlyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)',
                }}
              >
                ${Math.round(calculations.projectedMonthlyNetProfit).toLocaleString()}
                <span className={styles.profitPerMonth}> / міс</span>
              </span>
              <span className={styles.resultSub}>
                Виторг: ${Math.round(calculations.projectedMonthlyRevenue).toLocaleString()} (ROAS {calculations.projectedMonthlyRoas.toFixed(2)}x)
              </span>
            </div>
          </div>

          {/* Media Buying Algorithm Guidance Box */}
          <div className={styles.guidanceBox}>
            <div className={styles.guidanceHeader}>
              <ShieldCheck size={16} className={styles.guidanceIcon} />
              <span>Експертний висновок для медіабаєра:</span>
            </div>
            <p className={styles.guidanceText}>
              {calculations.funnelCpa > calculations.maxAllowableCpa ? (
                <>
                  <strong style={{ color: 'var(--color-danger)' }}>Критичне перевищення вартості трафіку:</strong> При ціні кліка ${cpc.toFixed(2)} та конверсії сайту {cr}% розрахунковий CPA становить ${calculations.funnelCpa.toFixed(2)}, що більше за чисту маржу (${calculations.maxAllowableCpa.toFixed(2)}). Щоб не спалювати бюджет у мінус, необхідно або підвищити конверсію сайту до {((cpc / calculations.targetCpa) * 100).toFixed(1)}%, або знизити CPC покращенням перших 3 секунд хука в Creative Studio.
                </>
              ) : dailyBudget < calculations.optimalDailyBudget ? (
                <>
                  <strong style={{ color: '#F59E0B' }}>Ризик застрягання в «Learning Limited»:</strong> Поточний бюджет ${dailyBudget}/день генерує близько {calculations.projectedDailyOrders.toFixed(1)} лідів на день ({Math.round(calculations.projectedWeeklyOrders)} за 7 днів). Для стабільної оптимізації алгоритмів {platform === 'meta' ? 'Meta Advantage+' : 'TikTok Event Manager'} рекомендується підняти денний ліміт до <strong>${calculations.optimalDailyBudget}/день</strong>. Це забезпечить 50+ конверсій на тиждень і стабілізує аукціон.
                </>
              ) : (
                <>
                  <strong style={{ color: 'var(--color-success)' }}>Ідеальна окупність та готовність до скейлу:</strong> Юніт-економіка збалансована. При поточному добовому бюджеті ${dailyBudget}/день кампанія генерує {calculations.projectedDailyOrders.toFixed(1)} лідів/добу ({Math.round(calculations.projectedWeeklyOrders)}/тиждень), що повністю закриває фазу навчання. Рекомендовано масштабувати добовий бюджет не більше ніж на +15–20% кожні 48–72 години для збереження стабільного CPA.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
