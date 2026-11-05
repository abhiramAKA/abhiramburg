/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ЖИВЫХ ЭФФЕКТОВ (ИСКЛЮЧИТЕЛЬНО ЗВУК) (v0.6.0-beta.25)
   ========================================================================== */

let audioCtx = null;
let currentMusicState = null;
let nextNodeTimeout = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const unlock = () => {
            if (audioCtx) {
                audioCtx.resume().then(() => {
                    document.removeEventListener('click', unlock);
                    document.removeEventListener('touchstart', unlock);
                    if (currentMusicState && !nextNodeTimeout) playAmbientNode();
                });
            }
        };
        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function playAmbientNode() {
    if (!currentMusicState || !audioCtx || audioCtx.state === 'suspended') return;
    try {
        const now = audioCtx.currentTime;
        let duration = 3.5 + Math.random() * 1.5;
        
        if (currentMusicState === 'menu') {
            const menuNotes = [220.00, 261.63, 293.66, 329.63, 392.00];
            const freq = menuNotes[Math.floor(Math.random() * menuNotes.length)];
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.012, now + 1.2);
            gain.gain.setValueAtTime(0.012, now + duration - 1.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + duration);
        } else if (currentMusicState === 'combat') {
            duration = 2.0 + Math.random() * 1.0;
            const combatBaselines = [55.00, 65.41, 73.42, 82.41];
            const combatTension = [116.54, 138.59, 155.56, 174.61];
            const baseFreq = combatBaselines[Math.floor(Math.random() * combatBaselines.length)];
            const tensionFreq = combatTension[Math.floor(Math.random() * combatTension.length)];
            
            const oscBase = audioCtx.createOscillator();
            const gainBase = audioCtx.createGain();
            oscBase.type = 'triangle';
            oscBase.frequency.setValueAtTime(baseFreq, now);
            gainBase.gain.setValueAtTime(0, now);
            gainBase.gain.linearRampToValueAtTime(0.025, now + 0.4);
            gainBase.gain.setValueAtTime(0.025, now + duration - 0.4);
            gainBase.gain.exponentialRampToValueAtTime(0.001, now + duration);
            oscBase.connect(gainBase);
            gainBase.connect(audioCtx.destination);
            oscBase.start(now);
            oscBase.stop(now + duration);
            
            const oscTension = audioCtx.createOscillator();
            const gainTension = audioCtx.createGain();
            oscTension.type = 'sawtooth';
            oscTension.frequency.setValueAtTime(tensionFreq, now);
            oscTension.frequency.linearRampToValueAtTime(tensionFreq + 4, now + duration);
            gainTension.gain.setValueAtTime(0, now);
            gainTension.gain.linearRampToValueAtTime(0.008, now + 0.6);
            gainTension.gain.setValueAtTime(0.008, now + duration - 0.6);
            gainTension.gain.exponentialRampToValueAtTime(0.001, now + duration);
            oscTension.connect(gainTension);
            gainTension.connect(audioCtx.destination);
            oscTension.start(now);
            oscTension.stop(now + duration);
        }
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, (duration - 0.3) * 1000);
    } catch (e) { console.warn("Ошибка генерации фоновой ноты:", e); }
}

function changeMusicState(state) {
    initAudioContext();
    if (currentMusicState === state) return;
    currentMusicState = state;
    if (nextNodeTimeout) { clearTimeout(nextNodeTimeout); nextNodeTimeout = null; }
    if (audioCtx && audioCtx.state !== 'suspended') playAmbientNode();
}

function stopBackgroundMusic() {
    currentMusicState = null;
    if (nextNodeTimeout) { clearTimeout(nextNodeTimeout); nextNodeTimeout = null; }
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
            osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now); osc.stop(now + 0.08);
        } else if (type === 'intro') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(850, now + 0.12);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            osc.start(now); osc.stop(now + 0.12);
        } else {
            switch(type) {
                case '🔥':
                    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(140, now);
                    osc.frequency.linearRampToValueAtTime(40, now + 0.25);
                    gain.gain.setValueAtTime(0.25, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    break;
                case '⚡️':
                    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.18);
                    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                    break;
                case '🛡️':
                    osc.type = 'sine'; osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                    gain.gain.setValueAtTime(0.18, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    break;
                case '💚':
                    osc.type = 'triangle'; osc.frequency.setValueAtTime(330, now);
                    osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);
                    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                    break;
                case '💀':
                    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(90, now);
                    osc.frequency.linearRampToValueAtTime(30, now + 0.3);
                    gain.gain.setValueAtTime(0.22, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                    break;
                default:
                    osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(50, now + 0.2);
                    gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            }
            osc.start(now); osc.stop(now + 0.3);
        }
    } catch (e) { console.warn("Аудио-эффект заблокирован.", e); }
}
