theme: /

    state: ПомощьПользователю
        q!: (~помощь|помоги)
        
        script:
            log('help: context: ' + JSON.stringify($context))

            var req = get_request($context);
            if (!req || req === '') {
                req = 'help'; // значение по умолчанию
            }

            var item_id = get_id_by_selected_item(req);
            help(item_id, $context);