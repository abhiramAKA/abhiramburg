/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ЖИВЫХ ЭФФЕКТОВ (AUDIO, HAPTIC, PARTICLES) (v0.6.0-beta.19)
   ========================================================================== */

let audioCtx = null;
let musicInterval = null; // Интервал для фонового музыкального секвенсора

// Цветовая карта магических искр под каждый элемент камня
const FX_RUNE_COLORS = {
    '🔥': { primary: '#ff4500', secondary: '#ffaa00' }, // Огонь (Пламенно-красный)
    '🛡️': { primary: '#4a90e2', secondary: '#b8d8ff' }, // Защита (Лазурно-голубой)
    '💚': { primary: '#2ecc71', secondary: '#a3e4d7' }, // Лечение (Изумрудно-зеленый)
    '⚡️': { primary: '#f1c40f', secondary: '#f9e79f' }, // Молния (Ярко-желтый)
    '💀': { primary: '#9b59b6', secondary: '#ebdef0' }  // Смерть (Магический фиолетовый)
};

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Запуск легкой, ненавязчивой фоновой музыки (Процедурный эмбиент)
function startBackgroundMusic() {
    try {
        initAudioContext();
        if (!audioCtx || musicInterval) return;

        // Базовые минорные ноты для создания атмосферы подземелья (в Гц)
        const baseNotes = [110.00, 130.81, 146.83, 164.81, 196.00]; // A2, C3, D3, E3, G3
        
        musicInterval = setInterval(() => {
            if (!audioCtx || audioCtx.state === 'suspended') return;
            
            const now = audioCtx.currentTime;
            
            // Выбираем две случайные гармонирующие ноты
            const note1 = baseNotes[Math.floor(Math.random() * baseNotes.length)];
            const note2 = baseNotes[Math.floor(Math.random() * baseNotes.length)] * 1.5; // Пятая ступень для объема
            
            // Создаем два мягких синусоидальных осциллятора
            [note1, note2].forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                
                // Делаем звук очень тихим и вкрадчивым, чтобы не утомлял
                const volume = idx === 0 ? 0.02 : 0.01;
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(volume, now + 1.5); // Плавная атака
                gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5); // Длинное затухание
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now);
                osc.stop(now + 4.6);
            });
            
        }, 4000); // Новые аккорды звучат каждые 4 секунды
    } catch (e) {
        console.warn("Фоновое аудио ожидает клика пользователя.", e);
    }
}

// Остановка фоновой музыки
function stopBackgroundMusic() {
    if (musicInterval) {
        clearInterval(musicInterval);
        musicInterval = null;
    }
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
            // Короткий тихий щелчок скольжения рун
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } else if (type === 'intro') {
            // Кристальный перезвон поля на старте
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.12);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now);
            osc.stop(now + 0.12);
        } else {
            // УНИКАЛЬНЫЕ ПРОЦЕДУРНЫЕ ЗВУКИ ПОД КАЖДЫЙ ТИП РУНЫ
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
                    // Добавляем звуковую модуляцию "треска" через случайность
                    osc.frequency.setValueAtTime(600, now + 0.05);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                    break;
                    
                case '🛡️': // Защита: Звонкий кристальный металлический отскок брони
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    break;
                    
                case '💚': // Жизнь: Волшебный мягкий восходящий лечащий перелив
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(330, now);
                    osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    break;
                    
                case '💀': // Смерть: Тягучий, зловещий низкочастотный гул
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(90, now);
                    osc.frequency.linearRampToValueAtTime(30, now + 0.3);
                    gain.gain.setValueAtTime(0.22, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    break;
                    
                default:
                    // Резервный базовый звук взрыва
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

// Генератор умных разноцветных искр (Полностью привязан к цветам рун)
function spawnRuneExplosionSparks(r, c, runeType) {
    const boardContainer = document.getElementById('match3-board-container');
    const cellEl = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
    if (!boardContainer || !cellEl) return;
    
    const startX = cellEl.offsetLeft + cellEl.offsetWidth / 2;
    const startY = cellEl.offsetTop + cellEl.offsetHeight / 2;
    
    // ИСПРАВЛЕНО: Теперь гарантированно вытаскиваются уникальные цвета под каждую руну
    const colors = FX_RUNE_COLORS[runeType] || { primary: '#ffaa00', secondary: '#ffcc00' };
    const sparkCount = 8;
    
    for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.className = 'rune-spark';
        spark.style.left = `${startX}px`;
        spark.style.top = `${startY}px`;
        
        // Применяем уникальную палитру цветов руны к искрам
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
