import { createAssistant, createSmartappDebugger } from '@sberdevices/assistant-client';

const initialize = (getState, getRecoveryState) => {
    if (process.env.NODE_ENV === 'development') {
        return createSmartappDebugger({
            token: process.env.REACT_APP_ASSISTANT_TOKEN,
            initPhrase: 'Запусти игру угадай флаг',
            getState,
            getRecoveryState,
            nativePanel: {
                defaultText: 'Покажи что-нибудь',
                screenshotMode: false,
                tabIndex: -1,
            },
        });
    }

    return createAssistant({ getState, getRecoveryState });
};
