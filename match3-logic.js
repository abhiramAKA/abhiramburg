/* ==========================================================================
   КХАМАЧ — ВЫЧИСЛИТЕЛЬНАЯ ЛОГИКА СОВПАДЕНИЙ И КОМБО (ВЫНЕСЕН - v4.8.8-BETA)
   ========================================================================== */

function checkMatchesAndExecute() {
    let matchedMatrix = Array(BOARD_ROWS).fill().map(() => Array(BOARD_COLS).fill(false));
    let found = false;
    let mainRuneType = null;
    let detectedAdvancedCombo = false;
    
    for (let r = 0; r < BOARD_ROWS; r++) {
        let matchLength = 1;
        for (let c = 0; c < BOARD_COLS; c++) {
            if (c < BOARD_COLS - 1 && match3BoardData[r][c] === match3BoardData[r][c+1] && match3BoardData[r][c] !== null) {
                matchLength++;
            } else {
                if (matchLength >= 3) {
                    if (matchLength >= 4) detectedAdvancedCombo = true;
                    for (let i = c - matchLength + 1; i <= c; i++) {
                        matchedMatrix[r][i] = true;
                    }
                    found = true;
                    if (!mainRuneType) mainRuneType = match3BoardData[r][c];
                }
                matchLength = 1;
            }
        }
    }
    
    for (let c = 0; c < BOARD_COLS; c++) {
        let matchLength = 1;
        for (let r = 0; r < BOARD_ROWS; r++) {
            if (r < BOARD_ROWS - 1 && match3BoardData[r][c] === match3BoardData[r+1][c] && match3BoardData[r][c] !== null) {
                matchLength++;
            } else {
                if (matchLength >= 3) {
                    if (matchLength >= 4) detectedAdvancedCombo = true;
                    for (let i = r - matchLength + 1; i <= r; i++) {
                        matchedMatrix[i][c] = true;
                    }
                    found = true;
                    if (!mainRuneType) mainRuneType = match3BoardData[r][c];
                }
                matchLength = 1;
            }
        }
    }
    
    if (found) {
        isBoardLocked = true;
        
        if (detectedAdvancedCombo && typeof playMatch3Sound === 'function') {
            playMatch3Sound('combo');
        } else if (typeof playMatch3Sound === 'function') {
            playMatch3Sound(mainRuneType);
        }
        
        if (typeof triggerMatch3Haptic === 'function') triggerMatch3Haptic(60);
        
        let executionEffects = { '🔥': 0, '🛡️': 0, '⚡': 0, '💚': 0 };
        let newRunesCoords = new Array();
        
        for (let r = 0; r < BOARD_ROWS; r++) {
            for (let c = 0; c < BOARD_COLS; c++) {
                if (matchedMatrix[r][c]) {
                    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    let type = match3BoardData[r][c];
                    if (cellEl) cellEl.classList.add('rune-explode');
                    if (typeof spawnRuneExplosionSparks === 'function') {
                        spawnRuneExplosionSparks(r, c, type);
                    }
                    let normalizedType = type === '⚡️' ? '⚡' : type;
                    executionEffects[normalizedType]++;
                    match3BoardData[r][c] = null; 
                }
            }
        }
        
        if (detectedAdvancedCombo && !localStorage.getItem('khamach_combo_tut_done')) {
            setTimeout(() => {
                const comboScreen = document.getElementById('combat-combo-tutorial-screen');
                const closeComboBtn = document.getElementById('close-combat-combo-tutorial-btn');
                if (comboScreen && closeComboBtn) {
                    comboScreen.style.display = 'flex';
                    closeComboBtn.onclick = function() {
                        localStorage.setItem('khamach_combo_tut_done', 'true');
                        comboScreen.style.display = 'none';
                        isBoardLocked = false;
                    };
                }
            }, 100);
        }
        
        setTimeout(() => {
            for (let c = 0; c < BOARD_COLS; c++) {
                let emptyRow = BOARD_ROWS - 1;
                for (let r = BOARD_ROWS - 1; r >= 0; r--) {
                    if (match3BoardData[r][c] !== null) {
                        if (r !== emptyRow) {
                            match3BoardData[emptyRow][c] = match3BoardData[r][c];
                            match3BoardData[r][c] = null;
                        }
                        emptyRow--;
                    }
                }
                for (let r = emptyRow; r >= 0; r--) {
                    match3BoardData[r][c] = RUNE_TYPES[Math.floor(Math.random() * RUNE_TYPES.length)];
                    newRunesCoords.push({ row: r, col: c });
                }
            }

            if (typeof chargeHeroSuperpowers === 'function') chargeHeroSuperpowers(executionEffects);
            if (typeof renderBoardDOM === 'function') renderBoardDOM(false, newRunesCoords);
            
            setTimeout(() => {
                let chainMatched = checkMatchesAndExecute();
                const comboScreenActive = document.getElementById('combat-combo-tutorial-screen')?.style.display === 'flex';
                if (!chainMatched && combatData.playerAP > 0 && !comboScreenActive) {
                    isBoardLocked = false;
                }
            }, 350);
        }, 220);
    }
    return found;
}
