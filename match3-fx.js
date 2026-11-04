/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ЖИВЫХ ЭФФЕКТОВ (AUDIO, HAPTIC, PARTICLES) (v0.6.0-beta.4)
   ========================================================================== */

let audioCtx = null;

// Цветовая карта магических искр под каждый элемент камня
const FX_RUNE_COLORS = {
    '🔥': { primary: '#ff4500', secondary: '#ffaa00' }, // Огонь
    '🛡️': { primary: '#4a90e2', secondary: '#b8d8ff' }, // Защита
    '💚': { primary: '#2ecc71', secondary: '#a3e4d7' }, // Лечение
    '⚡️': { primary: '#f1c40f', secondary: '#f9e79f' }, // Молния
    '💀': { primary: '#9b59b6', secondary: '#ebdef0' }  // Смерть
};

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Воспроизведение процедурного звука без внешних медиа-файлов
function playMatch3Sound(type) {
    try {
        initAudioContext();
        if (!audioCtx) return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'swap') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'explosion') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(160, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.22);
            gain.gain.setValueAtTime(0.28, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'intro') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        }
    } catch (e) {
        console.warn("Аудио-контекст ожидает взаимодействия пользователя.", e);
    }
}

// Вызов мобильной виброотдачи
function triggerMatch3Haptic(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

// Генератор умных разноцветных искр
function spawnRuneExplosionSparks(r, c, runeType) {
    const boardContainer = document.getElementById('match3-board-container');
    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!boardContainer || !cellEl) return;
    
    const startX = cellEl.offsetLeft + cellEl.offsetWidth / 2;
    const startY = cellEl.offsetTop + cellEl.offsetHeight / 2;
    
    // Получаем палитру цветов в зависимости от эмодзи руны, либо ставим золотую по дефолту
    const colors = FX_RUNE_COLORS[runeType] || { primary: '#ffaa00', secondary: '#ffcc00' };
    const sparkCount = 8;
    
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'rune-spark';
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        
        // Передаем цвета индивидуально каждому элементу
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
