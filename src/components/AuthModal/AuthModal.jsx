import React, { useState } from 'react';
import { X, CheckCircle2, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './AuthModal.module.css';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, handleLogin } = useApp();
  const [email, setEmail] = useState('mykhailo.bahyn@student.uzhnu.edu.ua');
  const [token, setToken] = useState('mkv_live_token_sec_991823');
  const [rememberMe, setRememberMe] = useState(true);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email);
  };

  const handleOAuth = async (provider) => {
    await handleLogin(`user_${provider.toLowerCase()}@business.mkv`);
  };

  const handleForgot = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  return (
    <div className={styles.overlay} onClick={() => setIsAuthModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.closeBtn} onClick={() => setIsAuthModalOpen(false)}>
          <X size={18} />
        </button>

        <div className={styles.logoBadge}>MkV</div>
        <h2 className={styles.title}>Вхід до робочого кабінету</h2>
        <p className={styles.subtitle}>Платформа управління рекламою Meta Ads та TikTok Ads</p>

        <div className={styles.socialButtons}>
          <button type="button" className={styles.metaBtn} onClick={() => handleOAuth('Meta')}>
            <strong>f</strong> Продовжити через Meta Business
          </button>
          <button type="button" className={styles.googleBtn} onClick={() => handleOAuth('Google')}>
            <strong>G</strong> Увійти за допомогою Google Workspace
          </button>
        </div>

        <div className={styles.divider}>
          <span>АБО ЧЕРЕЗ КОРПОРАТИВНУ ПОШТУ</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>РОБОЧА ЕЛЕКТРОННА ПОШТА</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                required
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CheckCircle2 size={16} className={styles.validIcon} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>ПАРОЛЬ АБО API-ТОКЕН ДОСТУПУ</label>
            <div className={styles.inputWrapper}>
              <input
                type="password"
                required
                className={styles.input}
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.rememberRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Запам'ятати мене на цьому пристрої</span>
            </label>
            <span
              className={styles.forgotLink}
              onClick={handleForgot}
              role="button"
              tabIndex={0}
            >
              Забули пароль?
            </span>
          </div>

          {resetSent && (
            <div style={{ fontSize: '12px', color: 'var(--color-success)', marginBottom: '12px', textAlign: 'center' }}>
              ✓ Посилання для відновлення надіслано на вказану пошту
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            Увійти до панелі таргетолога
          </button>
        </form>

        <div className={styles.securityNote}>
          <Lock size={12} />
          <span>Захищений сеанс 256-бітним SSL шифруванням • ФІТ УжНУ 2026</span>
        </div>
      </div>
    </div>
  );
}
