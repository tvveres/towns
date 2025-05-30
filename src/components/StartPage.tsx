import React, { useEffect } from 'react';
import styles from './StartPage.module.css';

interface StartPageProps {
  onStart: () => void;
}

export const StartPage: React.FC<StartPageProps> = ({ onStart }) => {
  useEffect(() => {
    console.log('StartPage mounted');
    console.log('Styles:', styles);
  }, []);

  return (
    <div className={styles.startContainer}>
      <h1 className={styles.title}>Игра в города</h1>
      <button onClick={onStart} className={styles.startButton}>
        Начать игру
      </button>
    </div>
  );
}; 