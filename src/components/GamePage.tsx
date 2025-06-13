import React, { useState, useEffect, useRef } from 'react';
import styles from './GamePage.module.css';
import { AssistantAppState } from '@sberdevices/assistant-client';
import { CitiesGame } from '../utils/gameLogic';

interface GamePageProps {
  onGameEnd: () => void;
  lastCity: string | null;
  assistant: any;
  setTimeLeft: (time: number) => void;
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

export const GamePage: React.FC<GamePageProps> = ({ 
  onGameEnd, 
  lastCity: initialLastCity,
  assistant,
  setTimeLeft 
}) => {
  const [timeLeft, setLocalTimeLeft] = useState(30);
  const [message, setMessage] = useState('');
  const [lastBotCity, setLastBotCity] = useState<string>('');
  const [gameEnd, setGameEnd] = useState<GameEndState>({ isEnded: false, winner: null });
  const [inputCity, setInputCity] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const timerRef = useRef<number | null>(null);
  const gameRef = useRef(new CitiesGame());

  // Timer effect
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setLocalTimeLeft((prev) => {
        const newTime = prev <= 1 ? 0 : prev - 1;
        setTimeLeft(newTime);
        if (newTime === 0) {
          clearInterval(timerRef.current!);
          handleGameEnd('bot');
        }
        return newTime;
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

  const handleConfirmGameEnd = () => {
    setShowConfirmDialog(false);
    onGameEnd();
  };

  const handleCancelGameEnd = () => {
    setShowConfirmDialog(false);
  };

  const handleTryAgainClick = () => {
    setShowConfirmDialog(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const city = inputCity.trim();
    
    if (!city) return;

    const result = gameRef.current.makeMove(city);
    
    if (!result.isValid) {
      setMessage(result.message || 'Неверный ход');
      return;
    }

    if (result.gameOver) {
      handleGameEnd('player');
      return;
    }

    if (result.botCity) {
      setLastBotCity(result.botCity);
      setMessage('');
      setLocalTimeLeft(30);
      setTimeLeft(30);
    }

    setInputCity('');
  };

  const resetGame = () => {
    gameRef.current.resetGame();
    const botCity = gameRef.current.makeBotFirstMove();
    setMessage('');
    setLocalTimeLeft(30);
    setTimeLeft(30);
    setLastBotCity(botCity);
    setInputCity('');
  };

  // Assistant command handler
  useEffect(() => {
    const handleAssistantCommand = (command: AssistantCommand) => {
      const { type, payload } = command;
      switch (type) {
        case 'reset_game':
          resetGame();
          break;
        case 'invalid_move':
          setMessage(payload.message || '');
          break;
        case 'bot_move':
          if (payload.city) {
            setLastBotCity(payload.city);
            setLocalTimeLeft(30);
            setTimeLeft(30);
          }
          break;
        case 'game_end':
          if (payload.winner) {
            handleGameEnd(payload.winner);
          }
          break;
      }
    };

    if (assistant && typeof assistant.on === 'function') {
      assistant.on('data', handleAssistantCommand);
    }

    return () => {
      if (assistant && typeof assistant.off === 'function') {
        assistant.off('data', handleAssistantCommand);
      }
    };
  }, [assistant]);

  const calculateTimerProgress = () => {
    return ((30 - timeLeft) / 30) * 628.32;
  };

  const getLastLetterForPrompt = (city: string): string => {
    let lastChar = city.slice(-1).toUpperCase();
    if (lastChar === 'Ь' || lastChar === 'Ъ') {
      lastChar = city.slice(-2, -1).toUpperCase();
    }
    return lastChar;
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
        <button className={styles.tryAgainButton} onClick={handleTryAgainClick}>
          Играть снова
        </button>

        {showConfirmDialog && (
          <div className={styles.confirmDialog}>
            <div className={styles.confirmDialogContent}>
              <p>Вы уверены, что хотите начать новую игру?</p>
              <div className={styles.confirmDialogButtons}>
                <button onClick={handleConfirmGameEnd}>Да</button>
                <button onClick={handleCancelGameEnd}>Нет</button>
              </div>
            </div>
          </div>
        )}
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

      <h1 className={styles.prompt}>
        {lastBotCity ? `Ваш ход! Назовите город на букву "${getLastLetterForPrompt(lastBotCity)}"` : 'Назовите любой город'}
      </h1>
      
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
          onClick={resetGame}
        >
          Начать заново
        </button>
      </div>
    </div>
  );
};