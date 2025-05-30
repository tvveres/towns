// Функция для отправки простого текстового ответа
function reply(body, response) {
    var replyData = {
        type: "raw",
        body: body
    };    
    response.replies = response.replies || [];
    response.replies.push(replyData);
}

// Функция для добавления действия в ответ
function addAction(action, context) {
    var command = {
        type: "smart_app_data",
        action: action
    };
    if (context.response && context.response.replies) {
        for (var index = 0; index < context.response.replies.length; index++) {
            if (context.response.replies[index].type === "raw" &&
                context.response.replies[index].body &&
                context.response.replies[index].body.items) {
                context.response.replies[index].body.items.push({ command: command });
                return;
            }
        }
    }
    return reply({ items: [{ command: command }] }, context.response);
}

// Функция для добавления предложений (suggestions) в ответ
function addSuggestions(suggestions, context) {
    var buttons = [];
    
    suggestions.forEach(function(suggest) {
        buttons.push({
            action: {
                text: suggest,
                type: "text"
            },
            title: suggest
        });
    });
    
    if (context.response && context.response.replies) {
        for (var index = 0; index < context.response.replies.length; index++) {
            if (context.response.replies[index].type === "raw" &&
                context.response.replies[index].body) {
                context.response.replies[index].body.suggestions = { buttons: buttons };
                return;
            }
        }
    }
    
    reply({ "suggestions": { "buttons": buttons } }, context.response);
}