/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ОБРАБОТКИ ВВОДА ЖЕСТОВ (СВАЙПЫ И МЫШЬ) (v0.6.0-beta.6)
   ========================================================================== */

let swipeStartX = 0;
let swipeStartY = 0;
let swipeStartRow = null;
let swipeStartCol = null;
let isTrackingSwipe = false;
const SWIPE_THRESHOLD = 30; // Чувствительность свайпа в пикселях

function setupInputListeners(cell) {
    // Мобильные жесты
    cell.addEventListener('touchstart', handleSwipeStart, { passive: true });
    cell.addEventListener('touchmove', handleSwipeMove, { passive: true });
    
    // Мышь на ПК
    cell.addEventListener('mousedown', handleSwipeStart);
    cell.addEventListener('mousemove', handleSwipeMove);
}

function handleSwipeStart(e) {
    if (combatData.playerAP <= 0 || isBoardLocked) return;
    
    isTrackingSwipe = true;
    const cell = e.currentTarget;
    swipeStartRow = parseInt(cell.dataset.row);
    swipeStartCol = parseInt(cell.dataset.col);
    
    const pageX = e.touches ? e.touches[pageX] : e.pageX;
    const pageY = e.touches ? e.touches[pageY] : e.pageY;
    
    swipeStartX = pageX;
    swipeStartY = pageY;
}

function handleSwipeMove(e) {
    if (!isTrackingSwipe || isBoardLocked || swipeStartRow === null || swipeStartCol === null) return;
    
    const pageX = e.touches ? e.touches[pageX] : e.pageX;
    const pageY = e.touches ? e.touches[pageY] : e.pageY;
    
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
            selectedCell = null; // Сбрасываем старый клик
            if (typeof animateAndSwapRunes === 'function') {
                animateAndSwapRunes(swipeStartRow, swipeStartCol, targetRow, targetCol);
            }
        }
        resetSwipeTracker();
    }
}

function resetSwipeTracker() {
    isTrackingSwipe = false;
    swipeStartRow = null;
    swipeStartCol = null;
}

// Глобальные слушатели отпускания пальца/мыши для безопасности
window.addEventListener('mouseup', resetSwipeTracker);
window.addEventListener('touchend', resetSwipeTracker);
