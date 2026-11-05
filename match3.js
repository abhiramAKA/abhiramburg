/* ==========================================================================
   КХАМАЧ — ЯДРО С СИСТЕМОЙ ПРЕПЯТСТВИЙ И 4 СТИХИЯМИ (v0.7.0-ALPHA.1)
   ========================================================================== */

let isBoardLocked = false;

function initMatch3Board() {
    if (typeof initAudioContext === 'function') initAudioContext();
    const boardContainer = document.getElementById('match3-board-container');
    if (!boardContainer) return;
    
    boardContainer.innerHTML = '';
    match3BoardData = [];
    isBoardLocked = false;
    selectedCell = null;
    if (typeof resetSwipeTracker === 'function') resetSwipeTracker();
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        match3BoardData[r] = [];
        for (let c = 0; c < BOARD_COLS; c++) {
            match3BoardData[r][c] = null;
        }
    }

    let targetObstacles = Math.min(15, (combatData.currentLevel - 1) * 3);
    let placedObstacles = 0;
    
    while (placedObstacles < targetObstacles) {
        let randR = Math.floor(Math.random() * BOARD_ROWS);
        let randC = Math.floor(Math.random() * BOARD_COLS);
        
        if (match3BoardData[randR][randC] === null) {
            match3BoardData[randR][randC] = '🧱';
            placedObstacles++;
        }
    }

    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            if (match3BoardData[r][c] === '🧱') continue;
            
            let allowedTypes = RUNE_TYPES.filter(type => {
                if (r >= 2 && match3BoardData[r-1][c] === type && match3BoardData[r-2][c] === type) return false;
                if (c >= 2 && match3BoardData[r][c-1] === type && match3BoardData[r][c-2] === type) return false;
                return true;
            });
            
            let randomType = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
            match3BoardData[r][c] = randomType;
        }
    }
    renderBoardDOM(true, []);
}

function renderBoardDOM(isIntro = false, newRunesCoords = []) {
    const boardContainer = document.getElementById('match3-board-container');
    if (!boardContainer) return;
    boardContainer.innerHTML = '';
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'rune-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            let val = match3BoardData[r][c];
            cell.innerText = val;
            
            if (val === '🧱') {
                cell.style.background = 'radial-gradient(circle, #2d2d2d 0%, #151515 100%)';
                cell.style.border = '1px solid #444';
                cell.style.cursor = 'not-allowed';
                cell.style.boxShadow = 'none';
            } else {
                if (isIntro) {
                    cell.classList.add('rune-appear');
                    const delay = Math.abs(3.5 - r) * 0.02 + Math.abs(3.5 - c) * 0.02;
                    cell.style.animationDelay = `${delay}s`;
                } else if (newRunesCoords && newRunesCoords.some(coord => coord.row === r && coord.col === c)) {
                    cell.classList.add('rune-fall');
                }
                
                cell.addEventListener('click', handleCellClick);
                if (typeof setupInputListeners === 'function') {
                    setupInputListeners(cell);
                }
            }
            
            boardContainer.appendChild(cell);
        }
    }
}

function handleCellClick(e) {
    if (typeof initAudioContext === 'function') initAudioContext();
    if (combatData.playerAP <= 0 || isBoardLocked) return;
    
    const cell = e.currentTarget;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    
    if (match3BoardData[r][c] === '🧱') return;
    
    if (!selectedCell) {
        selectedCell = { row: r, col: c };
        cell.style.backgroundColor = 'rgba(230, 194, 128, 0.25)';
    } else {
        const prevR = selectedCell.row;
        const prevC = selectedCell.col;
        const isNeighbor = (Math.abs(r - prevR) === 1 && c === prevC) || (Math.abs(c - prevC) === 1 && r === prevR);
        
        if (isNeighbor && match3BoardData[prevR][prevC] !== '🧱') {
            animateAndSwapRunes(prevR, prevC, r, c);
        } else {
            renderBoardDOM();
            selectedCell = { row: r, col: c };
            const currentCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (currentCell) currentCell.style.backgroundColor = 'rgba(230, 194, 128, 0.25)';
            return;
        }
        selectedCell = null;
    }
}

function animateAndSwapRunes(r1, c1, r2, c2) {
    isBoardLocked = true;
    if (typeof playMatch3Sound === 'function') playMatch3Sound('swap');
    
    const cell1 = document.querySelector(`[data-row="${r1}"][data-col="${c1}"]`);
    const cell2 = document.querySelector(`[data-row="${r2}"][data-col="${c2}"]`);
    if (!cell1 || !cell2) { isBoardLocked = false; return; }
    
    const deltaX = cell2.offsetLeft - cell1.offsetLeft;
    const deltaY = cell2.offsetTop - cell1.offsetTop;
    cell1.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    cell2.style.transform = `translate(${-deltaX}px, ${-deltaY}px)`;
    
    setTimeout(() => {
        let temp = match3BoardData[r1][c1];
        match3BoardData[r1][c1] = match3BoardData[r2][c2];
        match3BoardData[r2][c2] = temp;
        
        let hasMatches = checkMatchesAndExecute();
        if (hasMatches) {
            if (typeof usePlayerActionPoint === 'function') usePlayerActionPoint();
        } else {
            cell1.style.transform = 'translate(0, 0)';
            cell2.style.transform = 'translate(0, 0)';
            temp = match3BoardData[r1][c1];
            match3BoardData[r1][c1] = match3BoardData[r2][c2];
            match3BoardData[r2][c2] = temp;
            setTimeout(() => { renderBoardDOM(); isBoardLocked = false; }, 180);
        }
    }, 180);
}

function checkMatchesAndExecute() {
    let matchedMatrix = Array(BOARD_ROWS).fill().map(() => Array(BOARD_COLS).fill(false));
    let found = false;
    let mainRuneType = null;
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS - 2; c++) {
            let t = match3BoardData[r][c];
            if (t && t !== '🧱' && match3BoardData[r][c+1] === t && match3BoardData[r][c+2] === t) {
                matchedMatrix[r][c] = matchedMatrix[r][c+1] = matchedMatrix[r][c+2] = true;
                found = true;
                if (!mainRuneType) mainRuneType = t;
            }
        }
    }
    for (let r = 0; r < BOARD_ROWS - 2; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            let t = match3BoardData[r][c];
            if (t && t !== '🧱' && match3BoardData[r+1][c] === t && match3BoardData[r+2][c] === t) {
                matchedMatrix[r][c] = matchedMatrix[r+1][c] = matchedMatrix[r+2][c] = true;
                found = true;
                if (!mainRuneType) mainRuneType = t;
            }
        }
    }
    
    if (found) {
        isBoardLocked = true;
        if (typeof playMatch3Sound === 'function') playMatch3Sound(mainRuneType);
        if (typeof triggerMatch3Haptic === 'function') triggerMatch3Haptic(40);
        
        let executionEffects = { '⛰️': 0, '🔥': 0, '💧': 0, '💨': 0 };
        let newRunesCoords = [];
        
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (matchedMatrix[r][c]) {
                    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    let type = match3BoardData[r][c];
                    if (cellEl) cellEl.classList.add('rune-explode');
                    if (typeof spawnRuneExplosionSparks === 'function') {
                        spawnRuneExplosionSparks(r, c, type);
                    }
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
            if (typeof applyRuneCombination === 'function') applyRuneCombination(executionEffects);
            renderBoardDOM(false, newRunesCoords);
            setTimeout(() => {
                let chainMatched = checkMatchesAndExecute();
                if (!chainMatched) isBoardLocked = false;
            }, 250);
        }, 180);
    } else {
        isBoardLocked = false;
    }
    return found;
}
