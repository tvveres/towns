// Получение текущего запроса пользователя
function get_request(context) {
    if (context && context.request) {
        return context.request.rawRequest || {};
    }
    return {};
}

// Получение последнего названного города из контекста
function get_last_city(context) {
    if (context && context.app && context.app.lastCity) {
        return context.app.lastCity;
    }
    return "";
}

// Получение текущего сообщения с экрана
function get_current_message(context) {
    if (context && context.app && context.app.currentMessage) {
        return context.app.currentMessage;
    }
    return "";
}

// Получение текущего состояния игры
function get_game_state(context) {
    if (context && context.app && context.app.gameState) {
        return context.app.gameState;
    }
    return "playing"; // Значение по умолчанию
}

// Получение данных действия сервера (если есть)
function get_server_action(request) {
    if (request &&
        request.payload &&
        request.payload.data &&
        request.payload.data.server_action) {
        return request.payload.data.server_action;
    }
    return {};
}