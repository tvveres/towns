import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StartPage } from './components/StartPage';
import { RulesPage } from './components/RulesPage';
import { GamePage } from './components/GamePage';
import { HelpPage } from './components/HelpPage';
import { HelpButton } from './components/HelpButton';
import ErrorBoundary from './components/ErrorBoundary';
import { initialize } from './config';
import { AssistantAppState } from '@sberdevices/assistant-client';
import './App.css';

type Page = 'start' | 'rules' | 'game' | 'help';

interface AssistantCommand {
  type: string;
  payload?: any;
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('start');
  const [lastCity, setLastCity] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPage = useRef<Page>('start');
  const nextPage = useRef<Page | null>(null);
  const assistantRef = useRef<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handlePageTransition = useCallback((newPage: Page) => {
    if (currentPage === newPage) return;
    nextPage.current = newPage;
    setIsTransitioning(true);
  }, [currentPage]);

  const handleCommand = useCallback((command: AssistantCommand) => {
    switch (command.type) {
      case 'show_help':
        previousPage.current = currentPage;
        handlePageTransition('help');
        break;
      case 'go_back':
        if (currentPage === 'help') {
          handlePageTransition(previousPage.current);
        } else if (currentPage === 'rules') {
          handlePageTransition('start');
        }
        break;
      case 'start_game':
        handlePageTransition('game');
        setLastCity(null);
        break;
      case 'show_rules':
        handlePageTransition('rules');
        break;
    }
  }, [currentPage, handlePageTransition]);

  useEffect(() => {
    const initAssistant = async () => {
      try {
        setIsInitializing(true);
        // Initialize assistant
        assistantRef.current = await initialize(
          () => ({
            page: currentPage,
            timeLeft,
            lastCity
          } as AssistantAppState)
        );
      } catch (error) {
        console.error('Failed to initialize assistant:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAssistant();

    // Cleanup function
    return () => {
      if (assistantRef.current) {
        try {
          assistantRef.current.close();
        } catch (error) {
          console.error('Error closing assistant:', error);
        }
      }
    };
  }, []); // Empty dependency array since we only want to initialize once

  useEffect(() => {
    const assistant = assistantRef.current;
    if (!assistant || isInitializing) return;

    const handleAssistantData = (command: AssistantCommand) => {
      handleCommand(command);
    };

    try {
      // Subscribe to events
      if (typeof assistant.subscribe === 'function') {
        assistant.subscribe((command: AssistantCommand) => {
          handleAssistantData(command);
        });
      } else if (typeof assistant.on === 'function') {
        assistant.on('data', handleAssistantData);
      }

      // Send initial state
      assistant.sendData({
        action: {
          type: 'init',
          payload: {}
        }
      });

      return () => {
        try {
          // Unsubscribe from events
          if (typeof assistant.unsubscribe === 'function') {
            assistant.unsubscribe();
          } else if (typeof assistant.removeListener === 'function') {
            assistant.removeListener('data', handleAssistantData);
          }
        } catch (error) {
          console.error('Error removing listener:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up assistant listeners:', error);
    }
  }, [handleCommand, isInitializing]);

  useEffect(() => {
    if (isTransitioning && nextPage.current) {
      const timer = setTimeout(() => {
        setCurrentPage(nextPage.current!);
        setIsTransitioning(false);
        nextPage.current = null;
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleStartClick = useCallback(() => {
    handlePageTransition('rules');
  }, [handlePageTransition]);

  const handlePlayClick = useCallback(() => {
    handlePageTransition('game');
    setLastCity(null);
  }, [handlePageTransition]);

  const handleGameEnd = useCallback(() => {
    handlePageTransition('start');
    setLastCity(null);
  }, [handlePageTransition]);

  const handleBack = useCallback(() => {
    if (currentPage === 'help') {
      handlePageTransition(previousPage.current);
    } else if (currentPage === 'rules') {
      handlePageTransition('start');
    }
  }, [currentPage, handlePageTransition]);

  const handleHelpClick = useCallback(() => {
    previousPage.current = currentPage;
    handlePageTransition('help');
  }, [currentPage, handlePageTransition]);

  const renderCurrentPage = useCallback(() => {
    switch (currentPage) {
      case 'start':
        return <StartPage onStart={handleStartClick} />;
      case 'rules':
        return <RulesPage onPlay={handlePlayClick} onBack={handleBack} />;
      case 'game':
        return (
          <GamePage 
            onGameEnd={handleGameEnd} 
            lastCity={lastCity}
            assistant={assistantRef.current}
            setTimeLeft={setTimeLeft}
          />
        );
      case 'help':
        return <HelpPage onBack={handleBack} />;
      default:
        return null;
    }
  }, [currentPage, handleStartClick, handlePlayClick, handleBack, handleGameEnd, lastCity]);

  return (
    <ErrorBoundary>
      <div className={`app ${isTransitioning ? 'fade' : ''}`}>
        {currentPage !== 'help' && <HelpButton onClick={handleHelpClick} />}
        {renderCurrentPage()}
    </div>
    </ErrorBoundary>
  );
}; 