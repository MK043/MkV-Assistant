import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  Sliders,
  Calendar,
  Percent,
} from 'lucide-react';
import styles from './RoasCalculator.module.css';

export default function RoasCalculator() {
  // Advertising Platform
  const [platform, setPlatform] = useState('meta'); // 'meta' | 'tiktok' | 'omni'

  // Unit Economics
  const [aov, setAov] = useState(48); // Average order value ($)
  const [cogs, setCogs] = useState(16); // Product COGS + delivery ($)
  const [cr, setCr] = useState(2.8); // Website conversion rate (%)
  const [cpc, setCpc] = useState(0.40); // Cost per click ($)

  // Daily Investment Spend
  const [dailyBudget, setDailyBudget] = useState(120);

  // Goal Mode (Target orders per day)
  const [calcMode, setCalcMode] = useState('budget'); // 'budget' | 'targetOrders'
  const [targetOrders, setTargetOrders] = useState(10); // Desired orders per day

  // Platform switch handler with realistic benchmarks
  const handlePlatformChange = (p) => {
    setPlatform(p);
    if (p === 'meta') {
      setCpc(0.42);
    } else if (p === 'tiktok') {
      setCpc(0.25);
    } else {
      setCpc(0.34);
    }
  };

  // Math & Media Buying Engine
  const calc = useMemo(() => {
    // 1. Unit margins
    const marginPerUnit = Math.max(0, aov - cogs);
    const marginPercent = aov > 0 ? (marginPerUnit / aov) * 100 : 0;
    const breakEvenRoas = marginPerUnit > 0 ? aov / marginPerUnit : 0;
    const breakEvenCpa = marginPerUnit;

    // 2. Traffic funnel CPA
    const estimatedCpa = cr > 0 ? cpc / (cr / 100) : 0;
    const effectiveCpa = estimatedCpa > 0 && isFinite(estimatedCpa) ? estimatedCpa : 1;

    // 3. Meta / TikTok 50 conversions / 7 days learning exit threshold
    // 50 / 7 = 7.15 orders/day
    const optimalDailySpend = Math.max(
      platform === 'tiktok' ? 20 : 15,
      Math.round(7.15 * effectiveCpa)
    );

    // 4. Effective daily spend based on active mode
    const activeDailySpend = calcMode === 'budget' ? dailyBudget : Math.round(targetOrders * effectiveCpa);

    // 5. Performance Metrics
    const dailyClicks = cpc > 0 ? Math.round(activeDailySpend / cpc) : 0;
    const dailyOrders = effectiveCpa > 0 ? activeDailySpend / effectiveCpa : 0;
    const weeklyOrders = dailyOrders * 7;
    const monthlyOrders = Math.round(dailyOrders * 30);

    const dailyRevenue = dailyOrders * aov;
    const monthlyRevenue = dailyRevenue * 30;

    const dailyCogs = dailyOrders * cogs;
    const monthlyCogs = dailyCogs * 30;

    const monthlySpend = activeDailySpend * 30;
    const dailyNetProfit = dailyRevenue - dailyCogs - activeDailySpend;
    const monthlyNetProfit = dailyNetProfit * 30;

    const roas = activeDailySpend > 0 ? dailyRevenue / activeDailySpend : 0;
    const roiPercent = monthlySpend > 0 ? (monthlyNetProfit / monthlySpend) * 100 : 0;

    // 6. Diagnostics
    const isProfitable = effectiveCpa < breakEvenCpa;
    const isLearningExit = weeklyOrders >= 50;

    let statusType = 'green';
    let statusText = 'Окупна модель: Фаза навчання закрита (50+ продажів/тижд)';

    if (!isProfitable) {
      statusType = 'red';
      statusText = 'Збиткова модель: CPA перевищує маржу товару';
    } else if (!isLearningExit) {
      statusType = 'yellow';
      statusText = 'Низький темп: Ризик застрягання в Learning Limited';
    }

    return {
      marginPerUnit,
      marginPercent,
      breakEvenRoas,
      breakEvenCpa,
      effectiveCpa,
      optimalDailySpend,
      activeDailySpend,
      dailyClicks,
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      dailyRevenue,
      monthlyRevenue,
      dailyCogs,
      monthlyCogs,
      monthlySpend,
      dailyNetProfit,
      monthlyNetProfit,
      roas,
      roiPercent,
      isProfitable,
      isLearningExit,
      statusType,
      statusText,
    };
  }, [aov, cogs, cr, cpc, dailyBudget, calcMode, targetOrders, platform]);

  const quickBudgets = [30, 50, 100, 150, 250, 500];

  return (
    <div className={styles.calcCard}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            Калькулятор добових інвестицій та юніт-економіки
          </h3>
          <p className={styles.subtitle}>
            Точний прорахунок щоденних вкладень у рекламу Meta Ads (Instagram/FB) та TikTok Ads з прогнозом окупності
          </p>
        </div>

        <div
          className={`${styles.badgeZone} ${
            calc.statusType === 'green'
              ? styles.badgeGreen
              : calc.statusType === 'yellow'
              ? styles.badgeYellow
              : styles.badgeRed
          }`}
        >
          {calc.statusType === 'green' ? (
            <CheckCircle2 size={14} />
          ) : calc.statusType === 'yellow' ? (
            <TrendingUp size={14} />
          ) : (
            <AlertTriangle size={14} />
          )}
          <span>{calc.statusText}</span>
        </div>
      </div>

      {/* Mode Switcher & Platform Pills */}
      <div className={styles.toolbarRow}>
        <div className={styles.modeTabs}>
          <button
            type="button"
            className={`${styles.modeTabBtn} ${calcMode === 'budget' ? styles.modeTabActive : ''}`}
            onClick={() => setCalcMode('budget')}
          >
            <DollarSign size={14} />
            <span>Розрахунок від добового бюджету</span>
          </button>
          <button
            type="button"
            className={`${styles.modeTabBtn} ${calcMode === 'targetOrders' ? styles.modeTabActive : ''}`}
            onClick={() => setCalcMode('targetOrders')}
          >
            <Target size={14} />
            <span>Розрахунок від мети продажів</span>
          </button>
        </div>

        <div className={styles.platformPillsGroup}>
          <span className={styles.pillLabel}>Канал трафіку:</span>
          <button
            type="button"
            className={`${styles.platformPill} ${platform === 'meta' ? styles.platformPillActive : ''}`}
            onClick={() => handlePlatformChange('meta')}
          >
            Meta Ads (Insta/FB)
          </button>
          <button
            type="button"
            className={`${styles.platformPill} ${platform === 'tiktok' ? styles.platformPillActive : ''}`}
            onClick={() => handlePlatformChange('tiktok')}
          >
            TikTok Ads
          </button>
          <button
            type="button"
            className={`${styles.platformPill} ${platform === 'omni' ? styles.platformPillActive : ''}`}
            onClick={() => handlePlatformChange('omni')}
          >
            Омніканал
          </button>
        </div>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Column: Product Economics & Investment Controls */}
        <div className={styles.leftCol}>
          <div className={styles.sectionTitle}>1. Економіка товару та воронка</div>
          <div className={styles.inputsGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>СЕРЕДНІЙ ЧЕК (AOV, $)</label>
              <input
                type="number"
                min="1"
                step="1"
                className={styles.inputField}
                value={aov}
                onChange={(e) => setAov(Math.max(1, Number(e.target.value) || 0))}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>СОБІВАРТІСТЬ (COGS, $)</label>
              <input
                type="number"
                min="0"
                step="1"
                className={styles.inputField}
                value={cogs}
                onChange={(e) => setCogs(Math.max(0, Number(e.target.value) || 0))}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>КОНВЕРСІЯ САЙТУ (CR, %)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                className={styles.inputField}
                value={cr}
                onChange={(e) => setCr(Math.max(0.1, Number(e.target.value) || 0))}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>ЦІНА КЛІКА (CPC, $)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={styles.inputField}
                value={cpc}
                onChange={(e) => setCpc(Math.max(0.01, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          {/* Investment Control Section */}
          <div className={styles.investmentControlBox}>
            <div className={styles.sectionTitle}>
              {calcMode === 'budget' ? '2. Добові вкладення в рекламу' : '2. Бажана кількість замовлень на день'}
            </div>

            {calcMode === 'budget' ? (
              <>
                <div className={styles.spendInputRow}>
                  <div className={styles.spendInputWrapper}>
                    <span className={styles.currencySymbol}>$</span>
                    <input
                      type="number"
                      min="10"
                      step="5"
                      className={styles.spendInput}
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Math.max(5, Number(e.target.value) || 0))}
                    />
                    <span className={styles.perDayText}>/ день</span>
                  </div>

                  <div className={styles.monthlySpendPreview}>
                    = <strong>${(dailyBudget * 30).toLocaleString()}</strong> / місяць інвестицій
                  </div>
                </div>

                {/* Quick Budget Step Buttons */}
                <div className={styles.quickStepsRow}>
                  <span className={styles.quickStepsLabel}>Швидкі суми:</span>
                  {quickBudgets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`${styles.stepBtn} ${dailyBudget === val ? styles.stepBtnActive : ''}`}
                      onClick={() => setDailyBudget(val)}
                    >
                      ${val}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`${styles.stepBtnFeatured} ${dailyBudget === calc.optimalDailySpend ? styles.stepBtnActive : ''}`}
                    onClick={() => setDailyBudget(calc.optimalDailySpend)}
                    title="Встановити рекомендований алгоритмом бюджет для 50 подій/тиждень"
                  >
                    🎯 Оптимум (${calc.optimalDailySpend})
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.spendInputRow}>
                  <div className={styles.spendInputWrapper}>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className={styles.spendInput}
                      value={targetOrders}
                      onChange={(e) => setTargetOrders(Math.max(1, Number(e.target.value) || 0))}
                    />
                    <span className={styles.perDayText}>продажів / день</span>
                  </div>

                  <div className={styles.monthlySpendPreview}>
                    Необхідно вкладати: <strong>${calc.activeDailySpend}</strong> / день (${calc.monthlySpend.toLocaleString()} / міс)
                  </div>
                </div>

                <div className={styles.quickStepsRow}>
                  <span className={styles.quickStepsLabel}>Цільові продажі:</span>
                  {[5, 10, 15, 25, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`${styles.stepBtn} ${targetOrders === num ? styles.stepBtnActive : ''}`}
                      onClick={() => setTargetOrders(num)}
                    >
                      {num} шт/день
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Financial Results & Real Projections */}
        <div className={styles.rightCol}>
          <div className={styles.resultsGrid}>
            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>ЦІНА ЗАМОВЛЕННЯ (CPA)</span>
              <div className={styles.kpiValRow}>
                <span className={styles.kpiVal} style={{ color: calc.isProfitable ? '#38BDF8' : 'var(--color-danger)' }}>
                  ${calc.effectiveCpa.toFixed(2)}
                </span>
                <span className={styles.kpiSubBadge}>Max: ${calc.breakEvenCpa.toFixed(2)}</span>
              </div>
              <span className={styles.kpiDesc}>Розраховано з CPC ${cpc.toFixed(2)} та CR {cr}%</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>ПРОДАЖІВ НА ДОБУ</span>
              <div className={styles.kpiValRow}>
                <span className={styles.kpiVal}>{calc.dailyOrders.toFixed(1)}</span>
                <span className={styles.kpiSubBadge}>{Math.round(calc.weeklyOrders)} / тижд</span>
              </div>
              <span className={styles.kpiDesc}>
                {calc.isLearningExit ? '✓ Достатньо для навчання пікселя' : '⚠️ Менше 50 подій/тиждень'}
              </span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>ЧИСТИЙ ПРИБУТОК НА МІСЯЦЬ</span>
              <div className={styles.kpiValRow}>
                <span
                  className={styles.kpiValHighlight}
                  style={{ color: calc.monthlyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
                >
                  ${Math.round(calc.monthlyNetProfit).toLocaleString()}
                </span>
              </div>
              <span className={styles.kpiDesc}>Виторг: ${Math.round(calc.monthlyRevenue).toLocaleString()} / міс</span>
            </div>

            <div className={styles.kpiCard}>
              <span className={styles.kpiLabel}>ОКУПНІСТЬ ТА ROAS</span>
              <div className={styles.kpiValRow}>
                <span className={styles.kpiVal} style={{ color: 'var(--color-success)' }}>
                  {calc.roas.toFixed(2)}x
                </span>
                <span className={styles.kpiSubBadge}>ROI +{Math.round(calc.roiPercent)}%</span>
              </div>
              <span className={styles.kpiDesc}>Точка беззбитковості: {calc.breakEvenRoas.toFixed(2)}x</span>
            </div>
          </div>

          {/* Breakdown Table (Day / Week / Month) */}
          <div className={styles.projectionTableWrapper}>
            <table className={styles.projectionTable}>
              <thead>
                <tr>
                  <th>ПЕРІОД</th>
                  <th>ВКЛАДЕННЯ</th>
                  <th>КЛІКИ</th>
                  <th>ПРОДАЖІ</th>
                  <th>ЧИСТИЙ ДОХІД</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.periodCol}>1 День</td>
                  <td>${calc.activeDailySpend}</td>
                  <td>~{calc.dailyClicks}</td>
                  <td><strong>{calc.dailyOrders.toFixed(1)}</strong></td>
                  <td style={{ color: calc.dailyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                    {calc.dailyNetProfit >= 0 ? `+$${Math.round(calc.dailyNetProfit)}` : `-$${Math.abs(Math.round(calc.dailyNetProfit))}`}
                  </td>
                </tr>
                <tr>
                  <td className={styles.periodCol}>7 Днів (Тиждень)</td>
                  <td>${calc.activeDailySpend * 7}</td>
                  <td>~{calc.dailyClicks * 7}</td>
                  <td><strong>{Math.round(calc.weeklyOrders)}</strong></td>
                  <td style={{ color: calc.dailyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                    {calc.dailyNetProfit >= 0 ? `+$${Math.round(calc.dailyNetProfit * 7).toLocaleString()}` : `-$${Math.abs(Math.round(calc.dailyNetProfit * 7))}`}
                  </td>
                </tr>
                <tr>
                  <td className={styles.periodCol}>30 Днів (Місяць)</td>
                  <td>${calc.monthlySpend.toLocaleString()}</td>
                  <td>~{(calc.dailyClicks * 30).toLocaleString()}</td>
                  <td><strong>{calc.monthlyOrders}</strong></td>
                  <td style={{ color: calc.monthlyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 700 }}>
                    {calc.monthlyNetProfit >= 0 ? `+$${Math.round(calc.monthlyNetProfit).toLocaleString()}` : `-$${Math.abs(Math.round(calc.monthlyNetProfit))}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Media Buying Recommendation */}
          <div className={styles.recommendationBox}>
            <strong>Рекомендація медіабаєру:</strong>{' '}
            {!calc.isProfitable ? (
              `Трафік збитковий! Вартість ліда ($${calc.effectiveCpa.toFixed(2)}) перевищує маржинальність ($${calc.breakEvenCpa.toFixed(2)}). Не підвищуйте вкладення, поки не зменшите CPC хуками або не піднімете конверсію сторінки.`
            ) : calc.activeDailySpend < calc.optimalDailySpend ? (
              `При бюджеті $${calc.activeDailySpend}/день ви отримуєте ~${Math.round(calc.weeklyOrders)} продажів за 7 днів. Алгоритм ${platform === 'meta' ? 'Meta Advantage+' : 'TikTok'} працюватиме в режимі обмеженого навчання. Для стабільного виходу з фази навчання рекомендується збільшити добові вкладення до $${calc.optimalDailySpend}/день.`
            ) : (
              `Вкладення $${calc.activeDailySpend}/день повністю забезпечують вихід з фази навчання (${Math.round(calc.weeklyOrders)} продажів/тиждень). Очікуваний чистий прибуток: +$${Math.round(calc.monthlyNetProfit).toLocaleString()}/місяць (ROI +${Math.round(calc.roiPercent)}%). Рекомендовано масштабувати бюджет не більше ніж на +15–20% кожні 48 годин.`
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
