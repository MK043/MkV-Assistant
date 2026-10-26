import React, { useState } from 'react';
import { Zap, Play, Pause } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './CreativeStudio.module.css';

export default function CreativeStudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [productName, setProductName] = useState('Натуральна сироватка для обличчя');
  const [format, setFormat] = useState('TikTok / Reels (9:16 Вертикальне)');
  const [hookType, setHookType] = useState('Проблема → Рішення (Problem-Solution)');
  const [tone, setTone] = useState('Дружня, експертна, без реклами в лоб');

  const handleGenerate = () => {
    alert(`Згенеровано нову розкадровку для: "${productName}" з хуком: "${hookType}"`);
  };

  return (
    <div>
      <Navbar
        title="Креативна ШІ-студія (AI Creative Studio)"
        breadcrumb="MkV CRM / Креативна ШІ-студія (AI Creative Studio)"
      />

      <div className={styles.container}>
        {/* Left Column: Form & Saved Scenarios */}
        <div className={styles.leftCol}>
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>ШІ-Генератор сценаріїв</h2>
            <p className={styles.panelSub}>Автоматичний розрахунок таймлайну</p>

            <div className={styles.formGroup}>
              <label className={styles.label}>ПРОДУКТ ЧИ ПОСЛУГА</label>
              <input
                type="text"
                className={styles.input}
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ФОРМАТ ВІДЕО</label>
              <select className={styles.select} value={format} onChange={(e) => setFormat(e.target.value)}>
                <option>TikTok / Reels (9:16 Вертикальне)</option>
                <option>Square Post (1:1 Квадратне)</option>
                <option>Feed Landscape (16:9 Горизонтальне)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ТИП ХУКА (ПЕРШІ 3 СЕКУНДИ)</label>
              <select className={styles.select} value={hookType} onChange={(e) => setHookType(e.target.value)}>
                <option>Проблема → Рішення (Problem-Solution)</option>
                <option>Інтрига / Запитання (Curiosity Gap)</option>
                <option>Шокуюча статистика (Pattern Interrupt)</option>
                <option>Особистий досвід (UGC Founder Story)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ТОНАЛЬНІСТЬ ОЗВУЧКИ</label>
              <select className={styles.select} value={tone} onChange={(e) => setTone(e.target.value)}>
                <option>Дружня, експертна, без реклами в лоб</option>
                <option>Динамічна та провокативна</option>
                <option>Спокійна, естетична (ASMR)</option>
              </select>
            </div>

            <button type="button" className={styles.generateBtn} onClick={handleGenerate}>
              <Zap size={16} />
              <span>Згенерувати розкадровку</span>
            </button>
          </div>

          <div className={styles.panelCard}>
            <span className={styles.label}>ЗБЕРЕЖЕНІ СЦЕНАРІЇ В РОБОТІ</span>
            <div className={styles.savedItem}>
              <div className={styles.savedInfo}>
                <span className={styles.savedTitle}>EcoCosmetics_Hook_01</span>
                <span className={styles.savedMeta}>Створено сьогодні • 20с ролик</span>
              </div>
              <span className={styles.badgeSuccess}>Активний ✓</span>
            </div>
            <div className={styles.savedItem}>
              <div className={styles.savedInfo}>
                <span className={styles.savedTitle}>Serum_Curiosity_Test</span>
                <span className={styles.savedMeta}>Вчора • 15с ролик</span>
              </div>
              <span className={styles.badgeDraft}>Чернетка</span>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Storyboard */}
        <div className={styles.rightCol}>
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 className={styles.panelTitle}>Готова розкадровка: «EcoCosmetics — Ранковий догляд»</h2>
                <p className={styles.panelSub} style={{ margin: 0 }}>● Готово до зйомки та монтажу (тривалість 20 секунд)</p>
              </div>
            </div>

            {/* Scene 1 */}
            <div className={styles.sceneCard}>
              <span className={styles.sceneBadge}>СЦЕНА 1 (0–3с) &nbsp; Хук (Привернення 80% уваги)</span>
              <div>
                <span className={styles.sceneLabel}>ВІЗУАЛ НА ЕКРАНІ:</span>
                <p className={styles.sceneText}>Крупний план обличчя в дзеркалі, дівчина розчаровано змиває водою звичайний крем.</p>
              </div>
              <div>
                <span className={styles.sceneLabel}>ТЕКСТ НА ВІДЕО ТА ОЗВУЧКА:</span>
                <p className={styles.sceneQuote}>«Чому твій крем забиває пори, а не зволожує? Якщо шкіра досі тьмяна — викинь його...»</p>
              </div>
              <span className={styles.tagPill}>Hold Rate ціль: &gt; 40%</span>
            </div>

            {/* Scene 2 */}
            <div className={`${styles.sceneCard} ${styles.sceneCard2}`}>
              <span className={`${styles.sceneBadge} ${styles.sceneBadge2}`}>СЦЕНА 2 (4–14с) &nbsp; Демонстрація проблеми та засобу</span>
              <div>
                <span className={styles.sceneLabel}>ВІЗУАЛ НА ЕКРАНІ:</span>
                <p className={styles.sceneText}>Кадр з текстурою легкої сироватки з пептидами. Швидке вбирання, миттєве сяйво без липкості.</p>
              </div>
              <div>
                <span className={styles.sceneLabel}>ТЕКСТ НА ВІДЕО ТА ОЗВУЧКА:</span>
                <p className={styles.sceneQuote}>«100% рослинні пептиди проникають глибоко в дерму. Замінює 3 звичайні баночки щоранку.»</p>
              </div>
              <span className={styles.tagPill}>Демонстрація продукту</span>
            </div>

            {/* Scene 3 */}
            <div className={`${styles.sceneCard} ${styles.sceneCard3}`}>
              <span className={`${styles.sceneBadge} ${styles.sceneBadge3}`}>СЦЕНА 3 (15–20с) &nbsp; Заклик до дії (Конверсія / Офер)</span>
              <div>
                <span className={styles.sceneLabel}>ВІЗУАЛ НА ЕКРАНІ:</span>
                <p className={styles.sceneText}>Фірмова баночка поруч зі стрілкою на кнопку замовлення. Плашка зі знижкою -25%.</p>
              </div>
              <div>
                <span className={styles.sceneLabel}>ТЕКСТ НА ВІДЕО ТА ОЗВУЧКА:</span>
                <p className={styles.sceneQuote}>«Тисни на посилання під відео та забирай набір зі знижкою 25% і безкоштовною доставкою!»</p>
              </div>
              <span className={styles.tagPill} style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-success)' }}>
                Офер: Знижка -25%
              </span>
            </div>

            {/* Audio Voiceover Bar */}
            <div className={styles.audioBar}>
              <button
                type="button"
                className={styles.playBtn}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>
              <div className={styles.audioInfo}>
                <span className={styles.audioTitle}>Дикторська озвучка (AI Voice)</span>
                <span className={styles.audioMeta}>Голос: Оксана (Укр - Природний) • {isPlaying ? '0:07 / 0:20' : '0:00 / 0:20'}</span>
                <div className={styles.progressTrack}>
                  <div className={styles.progressBar} style={{ width: isPlaying ? '35%' : '0%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
