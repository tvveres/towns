import { 
  createAssistant, 
  createSmartappDebugger, 
  AssistantAppState,
  AssistantSmartAppError
} from '@sberdevices/assistant-client';
import { setupDebugPanel } from './components/AssistantDebugPanel';

let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds
const MAX_RETRY_DELAY = 10000; // 10 seconds

// Store cleanup function
let cleanupDebugPanel: (() => void) | null = null;

export const initialize = async (
  getState: () => AssistantAppState,
  getRecoveryState?: () => AssistantAppState
) => {
  const token = import.meta.env.VITE_ASSISTANT_TOKEN;
  const smartappId = import.meta.env.REACT_APP_SMARTAPP || 'Игра в города';
    
  if (!token) {
    console.error('Missing assistant token! Make sure VITE_ASSISTANT_TOKEN is set in your .env file');
  }

  const handleConnectionError = (error: any) => {
    console.error('Assistant connection error:', error);
    
    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(RETRY_DELAY * Math.pow(2, retryCount), MAX_RETRY_DELAY);
      retryCount++;
      console.log(`Reconnection attempt (${retryCount}/${MAX_RETRIES}) in ${delay}ms...`);
      return new Promise(resolve => setTimeout(resolve, delay));
    } else {
      console.error('Maximum retry attempts reached. Please check your connection.');
      return Promise.reject(new Error('Max retries reached'));
    }
  };

  // Cleanup previous debug panel if exists
  if (cleanupDebugPanel) {
    cleanupDebugPanel();
    cleanupDebugPanel = null;
  }

  if (import.meta.env.DEV) {
    try {
      // Setup debug panel
      const cleanup = setupDebugPanel();
      if (cleanup) {
        cleanupDebugPanel = cleanup;
      }
      
      const assistant = createSmartappDebugger({
        token: token,
        initPhrase: `Запусти ${smartappId}`,
            getState,
            getRecoveryState,
            nativePanel: {
                screenshotMode: false,
                tabIndex: -1,
            },
        });

      // Use the correct event handling methods
      const handleError = async (error: AssistantSmartAppError["smart_app_error"]) => {
        console.error('Assistant error:', error);
        try {
          await handleConnectionError(error);
          // Reset the assistant connection
          assistant.close();
          if (cleanupDebugPanel) {
            cleanupDebugPanel();
            cleanupDebugPanel = null;
          }
          return initialize(getState, getRecoveryState);
        } catch (retryError) {
          console.error('Failed to recover assistant connection:', retryError);
        }
      };

      assistant.on('error', handleError);

      return assistant;
    } catch (error) {
      console.error('Error initializing assistant in dev mode:', error);
      if (cleanupDebugPanel) {
        cleanupDebugPanel();
        cleanupDebugPanel = null;
      }
      throw error;
    }
  }

  // Production mode
  try {
    const assistant = createAssistant({
      getState,
      getRecoveryState
    });

    const handleError = async (error: AssistantSmartAppError["smart_app_error"]) => {
      console.error('Assistant error:', error);
      try {
        await handleConnectionError(error);
        // Reset the assistant connection
        assistant.close();
        return initialize(getState, getRecoveryState);
      } catch (retryError) {
        console.error('Failed to recover assistant connection:', retryError);
      }
    };

    assistant.on('error', handleError);

    return assistant;
  } catch (error) {
    console.error('Error initializing assistant in production mode:', error);
    throw error;
  }
};
