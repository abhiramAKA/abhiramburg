/* ==========================================================================
   КХАМАЧ — МОДУЛЬ КЛИЕНТСКИХ ИСКР И ХАПТИКИ (ВЫНЕСЕННЫЙ БЛОК) (v0.6.0-beta.25)
   ========================================================================== */

const FX_RUNE_COLORS = {
    '🔥': { primary: '#ff4500', secondary: '#ffaa00' },
    '🛡️': { primary: '#4a90e2', secondary: '#b8d8ff' },
    '💚': { primary: '#2ecc71', secondary: '#a3e4d7' },
    '⚡️': { primary: '#f1c40f', secondary: '#f9e79f' },
    '💀': { primary: '#9b59b6', secondary: '#ebdef0' }
};

function triggerMatch3Haptic(ms) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

function spawnRuneExplosionSparks(r, c, runeType) {
    const boardContainer = document.getElementById('match3-board-container');
    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!boardContainer || !cellEl) return;
    
    const startX = cellEl.offsetLeft + cellEl.offsetWidth / 2;
    const startY = cellEl.offsetTop + cellEl.offsetHeight / 2;
    const colors = FX_RUNE_COLORS[runeType] || { primary: '#ffaa00', secondary: '#ffcc00' };
    const sparkCount = 8;
    
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'rune-spark';
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        spark.style.background = colors.secondary;
        spark.style.boxShadow = `0 0 6px ${colors.primary}, 0 0 12px ${colors.secondary}`;
        
        const angle = (i * (360 / sparkCount) + Math.random() * 20) * (Math.PI / 180);
        const distance = Math.random() * 40 + 25;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);
        
        boardContainer.appendChild(spark);
        setTimeout(() => spark.remove(), 400);
    }
}
