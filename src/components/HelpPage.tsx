import React from 'react';
import styles from './HelpPage.module.css';

interface HelpPageProps {
  onBack: () => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  return (
    <div className={styles.helpContainer}>
      <button onClick={onBack} className={styles.backButton}>
        ←
      </button>
      <h1>Помощь</h1>
      
      <section className={styles.commandsSection}>
        <h2>Доступные голосовые команды:</h2>
        
        <h3>Общие команды:</h3>
        <ul>
          <li>"Помощь" - открыть справку</li>
          <li>"Назад" - вернуться назад</li>
          <li>"Начать игру" - начать новую игру</li>
          <li>"Правила" - показать правила игры</li>
          <li>"Выход" - закрыть приложение</li>
        </ul>

        <h3>Во время игры:</h3>
        <ul>
          <li>Назвать любой город для хода</li>
          <li>"Повтори" - повторить последний город бота</li>
          <li>"Сдаюсь" - завершить текущую игру</li>
          <li>"Стоп" - остановить игру</li>
        </ul>
      </section>
    </div>
  );
}; 