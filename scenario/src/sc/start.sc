theme: /

    state: StartScreen
        q!: $regex</start>
        a: Добро пожаловать в игру в города! Чтобы начать, скажите "начать", "поехали" или что-то подобное.
        state: StartGame
            q: (начать|поехали|давай|играть|старт)
            script:
                activateButton("onStart", $context);
            go!: /RulesScreen