import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Clapperboard, Rocket, Flame, ArrowRight, Activity, RefreshCw } from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import { useApp } from '../../context/AppContext';
import styles from './MasterHub.module.css';

export default function MasterHub() {
  const navigate = useNavigate();
  const {
    campaigns,
    setIsCreateModalOpen,
    user,
    liveAlert,
    handleSimulateLiveTick,
    liveSyncActive,
    setLiveSyncActive,
  } = useApp();

  const activeCampaigns = campaigns.filter((c) => c.active);
  const totalSpend = campaigns.reduce((acc, c) => acc + (c.spend || 0), 14820);
  const totalLeads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 1240);
  const avgRoas = (campaigns.reduce((acc, c) => acc + Number(c.roas || 3.5), 0) / (campaigns.length || 1)).toFixed(2);

  return (
    <div>
      <Navbar
        title="Головний огляд платформи"
        actionLabel="+ Створити кампанію"
        onActionClick={() => setIsCreateModalOpen(true)}
      />

      <div className={styles.container}>
        {liveAlert && (
          <div className={styles.alertBanner}>
            <Activity size={16} />
            <span>{liveAlert}</span>
          </div>
        )}

        {/* Top Welcome Banner */}
        <div className={styles.welcomeBanner}>
          <div className={styles.welcomeText}>
            <h2>Вітаємо у MkV Sales Manager CRM, {user.name.split(' ')[0]} 👋</h2>
            <p>Усі рекламні кабінети підключені та синхронізовані. Система готова до оптимізації кампаній.</p>
            <div className={styles.bannerStats}>
              <span className={styles.bannerBadge}>● Загальні витрати: ${totalSpend.toLocaleString()}</span>
              <span className={styles.bannerBadge}>● {totalLeads.toLocaleString()} лідів</span>
              <span className={`${styles.bannerBadge} ${styles.bannerBadgeInfo}`}>● Середній ROAS {avgRoas}x</span>

              <button
                type="button"
                className={`${styles.pulseBtn} ${liveSyncActive ? styles.pulseBtnActive : ''}`}
                onClick={() => setLiveSyncActive(!liveSyncActive)}
                title="Автоматичний пульс лідів кожні 7 секунд"
              >
                <Activity size={14} />
                <span>{liveSyncActive ? '● Live Sync (Увімкнено)' : 'Live Sync (Пульс)'}</span>
              </button>

              <button
                type="button"
                className={styles.pulseBtn}
                onClick={handleSimulateLiveTick}
                title="Оновити метрики вручну"
              >
                <RefreshCw size={14} />
                <span>Оновити дані</span>
              </button>
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
                  <span className={styles.statVal}>${totalSpend.toLocaleString()}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>СЕРЕДНІЙ ROAS</span>
                  <span className={styles.statVal} style={{ color: 'var(--color-success)' }}>{avgRoas}x</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>ЛІДИ</span>
                  <span className={styles.statVal}>{totalLeads.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => navigate('/analytics')}
              >
                <span>Перейти до аналітики</span>
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
                <span>Відкрити ШІ-студію</span>
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
                  <span className={styles.statVal}>{activeCampaigns.length} з {campaigns.length}</span>
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
                <span>Керувати кампаніями</span>
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
                <span>Перевірити вигорання</span>
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
