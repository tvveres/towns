import React, { useState, useEffect } from 'react';

interface GamePageProps {
  onGameEnd: () => void;
  lastCity: string | null;
}

export const GamePage: React.FC<GamePageProps> = ({ onGameEnd, lastCity }) => {
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (lastCity) {
      console.log('Received city from assistant:', lastCity);
      setCities((prev) => [...prev, lastCity]);
    }
  }, [lastCity]);

  return (
    <div>
      <h1>Игра в города</h1>
      <ul>
        {cities.map((city, index) => (
          <li key={index}>{city}</li>
        ))}
      </ul>
      <button onClick={onGameEnd}>Закончить игру</button>
    </div>
  );
};