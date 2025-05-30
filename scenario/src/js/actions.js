// Отправка города, названного пользователем, во фронтенд
function sendCity(city, context) {
    addAction({
        type: "user_city",
        city: city
    }, context);
}

// Активация кнопки на фронтенде (например, onStart, onPlay, handleTryAgain)
function activateButton(buttonName, context) {
    addAction({
        type: "activate_button",
        button: buttonName
    }, context);
}

// Отправка результата игры (например, победа или проигрыш)
function declareResult(result, context) {
    addAction({
        type: "game_result",
        result: result
    }, context);
}