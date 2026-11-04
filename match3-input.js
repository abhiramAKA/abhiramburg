function handleSwipeStart(e) {
    if (combatData.playerAP <= 0 || isBoardLocked) return;
    
    isTrackingSwipe = true;
    const cell = e.currentTarget;
    swipeStartRow = parseInt(cell.dataset.row);
    swipeStartCol = parseInt(cell.dataset.col);
    
    // ИСПРАВЛЕНО: корректное извлечение координат из touch или mouse события
    const pageX = e.touches ? e.touches[0].pageX : e.pageX;
    const pageY = e.touches ? e.touches[0].pageY : e.pageY;
    
    swipeStartX = pageX;
    swipeStartY = pageY;
}

function handleSwipeMove(e) {
    if (!isTrackingSwipe || isBoardLocked || swipeStartRow === null || swipeStartCol === null) return;
    
    // ИСПРАВЛЕНО: корректное извлечение координат
    const pageX = e.touches ? e.touches[0].pageX : e.pageX;
    const pageY = e.touches ? e.touches[0].pageY : e.pageY;
    
    const deltaX = pageX - swipeStartX;
    const deltaY = pageY - swipeStartY;
    
    let targetRow = swipeStartRow;
    let targetCol = swipeStartCol;
    
    if (Math.abs(deltaX) > SWIPE_THRESHOLD || Math.abs(deltaY) > SWIPE_THRESHOLD) {
        isTrackingSwipe = false; 
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            targetCol = deltaX > 0 ? swipeStartCol + 1 : swipeStartCol - 1;
        } else {
            targetRow = deltaY > 0 ? swipeStartRow + 1 : swipeStartRow - 1;
        }
        
        if (targetRow >= 0 && targetRow < BOARD_ROWS && targetCol >= 0 && targetCol < BOARD_COLS) {
            selectedCell = null; 
            if (typeof animateAndSwapRunes === 'function') {
                animateAndSwapRunes(swipeStartRow, swipeStartCol, targetRow, targetCol);
            }
        }
        resetSwipeTracker();
    }
}
