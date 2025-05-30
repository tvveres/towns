theme: /

    state: GameOverScreen
    state: TimeOut
        a: Время вышло! Ты проиграл. Хочешь попробовать ещё раз? Скажи "да" или "поехали".
        state: TryAgain
            q: (да|поехали|давай|ещё раз|заново)
            script:
                activateButton("handleTryAgain", $context);
            go!: /StartScreen

    state: Victory
        a: Поздравляю! У меня закончились города, ты победил! Хочешь начать сначала? Скажи "да" или "поехали".
        state: StartOver
            q: (да|поехали|давай|ещё раз|заново)
            script:
                activateButton("handleTryAgain", $context);
            go!: /StartScreen