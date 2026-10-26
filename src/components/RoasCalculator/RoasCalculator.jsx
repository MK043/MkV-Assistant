import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import styles from './RoasCalculator.module.css';

export default function RoasCalculator() {
  const [aov, setAov] = useState(48); // Average order value ($)
  const [cogs, setCogs] = useState(16); // Cost of goods sold ($)
  const [cr, setCr] = useState(2.8); // Conversion rate (%)
  const [dailyBudget, setDailyBudget] = useState(120); // Daily budget ($)
  const [platform, setPlatform] = useState('meta'); // 'meta' | 'tiktok'

  // Unit economics
  const marginPerUnit = Math.max(0, aov - cogs);
  const marginPercent = aov > 0 ? ((marginPerUnit / aov) * 100).toFixed(1) : 0;
  const breakEvenRoas = marginPerUnit > 0 ? (aov / marginPerUnit).toFixed(2) : '0.00';
  const targetMaxCpa = marginPerUnit.toFixed(2);

  // Target profit margin & CPA
  const targetNetMarginPercent = 0.25; // 25% profit target
  const targetCpa = Math.max(1, marginPerUnit * (1 - targetNetMarginPercent));

  // Meta & TikTok 50 conversions in 7 days algorithm rule
  // 50 conversions / 7 days = ~7.15 conversions/day
  const optimalDailyBudget = Math.max(
    platform === 'tiktok' ? 20 : 15,
    Math.round(7.15 * targetCpa)
  );

  // Funnel & Performance calculations
  const platformCpc = platform === 'tiktok' ? 0.26 : 0.42;
  const estimatedCpa = cr > 0 ? platformCpc / (cr / 100) : targetCpa;
  const effectiveCpa = estimatedCpa > 0 && isFinite(estimatedCpa) ? estimatedCpa : targetCpa;

  const estDailyLeads = effectiveCpa > 0 ? dailyBudget / effectiveCpa : 0;
  const estWeeklyLeads = estDailyLeads * 7;
  const estMonthlySpend = dailyBudget * 30;
  const estMonthlyRevenue = Math.round(estDailyLeads * 30 * aov);
  const estMonthlyNetProfit = Math.round((estDailyLeads * 30 * marginPerUnit) - estMonthlySpend);

  const isHealthy = estMonthlyNetProfit > 0 && parseFloat(breakEvenRoas) < 2.5;
  const hasExitedLearning = estWeeklyLeads >= 50;

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.calcHeader}>
        <div>
          <h3 className={styles.calcTitle}>
            Калькулятор окупності (Unit Economics &amp; Scale Simulator)
          </h3>
          <p className={styles.calcSub}>
            Розрахунок точки беззбитковості (Break-Even ROAS) та безпечного масштабування рекламного бюджету
          </p>
        </div>

        <div className={`${styles.badgeZone} ${isHealthy ? styles.badgeGreen : styles.badgeYellow}`}>
          <TrendingUp size={14} />
          <span>
            {isHealthy
              ? 'Зелена зона: Готово до масштабування (+25%)'
              : 'Зона уваги: Потрібна оптимізація оферу'}
          </span>
        </div>
      </div>

      <div className={styles.calcBody}>
        {/* Left Column: 4 Clean Inputs + Minimal Platform & Target Spend Row */}
        <div className={styles.inputsSection}>
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
              <label className={styles.inputLabel}>ДОБОВИЙ БЮДЖЕТ ($)</label>
              <input
                type="number"
                min="10"
                step="10"
                className={styles.inputField}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Math.max(5, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          {/* Minimal Smart Spend Helper for Meta & TikTok */}
          <div className={styles.optimalSpendHelper}>
            <div className={styles.platformPills}>
              <span className={styles.helperLabel}>Аукціон:</span>
              <button
                type="button"
                className={`${styles.miniPill} ${platform === 'meta' ? styles.miniPillActive : ''}`}
                onClick={() => setPlatform('meta')}
              >
                Meta Ads (Instagram/FB)
              </button>
              <button
                type="button"
                className={`${styles.miniPill} ${platform === 'tiktok' ? styles.miniPillActive : ''}`}
                onClick={() => setPlatform('tiktok')}
              >
                TikTok Ads
              </button>
            </div>

            <div className={styles.optimalBadgeRow}>
              <span className={styles.optimalText}>
                Ідеальний спенд для 50 подій/тижд: <strong>${optimalDailyBudget} / день</strong>
              </span>
              {dailyBudget !== optimalDailyBudget && (
                <button
                  type="button"
                  className={styles.applyBtn}
                  onClick={() => setDailyBudget(optimalDailyBudget)}
                  title="Встановити рекомендований алгоритмом бюджет"
                >
                  Встановити
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Results Panel */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultsGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>BREAK-EVEN ROAS</span>
              <span className={styles.resultVal} style={{ color: 'var(--color-success)' }}>
                {breakEvenRoas}x
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>TARGET MAX CPA</span>
              <span className={styles.resultVal}>
                ${targetMaxCpa}
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>МАРЖИНАЛЬНІСТЬ</span>
              <span className={styles.resultVal}>
                {marginPercent}%
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>ПРОГНОЗ ЧИСТОГО ПРИБУТКУ</span>
              <span
                className={styles.resultVal}
                style={{ color: estMonthlyNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}
              >
                ${estMonthlyNetProfit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.scaleRecommendation}>
            <strong>Рекомендація алгоритму:</strong>{' '}
            {effectiveCpa > marginPerUnit
              ? `Вартість ліда ($${effectiveCpa.toFixed(2)}) перевищує маржинальність ($${targetMaxCpa}). Рекомендовано знизити CPC оновленням креативу або підняти конверсію сайту.`
              : isHealthy
              ? `При середньому чеку $${aov} та Break-Even ${breakEvenRoas}x кампанія витримує CPA до $${targetMaxCpa}. Для стабільного виходу з фази навчання ${platform === 'meta' ? 'Meta' : 'TikTok'} рекомендовано спенд від $${optimalDailyBudget}/день (~${Math.round(estWeeklyLeads)} конверсій/тиждень).`
              : `Маржа занизька ($${marginPerUnit}/замовлення). Збільшіть середній чек через Upsell або підвищте конверсію сторінки.`}
          </div>
        </div>
      </div>
    </div>
  );
}
