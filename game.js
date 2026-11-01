class GameplayScene {
    constructor() {
        this.gridSize = 6;
        // Настройки кристаллов: цвет и форма
        this.gemTypes = {
            '#ff4757': { shape: 'diamond', light: '#ff6b81' },   // Рубин (Ромб)
            '#2ecc71': { shape: 'square', light: '#55efc4' },    // Изумруд (Квадрат)
            '#54a0ff': { shape: 'triangle', light: '#74b9ff' },  // Сапфир (Треугольник)
            '#feca57': { shape: 'circle', light: '#ffeaa7' },    // Топаз (Сфера)
            '#9b59b6': { shape: 'diamond', light: '#a29bfe' }   // Аметист
        };
        this.colors = Object.keys(this.gemTypes);
        this.board = [];
        this.selectedGem = null;
        this.particles = [];
        this.shimmerTimer = 0;
    }

    create() {
        const gi = window.gameInstance;
        const ctx = gi.ctx;
        
        this.cellSize = Math.floor(gi.canvas.width / (this.gridSize + 1));
        this.offsetX = (gi.canvas.width - (this.cellSize * this.gridSize)) / 2;
        this.offsetY = gi.canvas.height * 0.25;

        if (this.board.length === 0) this.generateBoard();

        // Таймер мерцания граней
        this.shimmerTimer += 0.05;
        this.updateParticles();

        // 1. Интерфейс очков
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Очки: ' + gi.score, gi.canvas.width / 2, gi.canvas.height * 0.12);

        // 2. Рисуем сетку и мерцающие камни
        for (let r = 0; r < this.gridSize; r++) {
            for (let c = 0; c < this.gridSize; c++) {
                const x = this.offsetX + c * this.cellSize + this.cellSize / 2;
                const y = this.offsetY + r * this.cellSize + this.cellSize / 2;
                
                // Клетки поля
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(x - this.cellSize/2 + 2, y - this.cellSize/2 + 2, this.cellSize - 4, this.cellSize - 4);
                ctx.strokeStyle = '#312e81';
                ctx.strokeRect(x - this.cellSize/2 + 2, y - this.cellSize/2 + 2, this.cellSize - 4, this.cellSize - 4);

                const color = this.board[r][c];
                if (!color) continue;

                const gem = this.gemTypes[color];
                const sz = this.cellSize * 0.35;
                
                // Магия живого мерцания кристаллов
                const brightness = Math.sin(this.shimmerTimer + (r + c)) * 0.2 + 0.8;

                ctx.save();
                ctx.translate(x, y);
                
                // Рисуем форму камня
                ctx.fillStyle = color;
                ctx.beginPath();
                if (gem.shape === 'diamond') {
                    ctx.moveTo(0, -sz); ctx.lineTo(sz, 0); ctx.lineTo(0, sz); ctx.lineTo(-sz, 0);
                } else if (gem.shape === 'triangle') {
                    ctx.moveTo(0, -sz); ctx.lineTo(sz, sz); ctx.lineTo(-sz, sz);
                } else if (gem.shape === 'square') {
                    ctx.rect(-sz*0.8, -sz*0.8, sz*1.6, sz*1.6);
                } else {
                    ctx.arc(0, 0, sz, 0, Math.PI * 2);
                }
                ctx.closePath();
                ctx.fill();

                // Наносим грани огранки
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * brightness})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, 0); ctx.lineTo(0, -sz);
                ctx.moveTo(0, 0); ctx.lineTo(sz, 0);
                ctx.stroke();

                // Белый сияющий блик на камне
                ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * brightness})`;
                ctx.beginPath();
                ctx.arc(-sz*0.3, -sz*0.3, sz*0.2, 0, Math.PI*2);
                ctx.fill();

                ctx.restore();

                // Если камень выбран игроком
                if (this.selectedGem && this.selectedGem.r === r && this.selectedGem.c === c) {
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(x - this.cellSize/2 + 4, y - this.cellSize/2 + 4, this.cellSize - 8, this.cellSize - 8);
                }
            }
        }

        // 3. Рисуем летающие искры взрыва
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 4. Кнопка возврата в меню
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '20px Arial';
        ctx.fillText('В меню', gi.canvas.width / 2, gi.canvas.height - 60);
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
            
            if (color) {
                // Создаем искры взрыва
                for(let i=0; i<8; i++) {
                    this.particles.push({
                        x, y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        size: Math.random() * 3 + 2,
                        color: this.gemTypes[color].light,
                        life: 20
                    });
                }
            }
            this.board[pos.r][pos.c] = this.colors[Math.floor(Math.random() * this.colors.length)];
        });
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.life--;
            if (p.life <= 0) this.particles.splice(i, 1);
        }
    }
}
