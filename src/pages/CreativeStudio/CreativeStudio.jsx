import React, { useState, useEffect } from 'react';
import { Zap, Play, Pause, Loader2, Copy, Download, Plus, CheckCircle2, Film, Sparkles } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './CreativeStudio.module.css';

export default function CreativeStudio() {
  const { storyboard, handleGenerateStoryboard, handleAddCustomScene } = useApp();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Expanded Generation Parameters
  const [productName, setProductName] = useState(
    'Продаж авто після замовлення з США, Нісан Ліф 2020 року з пошкодженням спереду мінімальний, максимальна комплектація сл плюс 62 квт, 100 тисяч км пробігу, треба гарний відос на рекламу'
  );
  const [duration, setDuration] = useState('30 секунд');
  const [scenesCount, setScenesCount] = useState('4');
  const [filmingStyle, setFilmingStyle] = useState('UGC на iPhone (Живий селфі-тест + POV)');
  const [campaignGoal, setCampaignGoal] = useState('Холодний трафік (Зачеплення з першої секунди)');
  const [hookType, setHookType] = useState('Ціна / Вигода (Shock Price / Реальна вартість під ключ)');
  const [tone, setTone] = useState('Динамічна та провокативна');
  const [format, setFormat] = useState('TikTok / Reels (9:16 Вертикальне)');

  // Custom Scene state
  const [showAddScene, setShowAddScene] = useState(false);
  const [customVisual, setCustomVisual] = useState('');
  const [customQuote, setCustomQuote] = useState('');
  const [feedback, setFeedback] = useState('');

  const currentBoard = storyboard || {
    title: 'Nissan Leaf 2020 SL Plus (62 кВт) • Авто з США',
    duration: '30 секунд',
    niche: 'Автобізнес та електромобілі',
    scenes: [],
  };

  const totalMaxSeconds = parseInt(currentBoard.duration) || parseInt(duration) || 30;

  // Audio simulation timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalMaxSeconds) {
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
  }, [isPlaying, totalMaxSeconds]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!productName.trim()) return;

    setIsGenerating(true);
    try {
      await handleGenerateStoryboard({
        product: productName.trim(),
        duration,
        scenesCount,
        filmingStyle,
        campaignGoal,
        hookType,
        tone,
        format,
      });
      setIsPlaying(false);
      setCurrentTime(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = () => {
    if (!currentBoard.scenes || currentBoard.scenes.length === 0) return;
    const lines = [
      `НАЗВА: ${currentBoard.title}`,
      `НІША: ${currentBoard.niche || 'Медіабаїнг'}`,
      `ХРОНОМЕТРАЖ: ${currentBoard.duration}`,
      `СТИЛЬ ЗЙОМКИ: ${filmingStyle}`,
      `ФОРМАТ: ${format}`,
      '========================================',
      ...currentBoard.scenes.map((s) =>
        `[СЦЕНА ${s.number} (${s.time}) — ${s.title}]\nКАМЕРА: ${s.shotType || 'Стандартний план'}\nВІЗУАЛ: ${s.visual}\nОЗВУЧКА: ${s.quote}\n${s.audioFx ? `ЗВУК (SFX): ${s.audioFx}\n` : ''}ФОКУС: ${s.tag}\n`
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
      `Платформа: MkV Sales Manager CRM • AI Creative Studio`,
      `============================================================\n`,
      `Проєкт: ${currentBoard.title}`,
      `Цільова ніша: ${currentBoard.niche || 'E-Commerce / B2B'}`,
      `Формат ролика: ${format}`,
      `Загальний хронометраж: ${currentBoard.duration}`,
      `Кількість сцен: ${currentBoard.scenes.length}`,
      `Метод зйомки: ${filmingStyle}`,
      `Ціль кампанії: ${campaignGoal}`,
      `Психологічний хук: ${hookType}`,
      `Тональність озвучки: ${tone}\n`,
      `ПОСЛІДОВНІСТЬ КАДРІВ ТА РОЗКАДРОВКА:\n`,
      ...currentBoard.scenes.map((s) => (
        `------------------------------------------------------------\n` +
        `СЦЕНА ${s.number} (${s.time}) — ${s.title}\n` +
        `Ракурс та робота камери: ${s.shotType || 'UGC фронтальний план'}\n` +
        `Візуальний ряд: ${s.visual}\n` +
        `Текст диктора / Субтитри: ${s.quote}\n` +
        (s.audioFx ? `Звуковий дизайн (SFX): ${s.audioFx}\n` : '') +
        `Ключовий показник: ${s.tag}\n`
      )),
      `\nСтворено автоматично через ШІ-Студію MkV CRM (УжНУ 2026).`
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Brief_${currentBoard.title.replace(/[^a-zA-Zа-яА-Я0-9]/g, '_')}.txt`);
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

  const progressPercent = (currentTime / totalMaxSeconds) * 100;
  const formattedCurrentTime = `0:${currentTime < 10 ? '0' : ''}${currentTime}`;
  const formattedTotalTime = `0:${totalMaxSeconds < 10 ? '0' : ''}${totalMaxSeconds}`;

  return (
    <div>
      <Navbar title="Креативна ШІ-студія сценаріїв" />

      <div className={styles.container}>
        {/* Left Column: Form & Detailed Settings */}
        <div className={styles.leftCol}>
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-primary-light)' }} />
              <h2 className={styles.panelTitle} style={{ margin: 0 }}>Адаптивний ШІ-Генератор</h2>
            </div>
            <p className={styles.panelSub}>
              Розумний парсинг ніші, розкадровка, ракурси камери та звуковий дизайн
            </p>

            <form onSubmit={handleGenerate}>
              <div className={styles.formGroup}>
                <label className={styles.label}>ОПИС ТОВАРУ, ПОСЛУГИ АБО ЗАДАЧІ</label>
                <textarea
                  required
                  rows={3}
                  className={styles.textarea}
                  placeholder="Введіть будь-який опис: марку авто, параметри товару, послугу, ціну..."
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ТРИВАЛІСТЬ РОЛИКА</label>
                  <select className={styles.select} value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option>15 секунд (Динамічний бліц-хук)</option>
                    <option>30 секунд (Оптимальний TikTok / Reels)</option>
                    <option>45 секунд (Детальний тест / Огляд)</option>
                    <option>60 секунд (Повний розбір / Закриття заперечень)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>КІЛЬКІСТЬ СЦЕН</label>
                  <select className={styles.select} value={scenesCount} onChange={(e) => setScenesCount(e.target.value)}>
                    <option value="3">3 сцени (Хук → Суть → Заклик)</option>
                    <option value="4">4 сцени (Хук → Огляд → Доказ → Офер)</option>
                    <option value="5">5 сцен (Хук → Стан → Тест → Заперечення → CTA)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>МЕТОД ТА РАКУРСИ ЗЙОМКИ</label>
                <select className={styles.select} value={filmingStyle} onChange={(e) => setFilmingStyle(e.target.value)}>
                  <option>UGC на iPhone (Живий селфі-тест + POV)</option>
                  <option>Динамічний Speed-Ramp (Швидкі наїзди камери + Zoom-in)</option>
                  <option>Експертний розбір (Говоряча голова + B-Roll перебивки)</option>
                  <option>Кінематографічний B-Roll (Slow-motion 60fps + стабілізатор)</option>
                  <option>POV від першої особи (Погляд клієнта / За кермом)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>МЕТА КАМПАНІЇ ТА ОХОПЛЕННЯ</label>
                <select className={styles.select} value={campaignGoal} onChange={(e) => setCampaignGoal(e.target.value)}>
                  <option>Холодний трафік (Зачеплення з першої секунди)</option>
                  <option>Гарячі ліди / Продаж у лоб (Конкретний офер і ціна)</option>
                  <option>Закриття заперечень (Довіра, стан, Carfax/гарантія)</option>
                  <option>Ретаргетинг (Лімітована пропозиція / Дедлайн)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>ТИП ПСИХОЛОГІЧНОГО ХУКА (0–3 СЕКУНДИ)</label>
                <select className={styles.select} value={hookType} onChange={(e) => setHookType(e.target.value)}>
                  <option>Ціна / Вигода (Shock Price / Реальна вартість під ключ)</option>
                  <option>Особистий досвід (UGC Founder / Чесний огляд без прикрас)</option>
                  <option>Проблема → Рішення (Problem-Solution / Помилка вибору)</option>
                  <option>Інтрига / Запитання (Curiosity Gap / «Не купуй, поки...»)</option>
                  <option>Руйнування міфів (Mythbuster / «Всі думають, що це збиток...»)</option>
                  <option>Шокуюча статистика (Pattern Interrupt)</option>
                </select>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>ТОНАЛЬНІСТЬ ОЗВУЧКИ</label>
                  <select className={styles.select} value={tone} onChange={(e) => setTone(e.target.value)}>
                    <option>Динамічна та провокативна</option>
                    <option>Експертна, авторитетна, технічна</option>
                    <option>Дружня, розмовна, без пафосу (порада знайомого)</option>
                    <option>Преміальна, спокійна, виважена</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>ФОРМАТ ВІДЕО</label>
                  <select className={styles.select} value={format} onChange={(e) => setFormat(e.target.value)}>
                    <option>TikTok / Reels (9:16 Вертикальне)</option>
                    <option>Square Post (1:1 Квадратне)</option>
                    <option>Feed Landscape (16:9 Горизонтальне)</option>
                  </select>
                </div>
              </div>

              <button type="submit" disabled={isGenerating} className={styles.generateBtn}>
                {isGenerating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>ШІ адаптує сценарій під запит...</span>
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Згенерувати персональну розкадровку</span>
                  </>
                )}
              </button>
            </form>
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

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className={styles.panelTitle} style={{ fontSize: '18px' }}>
                  Готова розкадровка: «{currentBoard.title}»
                </h2>
                <div className={styles.metaPillsRow}>
                  <span className={styles.metaPill}>● Ніша: {currentBoard.niche || 'Авто / E-Commerce'}</span>
                  <span className={styles.metaPill}>● Хронометраж: {currentBoard.duration}</span>
                  <span className={styles.metaPill}>● Сцен: {currentBoard.scenes?.length || 4}</span>
                  <span className={styles.metaPill}>● Стиль: {filmingStyle.split(' ')[0]}</span>
                </div>
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
                    placeholder="Опис кадру та візуалу"
                    className={styles.input}
                    value={customVisual}
                    onChange={(e) => setCustomVisual(e.target.value)}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Текст диктора або закадровий голос"
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

            {/* Render Scenes */}
            {currentBoard.scenes && currentBoard.scenes.map((scene, idx) => {
              const cardClass = idx === 1 ? styles.sceneCard2 : idx === 2 ? styles.sceneCard3 : '';
              const badgeClass = idx === 1 ? styles.sceneBadge2 : idx === 2 ? styles.sceneBadge3 : '';
              return (
                <div key={idx} className={`${styles.sceneCard} ${cardClass}`}>
                  <div className={styles.sceneHeader}>
                    <span className={`${styles.sceneBadge} ${badgeClass}`}>
                      СЦЕНА {scene.number} ({scene.time}) &nbsp; {scene.title}
                    </span>
                    {scene.shotType && (
                      <span className={styles.shotTypeBadge}>🎥 {scene.shotType}</span>
                    )}
                  </div>
                  <div>
                    <span className={styles.sceneLabel}>ВІЗУАЛ ТА РОБОТА КАМЕРИ:</span>
                    <p className={styles.sceneText}>{scene.visual}</p>
                  </div>
                  <div>
                    <span className={styles.sceneLabel}>ТЕКСТ НА ВІДЕО ТА ДИКТОРСЬКА ОЗВУЧКА:</span>
                    <p className={styles.sceneQuote}>{scene.quote}</p>
                  </div>
                  {scene.audioFx && (
                    <div>
                      <span className={styles.sceneLabel}>ЗВУКОВИЙ ДИЗАЙН (SFX / MUSIC):</span>
                      <p className={styles.sceneSfx}>🔊 {scene.audioFx}</p>
                    </div>
                  )}
                  <span className={styles.tagPill}>{scene.tag}</span>
                </div>
              );
            })}

            {/* Audio Voiceover Simulation Bar */}
            <div className={styles.audioBar}>
              <button
                type="button"
                className={styles.playBtn}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
              </button>
              <div className={styles.audioInfo}>
                <span className={styles.audioTitle}>Дикторська озвучка (AI Voice Simulation)</span>
                <span className={styles.audioMeta}>
                  Голос: Оксана (Укр - Природний) • {formattedCurrentTime} / {formattedTotalTime}
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
