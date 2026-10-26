import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clapperboard, Rocket, Flame, ArrowRight, Plus } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import styles from './MasterHub.module.css';

export default function MasterHub() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar
        title="Головний огляд платформи (Master Hub)"
        breadcrumb="MkV CRM / Головний огляд платформи (Master Hub)"
        actionLabel="+ Створити кампанію"
        onActionClick={() => navigate('/campaigns')}
      />

      <div className={styles.container}>
        {/* Top Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h2>Вітаємо у MkV Sales Manager CRM, Михайле 👋</h2>
            <p>Усі рекламні кабінети підключені та синхронізовані. Система готова до запуску та оптимізації кампаній.</p>
            <div className={styles.bannerStats}>
              <span className={styles.bannerBadge}>● За останні 24г: $640 витрат</span>
              <span className={styles.bannerBadge}>● 54 нові ліди</span>
              <span className={`${styles.bannerBadge} ${styles.bannerBadgeInfo}`}>● Середній ROAS 3.92x</span>
            </div>
          </div>
        </div>

        {/* 4 Main Module Cards */}
        <div className={styles.cardsGrid}>
          {/* Card 1: Analytics */}
          <div className={styles.hubCard}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <BarChart3 size={20} />
                </div>
                <h3 className={styles.cardTitle}>Панель крос-платформної аналітики</h3>
              </div>
              <div className={styles.cardTagline}>Meta Ads + TikTok Ads в одному вікні</div>
              <p className={styles.cardDesc}>
                Зведена аналітика витрат без перемикання кабінетів. Автоматичний підрахунок реальної окупності (ROAS) в умовах iOS 14+.
              </p>
            </div>
            <div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ВИТРАТИ</span>
                  <span className={styles.statVal}>$14,820</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>СЕРЕДНІЙ ROAS</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-success)' }}>3.82x</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ЛІДИ</span>
                  <span className={styles.statVal}>1,240</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => navigate('/analytics')}
              >
                <span>Перейти до аналітики (Розділ 2.1)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Card 2: AI Creative Studio */}
          <div className={styles.hubCard}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Clapperboard size={20} />
                </div>
                <h3 className={styles.cardTitle}>Креативна ШІ-студія та розкадровка</h3>
              </div>
              <div className={styles.cardTagline}>Генератор сценаріїв для TikTok та Reels</div>
              <p className={styles.cardDesc}>
                ШІ розписує відео по секундах: перші 0–3с для зачеплення глядача (хук), середина з демонстрацією проблеми та CTA.
              </p>
            </div>
            <div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ФОРМАТ</span>
                  <span className={styles.statVal} style={{ fontSize: '15px' }}>9:16 Вертикальне</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>СТРУКТУРА</span>
                  <span className={styles.statVal} style={{ fontSize: '15px' }}>3 сцени (Хук/CTA)</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ОЗВУЧКА</span>
                  <span className={styles.statVal} style={{ fontSize: '15px', color: 'var(--color-success)' }}>AI Voiceover (Укр)</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => navigate('/creative')}
              >
                <span>Відкрити ШІ-студію (Розділ 2.2)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Card 3: Campaigns & Media Buying */}
          <div className={styles.hubCard}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Rocket size={20} />
                </div>
                <h3 className={styles.cardTitle}>Кампанії та правила медіабаїнгу</h3>
              </div>
              <div className={styles.cardTagline}>Автоматизація управління рекламним бюджетом</div>
              <p className={styles.cardDesc}>
                Зручні швидкі перемикачі для активації оголошень. Розумні правила безпеки: автоматична зупинка зливу та масштабування.
              </p>
            </div>
            <div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>АКТИВНІ КАМПАНІЇ</span>
                  <span className={styles.statVal}>5 кампаній</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>CPA GUARD</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-success)', fontSize: '15px' }}>Авто-пауза &gt; $15</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ВРЯТОВАНО БЮДЖЕТУ</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-info)' }}>$340.00</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => navigate('/campaigns')}
              >
                <span>Керувати кампаніями (Розділ 2.3)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Card 4: Ad Fatigue Detector */}
          <div className={styles.hubCard}>
            <div>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Flame size={20} />
                </div>
                <h3 className={styles.cardTitle}>Детектор вигорання аудиторії та хуки</h3>
              </div>
              <div className={styles.cardTagline}>Контроль втоми оголошень та ротація перших 3с</div>
              <p className={styles.cardDesc}>
                Відстеження моменту, коли люди перестають клікати на рекламу. Заміна перших 3 секунд ролика без втрати історії оптимізації.
              </p>
            </div>
            <div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>СТАН АУДИТОРІЇ</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-success)', fontSize: '15px' }}>Втома низька (24%)</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>УТРИМАННЯ (3s HOLD)</span>
                  <span className={styles.statVal} style={{ fontSize: '15px' }}>48.2% (Відмінно)</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ПОТРЕБУЮТЬ ЗАМІНИ</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-danger)' }}>1 оголошення</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => navigate('/fatigue')}
              >
                <span>Перевірити вигорання (Розділ 2.4)</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Recent Events Bar */}
        <div className={styles.eventsCard}>
          <div className={styles.eventsTitle}>ОСТАННІ ПОДІЇ СИСТЕМИ</div>
          <div className={styles.eventsList}>
            <div className={styles.eventItem}>
              <span className={styles.eventDot} />
              <span>[14:20] Авто-правило CPA Threshold зупинило збиткову групу оголошень «Retargeting_UA»</span>
            </div>
            <div className={styles.eventItem}>
              <span className={styles.eventDot} />
              <span>[12:05] ШІ згенерував сценарій для TikTok «EcoCosmetics_Hook_01»</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
