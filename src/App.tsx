import React, { useState, useEffect } from 'react';
import { StartPage } from './components/StartPage';
import { RulesPage } from './components/RulesPage';
import { GamePage } from './components/GamePage';
import './App.css';

type Page = 'start' | 'rules' | 'game';

export const App: React.FC = () => {
  console.log('App component rendering');
  const [currentPage, setCurrentPage] = useState<Page>('start');

  useEffect(() => {
    console.log('App component mounted');
  }, []);

  const handleStartClick = () => {
    console.log('Start button clicked');
    setCurrentPage('rules');
  };

  const handlePlayClick = () => {
    console.log('Play button clicked');
    setCurrentPage('game');
  };

  const handleGameEnd = () => {
    console.log('Game ended');
    setCurrentPage('start');
  };

  return (
    <div className="app">
      {currentPage === 'start' && <StartPage onStart={handleStartClick} />}
      {currentPage === 'rules' && <RulesPage onPlay={handlePlayClick} />}
      {currentPage === 'game' && <GamePage onGameEnd={handleGameEnd} />}
    </div>
  );
}; 