class GameplayScene {
    constructor() {
        this.gridSize = 6; // Поле 6 на 6 элементов (идеально для экрана телефона)
        this.colors = ['#ff4757', '#2ecc71', '#54a0ff', '#feca57', '#9b59b6']; // Красный, зеленый, синий, желтый, фиолетовый
        this.board = [];
        this.selectedGem = null;
    }

    create() {
        const gi = window.gameInstance;
        const ctx = gi.ctx;
        
        // Размеры и отступы для сетки под экран телефона
        this.cellSize = Math.floor(gi.canvas.width / (this.gridSize + 1));
        this.offsetX = (gi.canvas.width - (this.cellSize * this.gridSize)) / 2;
        this.offsetY = gi.canvas.height * 0.25; // Смещаем поле чуть ниже центра

        // Генерируем игровое поле, если оно еще не создано
        if (this.board.length === 0) {
            this.generateBoard();
        }

        // --- ОТРИСОВКА ---
        // 1. Верхний интерфейс
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ТРИ В РЯД', gi.canvas.width / 2, gi.canvas.height * 0.08);

        ctx.fillStyle = '#ffff00';
        ctx.font = '28px Arial';
        ctx.fillText('Очки: ' + gi.score, gi.canvas.width / 2, gi.canvas.height * 0.15);

        // 2. Рисуем сетку и самоцветы
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
                const y = this.offsetY + r * this.cellSize + this.cellSize / 2;
                
                // Задний фон ячейки
                ctx.fillStyle = '#341f97';
                ctx.fillRect(x - this.cellSize/2 + 2, y - this.cellSize/2 + 2, this.cellSize - 4, this.cellSize - 4);

                // Рисуем самоцвет
                const gemColor = this.board[r][c];
                ctx.fillStyle = gemColor;
                ctx.beginPath();
                ctx.arc(x, y, this.cellSize * 0.35, 0, Math.PI * 2);
                ctx.fill();

                // Обводка выбранного самоцвета
                if (this.selectedGem && this.selectedGem.r === r && this.selectedGem.c === c) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.stroke();
                }
            }
        }

        // 3. Кнопка возврата в меню
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '20px Arial';
        ctx.fillText('В меню', gi.canvas.width / 2, gi.canvas.height - 60);

        // Подключаем управление (обработка тапов), если еще не подключено
        if (!this.inputSetup) {
            window.addEventListener('pointerdown', (e) => this.handleTap(e));
            this.inputSetup = true;
        }
    }

    // Создание случайного поля без готовых комбинаций в ряд
    generateBoard() {
        for (let r = 0; r < this.gridSize; r++) {
            this.board[r] = [];
            for (let c = 0; c < this.gridSize; c++) {
                let randomColor;
                do {
                    randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                } while (
                    (c >= 2 && this.board[r][c - 1] === randomColor && this.board[r][c - 2] === randomColor) ||
                    (r >= 2 && this.board[r - 1][c] === randomColor && this.board[r - 2][c] === randomColor)
                );
                this.board[r][c] = randomColor;
            }
        }
    }

    // Обработка нажатий игрока на экране телефона
    handleTap(e) {
        const gi = window.gameInstance;
        if (gi.scene !== 'game') return;

        const x = e.clientX;
        const y = e.clientY;

        // Проверяем нажатие кнопки "В меню"
        if (y > gi.canvas.height - 90 && y < gi.canvas.height - 30) {
            gi.scene = 'menu';
            this.selectedGem = null;
            return;
        }

        // Вычисляем, в какую ячейку поля нажал игрок
        const c = Math.floor((x - this.offsetX) / this.cellSize);
        const r = Math.floor((y - this.offsetY) / this.cellSize);

        // Если клик мимо поля — сбрасываем выбор
        if (c < 0 || c >= this.gridSize || r < 0 || r >= this.gridSize) return;

        if (!this.selectedGem) {
            // Первый клик: выбираем самоцвет
            this.selectedGem = { r, c };
        } else {
            // Второй клик: проверяем, соседняя ли это ячейка
            const dRow = Math.abs(this.selectedGem.r - r);
            const dCol = Math.abs(this.selectedGem.c - c);

            if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
                // Меняем местами самоцветы
                let temp = this.board[this.selectedGem.r][this.selectedGem.c];
                this.board[this.selectedGem.r][this.selectedGem.c] = this.board[r][c];
                this.board[r][c] = temp;

                // Проверяем, появились ли после этого три в ряд
                let matches = this.checkMatches();
                if (matches.length > 0) {
                    gi.score += matches.length * 10; // Добавляем очки за каждый уничтоженный камень
                    this.removeMatches(matches);
                } else {
                    // Если комбинации нет — возвращаем камни обратно
                    this.board[r][c] = this.board[this.selectedGem.r][this.selectedGem.c];
                    this.board[this.selectedGem.r][this.selectedGem.c] = temp;
                }
            }
            this.selectedGem = null; // Сбрасываем выделение
        }
    }

    // Поиск совпадений "Три в ряд"
    checkMatches() {
        let matchPositions = [];
        // Проверка по горизонтали
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize - 2; c++) {
                let color = this.board[r][c];
                if (color && this.board[r][c + 1] === color && this.board[r][c + 2] === color) {
                    matchPositions.push({ r, c }, { r, c: c + 1 }, { r, c: c + 2 });
                }
            }
        }
        // Проверка по вертикали
        for (let c = 0; c < this.gridSize; c++) {
            for (let r = 0; r < this.gridSize - 2; r++) {
                let color = this.board[r][c];
                if (color && this.board[r + 1][c] === color && this.board[r + 2][c] === color) {
                    matchPositions.push({ r, c }, { r: r + 1, c }, { r: r + 2, c });
                }
            }
        }
        return matchPositions;
    }

    // Удаление совпавших рядов и падение новых камней сверху
    removeMatches(matches) {
        // Заменяем удаленные камни на случайные новые
        matches.forEach(pos => {
            this.board[pos.r][pos.c] = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
        
        // Повторная проверка, если новые упавшие камни случайно собрали еще один ряд
        setTimeout(() => {
            let nextMatches = this.checkMatches();
            if (nextMatches.length > 0) {
                window.gameInstance.score += nextMatches.length * 10;
                this.removeMatches(nextMatches);
            }
        }, 300);
    }
}
