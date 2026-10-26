import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Loader2, Copy, Download, Plus, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './CreativeStudio.module.css';

export default function CreativeStudio() {
  const { storyboard, handleGenerateStoryboard, handleAddCustomScene } = useApp();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const [productName, setProductName] = useState('Натуральна сироватка для обличчя');
  const [format, setFormat] = useState('TikTok / Reels (9:16 Вертикальне)');
  const [hookType, setHookType] = useState('Проблема → Рішення (Problem-Solution)');
  const [tone, setTone] = useState('Дружня, експертна, без реклами в лоб');

  // Custom Scene state
  const [showAddScene, setShowAddScene] = useState(false);
  const [customVisual, setCustomVisual] = useState('');
  const [customQuote, setCustomQuote] = useState('');
  const [feedback, setFeedback] = useState('');

  // Audio simulation timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 20) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await handleGenerateStoryboard({
        product: productName,
        format,
        hookType,
        tone,
      });
      setIsPlaying(false);
      setCurrentTime(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentBoard = storyboard || {
    title: 'EcoCosmetics — Ранковий догляд',
    duration: '20 секунд',
    scenes: [],
  };

  const handleCopyScript = () => {
    if (!currentBoard.scenes || currentBoard.scenes.length === 0) return;
    const lines = [
      `НАЗВА: ${currentBoard.title}`,
      `ТРИВАЛІСТЬ: ${currentBoard.duration}`,
      `ФОРМАТ: ${format}`,
      '----------------------------------------',
      ...currentBoard.scenes.map((s) =>
        `[СЦЕНА ${s.number} (${s.time}) — ${s.title}]\nВІЗУАЛ: ${s.visual}\nОЗВУЧКА: ${s.quote}\nТЕГ: ${s.tag}\n`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setFeedback('Сценарій та таймлайни успішно скопійовано для монтажера!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleDownloadBrief = () => {
    if (!currentBoard.scenes || currentBoard.scenes.length === 0) return;
    const content = [
      `============================================================`,
      `ТЕХНІЧНЕ ЗАВДАННЯ ДЛЯ ВІДЕОМОНТАЖУ ТА ЗЙОМКИ (UGC BRIEF)`,
      `Платформа: MkV Sales Manager CRM • Media Buying OS`,
      `============================================================\n`,
      `Продукт: ${productName}`,
      `Формат ролика: ${format}`,
      `Психологічний хук: ${hookType}`,
      `Тональність озвучки: ${tone}`,
      `Загальний хронометраж: ${currentBoard.duration}\n`,
      `ПОСЛІДОВНІСТЬ СЦЕН ТА РОЗКАДРОВКА:\n`,
      ...currentBoard.scenes.map((s) => (
        `--- СЦЕНА ${s.number} (${s.time}) ---\n` +
        `Фокус: ${s.title}\n` +
        `Візуальний ряд: ${s.visual}\n` +
        `Закадровий текст / Субтитри: ${s.quote}\n` +
        `Цільовий KPI: ${s.tag}\n`
      )),
      `\nСтворено автоматично через ШІ-Студію MkV CRM (УжНУ 2026).`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Brief_${productName.replace(/\s+/g, '_')}_Storyboard.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddSceneSubmit = async (e) => {
    e.preventDefault();
    if (!customVisual.trim() || !customQuote.trim()) return;

    await handleAddCustomScene({
      visual: customVisual.trim(),
      quote: customQuote.trim(),
      tag: 'Користувацька сцена',
    });

    setCustomVisual('');
    setCustomQuote('');
    setShowAddScene(false);
  };

  const progressPercent = (currentTime / 20) * 100;
  const formattedTime = `0:${currentTime < 10 ? '0' : ''}${currentTime}`;

  return (
    <div>
      <Navbar title="Креативна ШІ-студія сценаріїв" />

      <div className={styles.container}>
        {/* Left Column: Form & Saved Scenarios */}
        <div className={styles.leftCol}>
          <div className={styles.panelCard}>
            <h2 className={styles.panelTitle}>ШІ-Генератор сценаріїв</h2>
            <p className={styles.panelSub}>Автоматичний розрахунок таймлайну</p>

            <form onSubmit={handleGenerate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ПРОДУКТ ЧИ ПОСЛУГА</label>
                <input
                  type="text"
                  required
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

              <button type="submit" disabled={isGenerating} className={styles.generateBtn}>
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>ШІ формує розкадровку...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Згенерувати розкадровку</span>
                  </>
                )}
              </button>
            </form>
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
            {feedback && (
              <div className={styles.toastSuccess}>
                <CheckCircle2 size={16} />
                <span>{feedback}</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className={styles.panelTitle}>Готова розкадровка: «{currentBoard.title}»</h2>
                <p className={styles.panelSub} style={{ margin: 0 }}>
                  ● Готово до зйомки та монтажу (тривалість {currentBoard.duration})
                </p>
              </div>

              <div className={styles.headerActions}>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={handleCopyScript}
                  title="Скопіювати текст сценарію у буфер обміну"
                >
                  <Copy size={14} />
                  <span>Копіювати текст</span>
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={handleDownloadBrief}
                  title="Завантажити детальне ТЗ для монтажера"
                >
                  <Download size={14} />
                  <span>Експорт ТЗ (.txt)</span>
                </button>
                <button
                  type="button"
                  className={styles.toolBtn}
                  onClick={() => setShowAddScene(!showAddScene)}
                  title="Додати власну сцену"
                >
                  <Plus size={14} />
                  <span>+ Сцена</span>
                </button>
              </div>
            </div>

            {/* Custom Scene Form */}
            {showAddScene && (
              <form onSubmit={handleAddSceneSubmit} className={styles.addSceneCard}>
                <span className={styles.addSceneTitle}>+ Додати власну сцену до сценарію</span>
                <div className={styles.addSceneRow}>
                  <input
                    type="text"
                    required
                    placeholder="Опис візуалу (напр. Макро-кадр нанесення)"
                    className={styles.input}
                    value={customVisual}
                    onChange={(e) => setCustomVisual(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Озвучка (напр. «Відчуй різницю з 1 дня...»)"
                    className={styles.input}
                    value={customQuote}
                    onChange={(e) => setCustomQuote(e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" className={styles.toolBtn} style={{ background: 'var(--accent-primary)', color: '#fff' }}>
                    Зберегти сцену
                  </button>
                  <button type="button" className={styles.toolBtn} onClick={() => setShowAddScene(false)}>
                    Скасувати
                  </button>
                </div>
              </form>
            )}

            {currentBoard.scenes && currentBoard.scenes.map((scene, idx) => {
              const cardClass = idx === 1 ? styles.sceneCard2 : idx === 2 ? styles.sceneCard3 : '';
              const badgeClass = idx === 1 ? styles.sceneBadge2 : idx === 2 ? styles.sceneBadge3 : '';
              return (
                <div key={idx} className={`${styles.sceneCard} ${cardClass}`}>
                  <span className={`${styles.sceneBadge} ${badgeClass}`}>
                    СЦЕНА {scene.number} ({scene.time}) &nbsp; {scene.title}
                  </span>
                  <div>
                    <span className={styles.sceneLabel}>ВІЗУАЛ НА ЕКРАНІ:</span>
                    <p className={styles.sceneText}>{scene.visual}</p>
                  </div>
                  <div>
                    <span className={styles.sceneLabel}>ТЕКСТ НА ВІДЕО ТА ОЗВУЧКА:</span>
                    <p className={styles.sceneQuote}>{scene.quote}</p>
                  </div>
                  <span className={styles.tagPill}>{scene.tag}</span>
                </div>
              );
            })}

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
                <span className={styles.audioMeta}>
                  Голос: Оксана (Укр - Природний) • {formattedTime} / 0:20
                </span>
                <div className={styles.progressTrack}>
                  <div className={styles.progressBar} style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
