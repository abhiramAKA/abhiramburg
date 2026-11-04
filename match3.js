// Модуль игрового поля Match-3 (5х5) с алгоритмом гравитации и каскадов
const TILE_TYPES = ['🔥', '💀', '🛡️', '🧪', '💎'];
let selectedTile = null;
let isProcessingGrid = false;

function rebuildActionArea() {
    const area = document.getElementById('combat-action-area');
    if (area) {
        area.innerHTML = `<div id="match3-board" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin: 8px auto; width: 100%; max-width: 250px; background: rgba(0,0,0,0.6); padding: 6px; border: 2px solid #4a3e31; border-radius: 4px; box-shadow: inset 0 0 15px #000; box-sizing: border-box; position: relative;"></div>`;
    }
}

function generateValidBoard() {
    do {
        combatData.board = [];
        for (let r = 0; r < 5; r++) {
            combatData.board[r] = [];
            for (let c = 0; c < 5; c++) {
                combatData.board[r][c] = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
            }
        }
    } while (checkMatches().length > 0);
}

function renderMatch3Board() {
    const boardContainer = document.getElementById('match3-board');
    if (!boardContainer) return;
    boardContainer.innerHTML = '';

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.createElement('div');
            tile.dataset.row = r;
            tile.dataset.col = c;
            tile.style.cssText = `
                aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
                font-size: 20px; background: #1c1510; border: 1px solid #3a2e22;
                cursor: pointer; border-radius: 4px; user-select: none; transition: background 0.2s, border-color 0.2s;
                position: relative;
            `;
            tile.innerText = combatData.board[r][c] || '';

            if (isProcessingGrid) {
                tile.style.cursor = 'not-allowed';
                tile.style.opacity = '0.8';
            }

            if (selectedTile && selectedTile.row === r && selectedTile.col === c) {
                tile.style.background = '#4a3e31';
                tile.style.borderColor = '#e6c280';
                tile.style.transform = 'scale(0.92)';
            }

            tile.onclick = () => {
                if (!isProcessingGrid) handleTileClick(r, c);
            };
            boardContainer.appendChild(tile);
        }
    }
}

function handleTileClick(r, c) {
    const aliveHeroes = combatData.heroes.filter(h => h.hp > 0);
    if (combatData.dragonBoss.hp <= 0 || aliveHeroes.length === 0 || isProcessingGrid) return;

    if (!selectedTile) {
        selectedTile = { row: r, col: c };
        refreshBattleUI();
    } else {
        const prevR = selectedTile.row;
        const prevC = selectedTile.col;
        const isNeighbor = (Math.abs(prevR - r) === 1 && prevC === c) || (Math.abs(prevC - c) === 1 && prevR === r);

        if (isNeighbor) {
            isProcessingGrid = true;
            
            const boardContainer = document.getElementById('match3-board');
            const tile1 = boardContainer ? boardContainer.querySelector(`[data-row="${prevR}"][data-col="${prevC}"]`) : null;
            const tile2 = boardContainer ? boardContainer.querySelector(`[data-row="${r}"][data-col="${c}"]`) : null;

            if (tile1 && tile2) {
                const dx = tile2.offsetLeft - tile1.offsetLeft;
                const dy = tile2.offsetTop - tile1.offsetTop;
                tile1.animate([{ transform: `translate(${dx}px, ${dy}px)` }], { duration: 150, easing: 'ease-out' });
                tile2.animate([{ transform: `translate(${-dx}px, ${-dy}px)` }], { duration: 150, easing: 'ease-out' });
            }

            setTimeout(() => {
                let temp = combatData.board[prevR][prevC];
                combatData.board[prevR][prevC] = combatData.board[r][c];
                combatData.board[r][c] = temp;

                let matches = checkMatches();

                if (matches.length > 0) {
                    selectedTile = null;
                    executeComboRules(matches, true);
                } else {
                    if (tile1 && tile2) {
                        const dx = tile2.offsetLeft - tile1.offsetLeft;
                        const dy = tile2.offsetTop - tile1.offsetTop;
                        tile1.animate([{ transform: `translate(${dx}px, ${dy}px)`, offset: 0 }, { transform: 'translate(0, 0)', offset: 1 }], { duration: 150 });
                        tile2.animate([{ transform: `translate(${-dx}px, ${-dy}px)`, offset: 0 }, { transform: 'translate(0, 0)', offset: 1 }], { duration: 150 });
                    }

                    setTimeout(() => {
                        combatData.board[r][c] = combatData.board[prevR][prevC];
                        combatData.board[prevR][prevC] = temp;
                        selectedTile = null;
                        isProcessingGrid = false;
                        appendToLog("💨 Руны вернулись назад — комбинация не собрана.", "system");
                        refreshBattleUI();
                    }, 150);
                }
            }, 150);
        } else {
            selectedTile = { row: r, col: c };
            refreshBattleUI();
        }
    }
}

function checkMatches() {
    let foundMatches = [];
    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
            let t1 = combatData.board[r][c];
            if (t1 && t1 === combatData.board[r][c+1] && t1 === combatData.board[r][c+2]) {
                foundMatches.push({ type: t1, coords: [[r,c], [r,c+1], [r,c+2]] });
            }
        }
    }
    for (let c = 0; c < 5; c++) {
        for (let r = 0; r < 3; r++) {
            let t1 = combatData.board[r][c];
            if (t1 && t1 === combatData.board[r+1][c] && t1 === combatData.board[r+2][c]) {
                foundMatches.push({ type: t1, coords: [[r,c], [r+1,c], [r+2,c]] });
            }
        }
    }
    return foundMatches;
}

function createExplosionParticles(row, col) {
    const boardContainer = document.getElementById('match3-board');
    if (!boardContainer) return;
    const targetTile = boardContainer.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!targetTile) return;

    const rect = targetTile.getBoundingClientRect();
    const boardRect = boardContainer.getBoundingClientRect();
    const centerX = (rect.left - boardRect.left) + rect.width / 2;
    const centerY = (rect.top - boardRect.top) + rect.height / 2;

    const particleCount = 12;
    const colors = ['#ff4d4d', '#ffb366', '#ffeb99', '#ffffff', '#e6c280'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.floor(Math.random() * 5) + 4;
        
        particle.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%; pointer-events: none; z-index: 99;
            left: ${centerX}px; top: ${centerY}px;
            box-shadow: 0 0 8px currentColor;
        `;
        
        boardContainer.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 45 + 25;
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
        ], {
            duration: 400 + Math.random() * 200,
            easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
            fill: 'forwards'
        });

        setTimeout(() => particle.remove(), 600);
    }
}

function applyBoardGravity(matches) {
    matches.forEach(match => {
        match.coords.forEach(coord => {
            const [r, c] = coord;
            createExplosionParticles(r, c);
            combatData.board[r][c] = null;
        });
    });

    let dropTracking = Array.from({length: 5}, () => Array(5).fill(0));

    for (let c = 0; c < 5; c++) {
        let emptyCount = 0;
        for (let r = 4; r >= 0; r--) {
            if (combatData.board[r][c] === null) {
                emptyCount++;
            } else {
                dropTracking[r][c] = emptyCount;
            }
        }
    }

    for (let c = 0; c < 5; c++) {
        let columnGems = [];
        for (let r = 4; r >= 0; r--) {
            if (combatData.board[r][c] !== null) {
                columnGems.push(combatData.board[r][c]);
            }
        }
        
        while (columnGems.length < 5) {
            columnGems.push(TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)]);
        }

        let index = 0;
        for (let r = 4; r >= 0; r--) {
            combatData.board[r][c] = columnGems[index];
            index++;
        }
    }

    renderMatch3Board();

    const boardContainer = document.getElementById('match3-board');
    if (!boardContainer) return;

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const dropDistance = dropTracking[r][c];
            if (dropDistance > 0) {
                const tile = boardContainer.querySelector(`[data-row="${r + dropDistance}"][data-col="${c}"]`);
                if (tile) {
                    const rowHeight = tile.offsetHeight + 4;
                    const pixelsToDrop = dropDistance * rowHeight;

                    tile.animate([
                        { transform: `translateY(${-pixelsToDrop}px)` },
                        { transform: 'translateY(0)' }
                    ], {
                        duration: 300,
                        easing: 'ease-out'
                    });
                }
            }
        }
    }
}
