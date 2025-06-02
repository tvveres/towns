import React, { useState, useEffect, useRef } from 'react';
import styles from './GamePage.module.css';
import { AssistantAppState } from '@sberdevices/assistant-client';
import { initialize } from '../config';

interface GamePageProps {
  onGameEnd: () => void;
  lastCity: string | null;
}

interface GameEndState {
  isEnded: boolean;
  winner: 'player' | 'bot' | null;
}

type AssistantCommand = {
  type: string;
  payload: {
    message?: string;
    city?: string;
    winner?: 'player' | 'bot';
  };
};

export const GamePage: React.FC<GamePageProps> = ({ onGameEnd }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState('');
  const [lastBotCity, setLastBotCity] = useState<string>('');
  const [gameEnd, setGameEnd] = useState<GameEndState>({ isEnded: false, winner: null });
  const [inputCity, setInputCity] = useState('');
  const timerRef = useRef<number | null>(null);
  const assistantRef = useRef(initialize(() => ({
    timeLeft,
    lastCity: lastBotCity
  })));

  // Инициализация ассистента
  useEffect(() => {
    const assistant = assistantRef.current;

    assistant.on('data', (command: unknown) => {
      const { type, payload } = command as AssistantCommand;
      switch (type) {
        case 'invalid_move':
          setMessage(payload.message || '');
          break;
        case 'bot_move':
          if (payload.city) {
            setLastBotCity(payload.city);
            setTimeLeft(30);
          }
          break;
        case 'game_end':
          if (payload.winner) {
            handleGameEnd(payload.winner);
          }
          break;
        case 'game_reset':
          setMessage(payload.message || '');
          setTimeLeft(30);
          setLastBotCity('');
          break;
        case 'hint':
          setMessage(payload.message || '');
          break;
      }
    });

    // Отправляем начальное состояние
    assistant.sendData({
      action: {
        type: 'start_game',
        payload: {}
      }
    });

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Таймер
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleGameEnd('bot');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleGameEnd = (winner: 'player' | 'bot') => {
    setGameEnd({ isEnded: true, winner });
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = inputCity.trim();
    
    if (!city) return;

    assistantRef.current.sendData({
      action: {
        type: 'player_move',
        payload: { city }
      }
    });

    setInputCity('');
  };

  const calculateTimerProgress = () => {
    return ((30 - timeLeft) / 30) * 628.32;
  };

  if (gameEnd.isEnded) {
    return (
      <div className={styles.gameOverContainer}>
        <h1 className={styles.gameOverTitle}>
          {gameEnd.winner === 'player' ? 'Вы выиграли!' : 'Вы проиграли!'}
        </h1>
        <p className={styles.gameOverText}>
          {gameEnd.winner === 'player' 
            ? 'Поздравляем! Бот не смог найти подходящий город.' 
            : 'Время вышло или вы не смогли назвать город.'}
        </p>
        <button className={styles.tryAgainButton} onClick={onGameEnd}>
          Играть снова
        </button>
      </div>
    );
  }

  return (
    <div className={styles.gamePageContainer}>
      <div className={styles.timerContainer}>
        <svg className={styles.timerSvg} viewBox="0 0 200 200">
          <circle
            className={styles.timerBackground}
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="10"
          />
          <circle
            className={styles.timerProgress}
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="var(--primary-green)"
            strokeWidth="10"
            strokeDasharray="628.32"
            strokeDashoffset={calculateTimerProgress()}
          />
          <text className={styles.timerText} x="100" y="100">
            {timeLeft}
          </text>
        </svg>
      </div>

      <h1 className={styles.prompt}>Игра в города</h1>
      
      <div className={styles.inputContainer}>
        {message && <p className={styles.message}>{message}</p>}
        
        {lastBotCity && (
          <p className={styles.botMessage}>
            Ассистент: {lastBotCity}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className={styles.cityInput}
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
            placeholder="Введите название города..."
            autoFocus
          />
        </form>
        
        <button 
          className={styles.tryAgainButton} 
          onClick={() => assistantRef.current.sendData({ 
            action: { 
              type: 'reset_game',
              payload: {}
            } 
          })}
        >
          Закончить игру
        </button>
      </div>
    </div>
  );
};