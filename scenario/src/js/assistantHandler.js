const { CitiesGame } = require('./gameLogic');
const { sendCity, activateButton, declareResult } = require('./actions');
const { get_request, get_last_city, get_game_state } = require('./getters');
const { reply, addAction, addSuggestions } = require('./reply');

class AssistantHandler {
    constructor(citiesList) {
        this.game = new CitiesGame(citiesList);
    }

    // Обработка входящего сообщения
    handleMessage(context) {
        const request = get_request(context);
        const serverAction = request.payload?.data?.server_action;

        if (serverAction) {
            switch (serverAction.type) {
                case 'player_move':
                    this.handlePlayerMove(serverAction.city, context);
                    break;
                case 'reset_game':
                    this.handleResetGame(context);
                    break;
                case 'get_hint':
                    this.handleGetHint(context);
                    break;
            }
        }
    }

    // Обработка хода игрока
    handlePlayerMove(city, context) {
        const result = this.game.makePlayerMove(city);
        
        if (!result.isValid) {
            reply(result.message, context.response);
            addAction({
                type: 'invalid_move',
                message: result.message
            }, context);
            return;
        }

        // Ход бота
        const botMove = this.game.makeBotMove();
        
        if (!botMove.success) {
            reply('Поздравляем! Вы выиграли!', context.response);
            declareResult('win', context);
            return;
        }

        reply(`Мой ход: ${botMove.city}`, context.response);
        sendCity(botMove.city, context);

        // Проверка окончания игры
        if (this.game.checkGameEnd()) {
            reply('Игра окончена! Вы проиграли.', context.response);
            declareResult('lose', context);
        }
    }

    // Обработка сброса игры
    handleResetGame(context) {
        this.game.resetGame();
        reply('Игра сброшена. Можете начинать!', context.response);
        activateButton('start', context);
    }

    // Обработка запроса подсказки
    handleGetHint(context) {
        if (!this.game.lastCity) {
            reply('Назовите любой город, чтобы начать игру', context.response);
            return;
        }

        const lastChar = this.game.getLastChar(this.game.lastCity);
        const availableCities = Array.from(this.game.citiesList)
            .filter(city => !this.game.usedCities.has(city))
            .filter(city => city.toLowerCase()[0] === lastChar)
            .slice(0, 3);

        if (availableCities.length > 0) {
            reply('Вот несколько возможных городов:', context.response);
            addSuggestions(availableCities, context);
        } else {
            reply('К сожалению, я не могу найти подходящие города', context.response);
        }
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AssistantHandler };
} 