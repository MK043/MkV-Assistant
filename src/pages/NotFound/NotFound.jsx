import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.errorCode}>404</div>
      <h2 className={styles.title}>Сторінку не знайдено</h2>
      <p className={styles.desc}>
        Запитувана адреса відсутня в навігаційній мапі MkV Sales Manager CRM. Перевірте правильність URL або поверніться на головний огляд.
      </p>
      <button
        type="button"
        className={styles.backBtn}
        onClick={() => navigate('/hub')}
      >
        <Home size={18} />
        <span>Повернутися до Головного хабу</span>
      </button>
    </div>
  );
}
