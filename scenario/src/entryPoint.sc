# Подключение js-обработчиков
require: js/getters.js
require: js/reply.js
require: js/actions.js

# Подключение сценариев
require: sc/start.sc
require: sc/rules.sc
require: sc/game.sc
require: sc/gameOver.sc

patterns:
    $City = $regexp<[\p{L}\s-]+>

theme: /
    state: Start
        q!: $regex</start>
        go!: /StartScreen

    state: Fallback
        event!: noMatch
        a: Я вас не понял. Попробуйте ещё раз.