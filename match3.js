/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ИГРОВОГО ПОЛЯ MATCH-3 (v0.6.0-alpha.8)
   ========================================================================== */

// Инициализация игрового поля
function initMatch3Board() {
    const boardContainer = document.getElementById('match3-board-container');
    if (!boardContainer) return;
    
    boardContainer.innerHTML = '';
    match3BoardData = [];
    
    // Генерация матрицы строго 8х8 без готовых комбинаций 3-в-ряд
    for (let r = 0; r < BOARD_ROWS; r++) {
        match3BoardData[r] = [];
        for (let c = 0; c < BOARD_COLS; c++) {
            let allowedTypes = RUNE_TYPES.filter(type => {
                if (r >= 2 && match3BoardData[r-1][c] === type && match3BoardData[r-2][c] === type) return false;
                if (c >= 2 && match3BoardData[r][c-1] === type && match3BoardData[r][c-2] === type) return false;
                return true;
            });
            let randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
            match3BoardData[r][c] = randomType;
        }
    }
    
    renderBoardDOM();
}

// Отрисовка рун в контейнер
function renderBoardDOM() {
    const boardContainer = document.getElementById('match3-board-container');
    if (!boardContainer) return;
    boardContainer.innerHTML = '';
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'rune-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.innerText = match3BoardData[r][c];
            
            cell.addEventListener('click', handleCellClick);
            boardContainer.appendChild(cell);
        }
    }
}

// Обработка клика по рунам
function handleCellClick(e) {
    if (combatData.playerAP <= 0) return;
    
    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (!selectedCell) {
        selectedCell = { row: r, col: c };
        cell.style.background = 'rgba(230, 194, 128, 0.3)';
    } else {
        const prevR = selectedCell.row;
        const prevC = selectedCell.col;
        
        const isNeighbor = (Math.abs(r - prevR) === 1 && c === prevC) || (Math.abs(c - prevC) === 1 && r === prevR);
        
        if (isNeighbor) {
            swapRunes(prevR, prevC, r, c);
        }
        
        selectedCell = null;
        renderBoardDOM();
    }
}

// Своп (обмен местами)
function swapRunes(r1, c1, r2, c2) {
    let temp = match3BoardData[r1][c1];
    match3BoardData[r1][c1] = match3BoardData[r2][c2];
    match3BoardData[r2][c2] = temp;
    
    let hasMatches = checkMatchesAndExecute();
    
    if (hasMatches) {
        if (typeof usePlayerActionPoint === 'function') {
            usePlayerActionPoint();
        }
    } else {
        // Возврат назад при пустом обмене
        temp = match3BoardData[r1][c1];
        match3BoardData[r1][c1] = match3BoardData[r2][c2];
        match3BoardData[r2][c2] = temp;
    }
}

// Расчет линий совпадений
function checkMatchesAndExecute() {
    let matchedMatrix = Array(BOARD_ROWS).fill().map(() => Array(BOARD_COLS).fill(false));
    let found = false;
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS - 2; c++) {
            let t = match3BoardData[r][c];
            if (t && match3BoardData[r][c+1] === t && match3BoardData[r][c+2] === t) {
                matchedMatrix[r][c] = matchedMatrix[r][c+1] = matchedMatrix[r][c+2] = true;
                found = true;
            }
        }
    }
    
    for (let r = 0; r < BOARD_ROWS - 2; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            let t = match3BoardData[r][c];
            if (t && match3BoardData[r+1][c] === t && match3BoardData[r+2][c] === t) {
                matchedMatrix[r][c] = matchedMatrix[r+1][c] = matchedMatrix[r+2][c] = true;
                found = true;
            }
        }
    }
    
    if (found) {
        let executionEffects = { '🔥': 0, '🛡️': 0, '💚': 0, '⚡️': 0, '💀': 0 };
        
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (matchedMatrix[r][c]) {
                    let type = match3BoardData[r][c];
                    executionEffects[type]++;
                    match3BoardData[r][c] = RUNE_TYPES[Math.floor(Math.random() * RUNE_TYPES.length)];
                }
            }
        }
        
        if (typeof applyRuneCombination === 'function') {
            applyRuneCombination(executionEffects);
        }
        
        checkMatchesAndExecute();
    }
    
    return found;
}
