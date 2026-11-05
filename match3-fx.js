/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ЖИВЫХ ЭФФЕКТОВ ПОД 4 СТИХИИ (v0.7.0-ALPHA.1)
   ========================================================================== */

let audioCtx = null;
let isMusicPlaying = false;

const FX_RUNE_COLORS = {
    '⛰️': { primary: '#8a7350', secondary: '#cdb38c' },
    '🔥': { primary: '#ff4500', secondary: '#ffaa00' },
    '💧': { primary: '#1e90ff', secondary: '#87cefa' },
    '💨': { primary: '#00fa9a', secondary: '#e0ffff' }
};

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playAmbientNode() {
    if (!isMusicPlaying || !audioCtx || audioCtx.state === 'suspended') return;

    try {
        const now = audioCtx.currentTime;
        const baseNotes = [110.00, 130.81, 146.83, 164.81, 196.00];
        const freq1 = baseNotes[Math.floor(Math.random() * baseNotes.length)];
        const freq2 = freq1 * 1.5;
        const duration = 4 + Math.random() * 2;

        [freq1, freq2].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            const targetVolume = idx === 0 ? 0.015 : 0.008;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(targetVolume, now + 1.5);
            gain.gain.setValueAtTime(targetVolume, now + duration - 1.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + duration);

            if (idx === 0) {
                osc.onended = () => {
                    if (isMusicPlaying) playAmbientNode();
                };
            }
        });
    } catch (e) {
        console.warn("Ошибка генерации фоновой ноты:", e);
    }
}

function startBackgroundMusic() {
    initAudioContext();
    if (isMusicPlaying) return;
    isMusicPlaying = true;
    playAmbientNode();
}

function stopBackgroundMusic() {
    isMusicPlaying = false;
}

function playMatch3Sound(type) {
    try {
        initAudioContext();
        if (!audioCtx || audioCtx.state === 'suspended') return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'swap') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
            osc.start(now);
            osc.stop(now + 0.06);
        } else if (type === 'intro') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else {
            switch(type) {
                case '⛰️':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.linearRampToValueAtTime(80, now + 0.2);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    break;
                    
                case '🔥':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.22);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    break;
                    
                case '💧':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    break;
                    
                case '💨':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.linearRampToValueAtTime(800, now + 0.25);
                    gain.gain.setValueAtTime(0.12, now);
                    gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);
                    break;
                    
                default:
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(200, now);
                    gain.gain.setValueAtTime(0.1, now);
                    osc.start(now);
                    osc.stop(now + 0.1);
            }
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.warn("Аудио заблокировано политикой безопасности.", e);
    }
}

function triggerMatch3Haptic(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
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
        const distance = Math.random() * 35 + 20;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        
        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);
        
        boardContainer.appendChild(spark);
        setTimeout(() => spark.remove(), 400);
    }
}
