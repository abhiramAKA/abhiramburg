/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ЖИВЫХ ЭФФЕКТОВ (AUDIO, HAPTIC, PARTICLES) (v0.6.0-beta.22)
   ========================================================================== */

let audioCtx = null;
let isMusicPlaying = false; // Флаг контроля работы фонового эмбиента

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
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Рекурсивный генератор бесконечной эмбиент-музыки (Защищен от блокировок браузера)
function playAmbientNode() {
    if (!isMusicPlaying || !audioCtx || audioCtx.state === 'suspended') return;

    try {
        const now = audioCtx.currentTime;
        // Мягкие, глубокие минорные ноты подземелья (A2, C3, D3, E3, G3)
        const baseNotes = [110.00, 130.81, 146.83, 164.81, 196.00];
        const freq1 = baseNotes[Math.floor(Math.random() * baseNotes.length)];
        const freq2 = freq1 * 1.5; // Идеальная квинта для объема

        // Продолжительность звучания одной музыкальной фразы (от 4 до 6 секунд)
        const duration = 4 + Math.random() * 2;

        [freq1, freq2].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // Настройка ультра-низкой громкости, чтобы эмбиент не мешал звукам взрывов
            const targetVolume = idx === 0 ? 0.015 : 0.008;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(targetVolume, now + 1.5); // Плавное проявление ноты
            gain.gain.setValueAtTime(targetVolume, now + duration - 1.5);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Мягкое затухание
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + duration);

            // Навешиваем событие цепочки только на первый осциллятор
            if (idx === 0) {
                osc.onended = () => {
                    // Перезапускаем следующую случайную ноту сразу по окончании этой
                    if (isMusicPlaying) playAmbientNode();
                };
            }
        });
    } catch (e) {
        console.warn("Ошибка генерации фоновой ноты:", e);
    }
}

// Включение фоновой музыки в момент клика по кнопке
function startBackgroundMusic() {
    initAudioContext();
    if (isMusicPlaying) return;
    
    isMusicPlaying = true;
    // Запускаем первую волну музыки мгновенно в контексте клика
    playAmbientNode();
}

// Мгновенное глушение фоновой музыки при выходе в меню
function stopBackgroundMusic() {
    isMusicPlaying = false;
}

// Воспроизведение звуков перемещения или уникальных взрывов под каждую руну
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
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'intro') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.12);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else {
            switch(type) {
                case '🔥': // Огонь: Низкий плотный взрывной хлопок
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(140, now);
                    osc.frequency.linearRampToValueAtTime(40, now + 0.25);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    break;
                    
                case '⚡️': // Молния: Высокочастотный резкий разряд электричества
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.18);
                    osc.frequency.setValueAtTime(600, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                    break;
                    
                case '🛡️': // Защита: Звонкий кристальный металлический отскок
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    break;
                    
                case '💚': // Жизнь: Волшебный мягкий восходящий перелив
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(330, now);
                    osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    break;
                    
                case '💀': // Смерть: Тягучий зловещий низкий гул
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(90, now);
                    osc.frequency.linearRampToValueAtTime(30, now + 0.3);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    break;
                    
                default:
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.2);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            }
            osc.start(now);
            osc.stop(now + 0.3);
        }
    } catch (e) {
        console.warn("Аудио-эффект заблокирован политикой браузера.", e);
    }
}

// Вызов мобильной виброотдачи
function triggerMatch3Haptic(ms) {
    if (navigator.vibrate) {
        navigator.vibrate(ms);
    }
}

// Generator iskr
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
