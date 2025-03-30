import React from 'react';
import './App.css';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import TownScreen from './components/TownScreen';

function App() {
  return (
    <div className="App">
      {/* <StartScreen /> */}
      {/* <GameScreen /> */}
      <TownScreen />
    </div>
  );
}

export default App;