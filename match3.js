/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ИГРОВОГО ПОЛЯ MATCH-3 (v0.6.0-beta.2)
   ========================================================================== */

let isBoardLocked = false; 

// Инициализация игрового поля
function initMatch3Board() {
    const boardContainer = document.getElementById('match3-board-container');
    if (!boardContainer) return;
    
    boardContainer.innerHTML = '';
    match3BoardData = [];
    isBoardLocked = false;
    selectedCell = null;
    
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
    
    renderBoardDOM(true); 
}

// Отрисовка рун в контейнер
function renderBoardDOM(animateFall = false, newRunesCoords = []) {
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
            
            // Логика падения
            if (animateFall) {
                cell.classList.add('rune-fall');
                cell.style.animationDelay = `${(7 - r) * 0.03 + c * 0.02}s`; // Эффект волны падения сверху вниз
            } else if (newRunesCoords.some(coord => coord.row === r && coord.col === c)) {
                cell.classList.add('rune-fall');
            }
            
            cell.addEventListener('click', handleCellClick);
            boardContainer.appendChild(cell);
        }
    }
}

// Обработка клика по рунам
function handleCellClick(e) {
    if (combatData.playerAP <= 0 || isBoardLocked) return;
    
    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (!selectedCell) {
        selectedCell = { row: r, col: c };
        cell.style.backgroundColor = 'rgba(230, 194, 128, 0.3)';
    } else {
        const prevR = selectedCell.row;
        const prevC = selectedCell.col;
        
        const isNeighbor = (Math.abs(r - prevR) === 1 && c === prevC) || (Math.abs(c - prevC) === 1 && r === prevR);
        
        if (isNeighbor) {
            animateAndSwapRunes(prevR, prevC, r, c);
        } else {
            renderBoardDOM();
            selectedCell = { row: r, col: c };
            const currentCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (currentCell) currentCell.style.backgroundColor = 'rgba(230, 194, 128, 0.3)';
            return;
        }
        
        selectedCell = null;
    }
}

// Красивый визуальный обмен с помощью CSS-сдвигов
function animateAndSwapRunes(r1, c1, r2, c2) {
    isBoardLocked = true;
    
    const cell1 = document.querySelector(`[data-row="${r1}"][data-col="${c1}"]`);
    const cell2 = document.querySelector(`[data-row="${r2}"][data-col="${c2}"]`);
    
    if (!cell1 || !cell2) {
        isBoardLocked = false;
        return;
    }
    
    // Вычисляем смещение в пикселях
    const deltaX = cell2.offsetLeft - cell1.offsetLeft;
    const deltaY = cell2.offsetTop - cell1.offsetTop;
    
    cell1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cell2.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    
    setTimeout(() => {
        // Меняем данные в массиве местами
        let temp = match3BoardData[r1][c1];
        match3BoardData[r1][c1] = match3BoardData[r2][c2];
        match3BoardData[r2][c2] = temp;
        
        let hasMatches = checkMatchesAndExecute();
        
        if (hasMatches) {
            if (typeof usePlayerActionPoint === 'function') {
                usePlayerActionPoint();
            }
        } else {
            // Своп-бэк (возврат назад, если комбинация не собралась)
            cell1.style.transform = 'translate(0, 0)';
            cell2.style.transform = 'translate(0, 0)';
            
            temp = match3BoardData[r1][c1];
            match3BoardData[r1][c1] = match3BoardData[r2][c2];
            match3BoardData[r2][c2] = temp;
            
            setTimeout(() => {
                renderBoardDOM();
                isBoardLocked = false;
            }, 250);
        }
    }, 250);
}

// Создание сочных искр при взрыве камня
function createSparksAtCell(r, c) {
    const boardContainer = document.getElementById('match3-board-container');
    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!boardContainer || !cellEl) return;
    
    // Определяем центр взорвавшейся ячейки руны
    const startX = cellEl.offsetLeft + cellEl.offsetWidth / 2;
    const startY = cellEl.offsetTop + cellEl.offsetHeight / 2;
    
    const sparkCount = 8; // По 8 искр на каждый уничтоженный камень
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'rune-spark';
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        
        // Случайное направление разлета
        const angle = (i * (360 / sparkCount) + Math.random() * 20) * (Math.PI / 180);
        const distance = Math.random() * 45 + 30;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);
        
        boardContainer.appendChild(spark);
        
        // Удаляем искру из DOM после завершения её CSS анимации
        setTimeout(() => spark.remove(), 450);
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
        isBoardLocked = true;
        let executionEffects = { '🔥': 0, '🛡️': 0, '💚': 0, '⚡️': 0, '💀': 0 };
        let newRunesCoords = [];
        
        // Запускаем взрывы и рождение искр
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (matchedMatrix[r][c]) {
                    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (cellEl) {
                        cellEl.classList.add('rune-explode');
                    }
                    createSparksAtCell(r, c);
                    let type = match3BoardData[r][c];
                    executionEffects[type]++;
                }
            }
        }
        
        setTimeout(() => {
            for (let r = 0; r < BOARD_ROWS; r++) {
                for (let c = 0; c < BOARD_COLS; c++) {
                    if (matchedMatrix[r][c]) {
                        match3BoardData[r][c] = RUNE_TYPES[Math.floor(Math.random() * RUNE_TYPES.length)];
                        newRunesCoords.push({ row: r, col: c });
                    }
                }
            }
            
            if (typeof applyRuneCombination === 'function') {
                applyRuneCombination(executionEffects);
            }
            
            renderBoardDOM(false, newRunesCoords);
            
            setTimeout(() => {
                let chainMatched = checkMatchesAndExecute();
                if (!chainMatched) {
                    isBoardLocked = false;
                }
            }, 400);
            
        }, 250);
    } else {
        isBoardLocked = false;
    }
    
    return found;
}
