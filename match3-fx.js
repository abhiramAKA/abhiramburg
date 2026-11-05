/* ==========================================================================
   КХАМАЧ — АУДИО-ДВИЖОК С ПАНЕЛЬЮ УПРАВЛЕНИЯ ГРОМКОСТЬЮ (v0.6.0-beta.36)
   ========================================================================== */

let audioCtx = null;
let currentMusicState = null;
let nextNodeTimeout = null;
let delayNode = null;
let delayGain = null;

let gameVolumeMusic = 0.5;
let gameVolumeFX = 0.6;
let gameIsMuted = false;

function initAudioContext() {
    try {
        if (!audioCtx || audioCtx.state === 'closed') {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            delayNode = audioCtx.createDelay(1.0);
            delayGain = audioCtx.createGain();
            delayNode.delayTime.setValueAtTime(0.6, audioCtx.currentTime);
            delayGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
            delayNode.connect(delayGain);
            delayGain.connect(delayNode);
            delayGain.connect(audioCtx.destination);

            const unlock = () => {
                if (audioCtx && audioCtx.state !== 'closed') {
                    audioCtx.resume().then(() => {
                        document.removeEventListener('click', unlock);
                        document.removeEventListener('touchstart', unlock);
                        if (currentMusicState && !nextNodeTimeout) playAmbientNode();
                    }).catch(() => {});
                }
            };
            document.addEventListener('click', unlock);
            document.addEventListener('touchstart', unlock);
        }
        if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    } catch (e) { console.warn("Аудио-система недоступна:", e); }
}

function playAmbientNode() {
    if (!currentMusicState || !audioCtx || audioCtx.state === 'suspended' || audioCtx.state === 'closed') return;
    try {
        const now = audioCtx.currentTime;
        let duration = 4.0 + Math.random() * 1.5;
        
        const roots = [220.00, 261.63, 293.66, 329.63, 392.00];
        const baseRoot = roots[Math.floor(Math.random() * roots.length)];
        const chordFrequencies = [baseRoot, baseRoot * 1.1892, baseRoot * 1.4983];
        
        if (gameIsMuted || gameVolumeMusic <= 0) {
            nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, duration * 1000);
            return;
        }

        chordFrequencies.forEach((freq, index) => {
            if (!audioCtx || audioCtx.state === 'closed') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.detune.setValueAtTime((index * 4) - 6, now);
            
            const baseVol = 0.015 * gameVolumeMusic;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(baseVol, now + 1.5); 
            gain.gain.setValueAtTime(baseVol, now + duration - 1.5);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            if (delayNode) gain.connect(delayNode);
            
            osc.start(now);
            osc.stop(now + duration);
        });
        
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, (duration - 0.5) * 1000);
    } catch (e) {
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, 2000);
    }
}

function changeMusicState(state) {
    initAudioContext();
    if (currentMusicState === state) return;
    currentMusicState = state;
    if (nextNodeTimeout) { clearTimeout(nextNodeTimeout); nextNodeTimeout = null; }
    if (audioCtx && audioCtx.state !== 'suspended' && audioCtx.state !== 'closed') playAmbientNode();
}

function setGameVolume(type, val) {
    if (type === 'music') gameVolumeMusic = parseFloat(val);
    if (type === 'fx') gameVolumeFX = parseFloat(val);
}

function toggleGameMute() {
    gameIsMuted = !gameIsMuted;
    return gameIsMuted;
}

function playMatch3Sound(type) {
    if (gameIsMuted || gameVolumeFX <= 0) return;
    try {
        initAudioContext();
        if (!audioCtx || audioCtx.state === 'suspended' || audioCtx.state === 'closed') return;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Все эффекты рун идут напрямую в аудиовыход БЕЗ подключения к эхо-камере (delayNode)
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        const fxVol = gameVolumeFX;
        
        if (type === 'swap') {
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);
            gain.gain.setValueAtTime(0.05 * fxVol, now); 
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
            osc.start(now); osc.stop(now + 0.06);
        } else {
            // Новая концепция: Мягкие, нежные, "добрые" переливы для рун
            switch(type) {
                case '🔥': // Пламенный нежный всплеск
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
                    gain.gain.setValueAtTime(0.12 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    break;
                case '⚡️': // Волшебный кристальный дзинь
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
                    gain.gain.setValueAtTime(0.08 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    break;
                case '🛡️': // Мягкий бархатный отскок брони
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(250, now);
                    osc.frequency.exponentialRampToValueAtTime(350, now + 0.18);
                    gain.gain.setValueAtTime(0.14 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                    break;
                case '💚': // Восходящий ангельский перелив исцеления
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(700, now + 0.22);
                    gain.gain.setValueAtTime(0.1 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                    break;
                case '💀': // Глубокий, но мягкий медитативный гонг
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
                    gain.gain.setValueAtTime(0.12 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    break;
                default: // Спокойный базовый всплеск
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
                    gain.gain.setValueAtTime(0.08 * fxVol, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            }
            osc.start(now); osc.stop(now + 0.3);
        }
    } catch (e) {}
}
