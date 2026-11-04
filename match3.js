// Модуль игрового поля Match-3 (5х5)
const TILE_TYPES = ['🔥', '💀', '🛡️', '🧪', '💎'];
let selectedTile = null;

// Перестраиваем интерфейс под компактную мобильную сетку
function rebuildActionArea() {
    const btn = document.getElementById('step-combat-btn');
    if (btn) {
        btn.outerHTML = `<div id="match3-board" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 4px; margin: 8px auto; width: 100%; max-width: 250px; background: rgba(0,0,0,0.6); padding: 6px; border: 2px solid #4a3e31; border-radius: 4px; box-shadow: inset 0 0 15px #000; box-sizing: border-box;"></div>`;
    }
}

// Генерация стартового поля без изначальных готовых линий
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

// Отрисовка сетки поля в HTML (с уменьшенным размером фишек)
function renderMatch3Board() {
    const boardContainer = document.getElementById('match3-board');
    if (!boardContainer) return;
    boardContainer.innerHTML = '';

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.createElement('div');
            tile.style.cssText = `
                aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
                font-size: 20px; background: #1c1510; border: 1px solid #3a2e22;
                cursor: pointer; border-radius: 4px; user-select: none; transition: all 0.2s;
            `;
            tile.innerText = combatData.board[r][c];

            if (selectedTile && selectedTile.row === r && selectedTile.col === c) {
                tile.style.background = '#4a3e31';
                tile.style.borderColor = '#e6c280';
                tile.style.transform = 'scale(0.92)';
            }

            tile.onclick = () => handleTileClick(r, c);
            boardContainer.appendChild(tile);
        }
    }
}

// Обработка нажатий на фишки и их обмен местами
function handleTileClick(r, c) {
    const aliveHeroes = combatData.heroes.filter(h => h.hp > 0);
    if (combatData.dragonBoss.hp <= 0 || aliveHeroes.length === 0) return;

    if (!selectedTile) {
        selectedTile = { row: r, col: c };
        refreshBattleUI();
    } else {
        const prevR = selectedTile.row;
        const prevC = selectedTile.col;
        const isNeighbor = (Math.abs(prevR - r) === 1 && prevC === c) || (Math.abs(prevC - c) === 1 && prevR === r);

        if (isNeighbor) {
            let temp = combatData.board[prevR][prevC];
            combatData.board[prevR][prevC] = combatData.board[r][c];
            combatData.board[r][c] = temp;

            let matches = checkMatches();

            if (matches.length > 0) {
                selectedTile = null;
                executeComboRules(matches); // Передаем собранные комбинации в боевое ядро
            } else {
                combatData.board[r][c] = combatData.board[prevR][prevC];
                combatData.board[prevR][prevC] = temp;
                selectedTile = null;
                appendToLog("💨 Руны вернулись назад — комбинация не собрана.", "system");
                refreshBattleUI();
            }
        } else {
            selectedTile = { row: r, col: c };
            refreshBattleUI();
        }
    }
}

// Поиск горизонтальных и вертикальных линий 3-в-ряд
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
