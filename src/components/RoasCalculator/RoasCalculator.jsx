import React, { useState } from 'react';
import { Calculator, Sparkles, TrendingUp } from 'lucide-react';
import styles from './RoasCalculator.module.css';

export default function RoasCalculator() {
  const [aov, setAov] = useState(48); // Average order value ($)
  const [cogs, setCogs] = useState(16); // Cost of goods sold ($)
  const [cr, setCr] = useState(2.8); // Conversion rate (%)
  const [dailyBudget, setDailyBudget] = useState(120); // Daily budget ($)

  const marginPerUnit = Math.max(0, aov - cogs);
  const marginPercent = aov > 0 ? ((marginPerUnit / aov) * 100).toFixed(1) : 0;
  const breakEvenRoas = marginPerUnit > 0 ? (aov / marginPerUnit).toFixed(2) : 0;
  const maxAllowableCpa = marginPerUnit.toFixed(2);

  // Projected Monthly
  const monthlySpend = dailyBudget * 30;
  const estLeads = Math.round(monthlySpend / (maxAllowableCpa * 0.75 || 10));
  const estRevenue = Math.round(estLeads * aov);
  const estNetProfit = Math.round((estLeads * marginPerUnit) - monthlySpend);
  const isHealthy = estNetProfit > 0 && breakEvenRoas < 2.5;

  return (
    <div className={styles.calculatorCard}>
      <div className={styles.calcHeader}>
        <div>
          <h3 className={styles.calcTitle}>
            Калькулятор окупності (Unit Economics & Scale Simulator)
          </h3>
          <p className={styles.calcSub}>
            Розрахунок точки беззбитковості (Break-Even ROAS) та безпечного масштабування рекламного бюджету
          </p>
        </div>

        <div className={`${styles.badgeZone} ${isHealthy ? styles.badgeGreen : styles.badgeYellow}`}>
          <TrendingUp size={14} />
          <span>{isHealthy ? 'Зелена зона: Готово до масштабування (+25%)' : 'Зона уваги: Потрібна оптимізація оферу'}</span>
        </div>
      </div>

      <div className={styles.calcBody}>
        {/* Inputs */}
        <div className={styles.inputsGrid}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Середній чек (AOV, $)</label>
            <input
              type="number"
              min="5"
              step="1"
              className={styles.inputField}
              value={aov}
              onChange={(e) => setAov(Number(e.target.value) || 0)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Собівартість (COGS, $)</label>
            <input
              type="number"
              min="0"
              step="1"
              className={styles.inputField}
              value={cogs}
              onChange={(e) => setCogs(Number(e.target.value) || 0)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Конверсія сайту (CR, %)</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              className={styles.inputField}
              value={cr}
              onChange={(e) => setCr(Number(e.target.value) || 0)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Добовий бюджет ($)</label>
            <input
              type="number"
              min="10"
              step="10"
              className={styles.inputField}
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Live Calculated Results */}
        <div className={styles.resultsPanel}>
          <div className={styles.resultsGrid}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Break-Even ROAS</span>
              <span className={styles.resultVal} style={{ color: 'var(--color-success)' }}>
                {breakEvenRoas}x
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Target Max CPA</span>
              <span className={styles.resultVal}>
                ${maxAllowableCpa}
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Маржинальність</span>
              <span className={styles.resultVal}>
                {marginPercent}%
              </span>
            </div>

            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Прогноз чистого прибутку</span>
              <span className={styles.resultVal} style={{ color: estNetProfit >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                ${estNetProfit.toLocaleString()}
              </span>
            </div>
          </div>

          <div className={styles.scaleRecommendation}>
            <strong>Рекомендація алгоритму:</strong>{' '}
            {isHealthy
              ? `При середньому чеку $${aov} та Break-Even ${breakEvenRoas}x кампанія витримує CPA до $${maxAllowableCpa}. Рекомендовано поступово підвищувати бюджет на 15–20% кожні 48 годин без збивання оптимізації пікселя.`
              : `Маржа занизька ($${marginPerUnit}/замовлення). Збільшіть середній чек через Upsell/бандли або знизьте вартість залучення через оновлення перших 3 секунд креативу.`}
          </div>
        </div>
      </div>
    </div>
  );
}
