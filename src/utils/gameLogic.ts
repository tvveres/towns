import citiesData from '../data/cities.json';

export class CitiesGame {
    private usedCities: Set<string>;
    private lastCity: string | null;
    private popularCities: Set<string>;
    private otherCities: Set<string>;
    private citiesListLower: Set<string>;
    private moveCount: number;
    private difficultyThreshold: number;

    constructor() {
        this.usedCities = new Set();
        this.lastCity = null;
        this.popularCities = new Set(citiesData.popularCities);
        // Flatten the otherCities array since it contains nested arrays
        const flattenedOtherCities = citiesData.otherCities.flat();
        this.otherCities = new Set(flattenedOtherCities);
        this.citiesListLower = new Set([
            ...citiesData.popularCities.map(city => city.toLowerCase()),
            ...flattenedOtherCities.map(city => city.toLowerCase())
        ]);
        this.moveCount = 0;
        this.difficultyThreshold = 15; // После 15 ходов начинаем использовать все города
    }

    private getLastChar(city: string): string {
        let lastChar = city.slice(-1).toLowerCase();
        if (lastChar === 'ь' || lastChar === 'ъ') {
            lastChar = city.slice(-2, -1).toLowerCase();
        }
        return lastChar;
    }

    private getFirstChar(city: string): string {
        return city[0].toLowerCase();
    }

    private findOriginalCity(city: string): string | null {
        const lowerCity = city.toLowerCase();
        // Сначала ищем в популярных городах
        for (const originalCity of this.popularCities) {
            if (originalCity.toLowerCase() === lowerCity) {
                return originalCity;
            }
        }
        // Затем в остальных
        for (const originalCity of this.otherCities) {
            if (originalCity.toLowerCase() === lowerCity) {
                return originalCity;
            }
        }
        return null;
    }

    private isValidMove(city: string): { isValid: boolean; message?: string } {
        const lowerCity = city.toLowerCase();
        
        if (!this.citiesListLower.has(lowerCity)) {
            return { isValid: false, message: 'Такого города нет в списке' };
        }

        const usedCitiesLower = new Set(Array.from(this.usedCities).map(c => c.toLowerCase()));
        if (usedCitiesLower.has(lowerCity)) {
            return { isValid: false, message: 'Этот город уже был использован' };
        }

        if (!this.lastCity) {
            return { isValid: true };
        }

        const lastChar = this.getLastChar(this.lastCity);
        const firstChar = this.getFirstChar(city);
        if (lastChar !== firstChar) {
            return { 
                isValid: false, 
                message: `Город должен начинаться на букву "${lastChar.toUpperCase()}"` 
            };
        }

        return { isValid: true };
    }

    private getBotCity(lastChar: string): string | null {
        let availableCities: string[];
        
        // Сначала пытаемся найти город среди популярных, если не превышен порог сложности
        if (this.moveCount < this.difficultyThreshold) {
            availableCities = Array.from(this.popularCities).filter(c => 
                !this.usedCities.has(c) && 
                this.getFirstChar(c) === lastChar
            );
            
            // Если среди популярных городов нет подходящих, используем все города
            if (availableCities.length === 0) {
                availableCities = Array.from(this.otherCities).filter(c => 
                    !this.usedCities.has(c) && 
                    this.getFirstChar(c) === lastChar
                );
            }
        } else {
            // После превышения порога используем все доступные города
            availableCities = [
                ...Array.from(this.popularCities),
                ...Array.from(this.otherCities)
            ].filter(c => 
                !this.usedCities.has(c) && 
                this.getFirstChar(c) === lastChar
            );
        }

        if (availableCities.length === 0) {
            return null;
        }

        return availableCities[Math.floor(Math.random() * availableCities.length)];
    }

    public makeMove(city: string): { 
        isValid: boolean; 
        message?: string; 
        botCity?: string;
        gameOver?: boolean;
    } {
        const validationResult = this.isValidMove(city);
        if (!validationResult.isValid) {
            return validationResult;
        }

        const originalCity = this.findOriginalCity(city);
        if (!originalCity) {
            return { isValid: false, message: 'Внутренняя ошибка: город не найден' };
        }

        this.usedCities.add(originalCity);
        this.lastCity = originalCity;
        this.moveCount++;

        const lastChar = this.getLastChar(originalCity);
        const botCity = this.getBotCity(lastChar);

        if (!botCity) {
            return { 
                isValid: true, 
                message: 'Поздравляем! Вы выиграли!', 
                gameOver: true 
            };
        }

        this.usedCities.add(botCity);
        this.lastCity = botCity;

        return { 
            isValid: true, 
            botCity,
            message: `Мой ход: ${botCity}`
        };
    }

    public makeBotFirstMove(): string {
        // Для первого хода всегда выбираем из популярных городов
        const availableCities = Array.from(this.popularCities);
        const botCity = availableCities[Math.floor(Math.random() * availableCities.length)];
        this.usedCities.add(botCity);
        this.lastCity = botCity;
        return botCity;
    }

    public getLastCity(): string | null {
        return this.lastCity;
    }

    public resetGame(): void {
        this.usedCities.clear();
        this.lastCity = null;
        this.moveCount = 0;
    }
} 