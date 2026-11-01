class GameplayScene {
    constructor() {
        this.gridSize = 6;
        // Базовые цвета для создания объемных глянцевых 3D-градиентов
        this.baseColors = {
            '#ff4757': { dark: '#c0392b', light: '#ff6b81' }, // Рубин
            '#2ecc71': { dark: '#27ae60', light: '#55efc4' }, // Изумруд
            '#54a0ff': { dark: '#2980b9', light: '#74b9ff' }, // Сапфир
            '#feca57': { dark: '#f39c12', light: '#ffeaa7' }, // Топаз
            '#9b59b6': { dark: '#8e44ad', light: '#a29bfe' }  // Аметист
        };
        this.colors = Object.keys(this.baseColors);
        this.board = [];
        this.selectedGem = null;
        this.particles = []; // Кластер спецэффектов (взрывы частиц)
    }

    create() {
        const gi = window.gameInstance;
        const ctx = gi.ctx;
        
        this.cellSize = Math.floor(gi.canvas.width / (this.gridSize + 1));
        this.offsetX = (gi.canvas.width - (this.cellSize * this.gridSize)) / 2;
        this.offsetY = gi.canvas.height * 0.25;

        if (this.board.length === 0) this.generateBoard();

        // --- ОБНОВЛЕНИЕ ЛОГИКИ ЭФФЕКТОВ ---
        this.updateParticles();

        // --- РЕНДЕР ГРАФИКИ ---
        // 1. Неоновый футуристичный фон интерфейса
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 10; // Эффект свечения
        ctx.fillText('САМОЦВЕТЫ 3D', gi.canvas.width / 2, gi.canvas.height * 0.08);

        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.fillText('Очки: ' + gi.score, gi.canvas.width / 2, gi.canvas.height * 0.15);
        ctx.shadowBlur = 0; // Сбрасываем свечение для остальных элементов

        // 2. Игровое поле и 3D-сферы
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
                const y = this.offsetY + r * this.cellSize + this.cellSize / 2;
                
                // Стильная 3D плитка фона
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(x - this.cellSize/2 + 3, y - this.cellSize/2 + 3, this.cellSize - 6, this.cellSize - 6);
                ctx.strokeStyle = '#4338ca';
                ctx.lineWidth = 1;
                ctx.strokeRect(x - this.cellSize/2 + 3, y - this.cellSize/2 + 3, this.cellSize - 6, this.cellSize - 6);

                const gemColor = this.board[r][c];
                if (!gemColor) continue;

                // Создаем объемную 3D-сферу с помощью радиального градиента
                const radius = this.cellSize * 0.36;
                const colorData = this.baseColors[gemColor] || { dark: '#000', light: '#fff' };
                
                // Смещение центра блика вверх-влево дает иллюзию объема и 3D света
                const gradient = ctx.createRadialGradient(
                    x - radius * 0.3, y - radius * 0.3, radius * 0.1, 
                    x, y, radius
                );
                gradient.addColorStop(0, colorData.light);
                gradient.addColorStop(0.5, gemColor);
                gradient.addColorStop(1, colorData.dark);

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();

                // Эффектная пульсирующая рамка вокруг выбранного самоцвета
                if (this.selectedGem && this.selectedGem.r === r && this.selectedGem.c === c) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.shadowColor = '#ffffff';
                    ctx.shadowBlur = 15;
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // 3. Отрисовка спецэффектов (взрывы частиц)
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // 4. Кнопка "В меню"
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText('В меню', gi.canvas.width / 2, gi.canvas.height - 60);

        if (!this.inputSetup) {
            window.addEventListener('pointerdown', (e) => this.handleTap(e));
            this.inputSetup = true;
        }
    }

    // Создание взрыва частиц в точке уничтожения камня
    spawnExplosion(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                size: Math.random() * 4 + 2,
                color: color,
                alpha: 1,
                life: 25 // Время жизни частиц в кадрах
            });
        }
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

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

    handleTap(e) {
        const gi = window.gameInstance;
        if (gi.scene !== 'game') return;

        const x = e.clientX;
        const y = e.clientY;

        if (y > gi.canvas.height - 90 && y < gi.canvas.height - 30) {
            gi.scene = 'menu';
            this.selectedGem = null;
            return;
        }

        const c = Math.floor((x - this.offsetX) / this.cellSize);
        const r = Math.floor((y - this.offsetY) / this.cellSize);

        if (c < 0 || c >= this.gridSize || r < 0 || r >= this.gridSize) return;

        if (!this.selectedGem) {
            this.selectedGem = { r, c };
        } else {
            const dRow = Math.abs(this.selectedGem.r - r);
            const dCol = Math.abs(this.selectedGem.c - c);

            if ((dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1)) {
                let temp = this.board[this.selectedGem.r][this.selectedGem.c];
                this.board[this.selectedGem.r][this.selectedGem.c] = this.board[r][c];
                this.board[r][c] = temp;

                let matches = this.checkMatches();
                if (matches.length > 0) {
                    gi.score += matches.length * 10;
                    this.removeMatches(matches);
                } else {
                    this.board[r][c] = this.board[this.selectedGem.r][this.selectedGem.c];
                    this.board[this.selectedGem.r][this.selectedGem.c] = temp;
                }
            }
            this.selectedGem = null;
        }
    }

    checkMatches() {
        let matchPositions = [];
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize - 2; c++) {
                let color = this.board[r][c];
                if (color && this.board[r][c + 1] === color && this.board[r][c + 2] === color) {
                    matchPositions.push({ r, c }, { r, c: c + 1 }, { r, c: c + 2 });
                }
            }
        }
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

    removeMatches(matches) {
        matches.forEach(pos => {
            const x = this.offsetX + pos.c * this.cellSize + this.cellSize / 2;
            const y = this.offsetY + pos.r * this.cellSize + this.cellSize / 2;
            const color = this.board[pos.r][pos.c];
            
            // Запускаем взрыв в координатах удаляемого камня!
            if (color) this.spawnExplosion(x, y, color);
            
            this.board[pos.r][pos.c] = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
        
        setTimeout(() => {
            let nextMatches = this.checkMatches();
            if (nextMatches.length > 0) {
                window.gameInstance.score += nextMatches.length * 10;
                this.removeMatches(nextMatches);
            }
        }, 200);
    }
}
