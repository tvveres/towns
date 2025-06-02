# Подключение данных
require: data/cities.json

# Подключение js-обработчиков
require: js/getters.js
require: js/reply.js
require: js/actions.js
require: js/gameLogic.js
require: js/assistantHandler.js

# Подключение сценариев
require: sc/start.sc
require: sc/rules.sc
require: sc/game.sc
require: sc/gameOver.sc

patterns:
    $City = $regexp<[\p{L}\s-]+>

init:
    $global.$game = new AssistantHandler($cities);

theme: /
    state: Start
        q!: $regex</start>
        go!: /StartScreen

    state: Fallback
        event!: noMatch
        a: Я вас не понял. Попробуйте ещё раз.