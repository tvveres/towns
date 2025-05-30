theme: /

    state: GameScreen
        script:
            var message = get_current_message($context);
            if (message)
                $reactions.say(message);
            else
                $reactions.say("Назови любой город. У тебя 30 секунд!");

    state: PlayerTurn
        q!: $City::city
        script:
            sendCity($parseTree.city, $context);
        go!: /GameScreen/HandleBotResponse

    state: HandleBotResponse
        event!: bot_response
        script:
            var message = get_current_message($context);
            var gameState = get_game_state($context);
            if (gameState === "playing")
                if (message.startsWith("Бот:"))
                    $reactions.say(message);
                    var lastCity = get_last_city($context);
                    var lastLetter = lastCity.charAt(lastCity.length - 1).toUpperCase();
                    if (lastLetter === "Ь" || lastLetter === "Ъ")
                        lastLetter = lastCity.charAt(lastCity.length - 2).toUpperCase();
                    $reactions.say("Твой ход! Назови город, начинающийся на '" + lastLetter + "'. У тебя 30 секунд!");
        go!: /GameScreen

    state: CheckGameState
        event!: game_state_update
        script:
            var gameState = get_game_state($context);
            if (gameState === "timeOut")
                set_next_state("/GameOverScreen/TimeOut");
            else if (gameState === "victory")
                set_next_state("/GameOverScreen/Victory");
        go!: $next_state
