import React from 'react';
import './GameScreen.css';

const GameScreen = () => (
  <div className="game-screen">
    <div className="game-container">
      <h2 className="game-title">Введите город</h2>
      <input type="text" className="city-input"placeholder="Например: Москва" />
      <button className="submit-button">
        Играем!
      </button>
    </div>
  </div>
);

export default GameScreen;