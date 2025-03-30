import React from 'react';
import './StartScreen.css';

const StartScreen = () => {
  return (
    <div className="start-screen"> 
      <div className="start-content">
        <h1 className="game-title">ГОРОДА</h1>
        
        <div className="game-description">
          <p>Открой для себя мир через игру!</p>
          <p>Проверь свои знания географии и узнай новые удивительные места.</p>
          <p>Каждый город - это новая история, новый пейзаж, новое приключение.</p>
        </div>
        
        <button className="play-button">
          Начать путешествие
        </button>
      </div>
    </div>
  );
};

export default StartScreen;