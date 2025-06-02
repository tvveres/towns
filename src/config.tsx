import { 
  createAssistant, 
  createSmartappDebugger, 
  AssistantAppState
} from '@sberdevices/assistant-client';

export const initialize = (
  getState: () => AssistantAppState,
  getRecoveryState?: () => AssistantAppState
) => {
    const token = import.meta.env.VITE_ASSISTANT_TOKEN;
    const smartappId = import.meta.env.REACT_APP_SMARTAPP || 'Игра в города';
    
    if (!token) {
        console.error('Assistant token is missing! Make sure VITE_ASSISTANT_TOKEN is set in your .env file');
    }

    if (import.meta.env.DEV) {
        return createSmartappDebugger({
            token: token,
            initPhrase: `Запусти ${smartappId}`,
            getState,
            getRecoveryState,
            nativePanel: {
                defaultText: 'Назовите город...',
                screenshotMode: false,
                tabIndex: -1,
            },
        });
    }

    // В production режиме токен не нужен
    return createAssistant({ 
        getState, 
        getRecoveryState 
    });
};
