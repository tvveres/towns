import React from 'react';
import styles from './RulesPage.module.css';

interface RulesPageProps {
  onPlay: () => void;
  onBack: () => void;
}

export const RulesPage: React.FC<RulesPageProps> = ({ onPlay, onBack }) => {
  return (
    <div className={styles.rulesContainer}>
      <button onClick={onBack} className={styles.backButton}>
        ←
      </button>
      <h2 className={styles.rulesTitle}>Правила игры</h2>
      <div className={styles.rulesList}>
        <div className={styles.rule}>
          <span className={styles.ruleNumber}>1</span>
          <p>Называйте города по очереди с ассистентом</p>
        </div>
        <div className={styles.rule}>
          <span className={styles.ruleNumber}>2</span>
          <p>Каждый новый город должен начинаться с последней буквы предыдущего</p>
        </div>
        <div className={styles.rule}>
          <span className={styles.ruleNumber}>3</span>
          <p>У вас есть 30 секунд на ход</p>
        </div>
      </div>
      <button onClick={onPlay} className={styles.playButton}>
        Играть
      </button>
    </div>
  );
}; 