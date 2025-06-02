// Логика игры в города
class CitiesGame {
    constructor(citiesList) {
        this.citiesList = new Set(citiesList);
        this.usedCities = new Set();
        this.lastCity = null;
    }

    // Проверка валидности города
    isValidCity(city) {
        if (!city) return { isValid: false, message: 'Город не может быть пустым' };
        
        // Проверка наличия города в списке и что он не был использован
        if (!this.citiesList.has(city) || this.usedCities.has(city)) {
            return { 
                isValid: false, 
                message: 'Такого города нет в списке или он уже был использован' 
            };
        }

        // Проверка первой буквы, если это не первый ход
        if (this.lastCity) {
            const lastChar = this.getLastChar(this.lastCity);
            if (city.toLowerCase()[0] !== lastChar) {
                return { 
                    isValid: false, 
                    message: `Город должен начинаться на букву "${lastChar.toUpperCase()}"` 
                };
            }
        }

        return { isValid: true, message: '' };
    }

    // Получение последней буквы города (с учетом ь и ъ)
    getLastChar(city) {
        const loweredCity = city.toLowerCase();
        const lastChar = loweredCity[loweredCity.length - 1];
        if (lastChar === 'ь' || lastChar === 'ъ') {
            return loweredCity[loweredCity.length - 2];
        }
        return lastChar;
    }

    // Ход игрока
    makePlayerMove(city) {
        const validation = this.isValidCity(city);
        if (!validation.isValid) {
            return validation;
        }

        this.usedCities.add(city);
        this.lastCity = city;
        return { isValid: true, message: '' };
    }

    // Ход бота
    makeBotMove() {
        if (!this.lastCity) {
            return { success: false, message: 'Не было хода игрока' };
        }

        const lastChar = this.getLastChar(this.lastCity);
        const availableCities = Array.from(this.citiesList)
            .filter(city => !this.usedCities.has(city))
            .filter(city => city.toLowerCase()[0] === lastChar);

        if (availableCities.length === 0) {
            return { 
                success: false, 
                message: 'Не могу найти подходящий город' 
            };
        }

        // Стратегия выбора города:
        // 1. Предпочитаем города, которые заканчиваются на распространенные буквы
        const commonLetters = ['а', 'в', 'е', 'и', 'к', 'н', 'о', 'р', 'с', 'т'];
        const strategicCities = availableCities.filter(city => {
            const lastChar = this.getLastChar(city);
            return commonLetters.includes(lastChar);
        });

        // Выбираем город из стратегических или из всех доступных
        const cityPool = strategicCities.length > 0 ? strategicCities : availableCities;
        const selectedCity = cityPool[Math.floor(Math.random() * cityPool.length)];

        this.usedCities.add(selectedCity);
        this.lastCity = selectedCity;

        return { 
            success: true, 
            city: selectedCity 
        };
    }

    // Проверка окончания игры
    checkGameEnd() {
        if (!this.lastCity) return false;

        const lastChar = this.getLastChar(this.lastCity);
        const hasAvailableMoves = Array.from(this.citiesList)
            .some(city => !this.usedCities.has(city) && city.toLowerCase()[0] === lastChar);

        return !hasAvailableMoves;
    }

    // Сброс игры
    resetGame() {
        this.usedCities.clear();
        this.lastCity = null;
    }
}

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CitiesGame };
} 