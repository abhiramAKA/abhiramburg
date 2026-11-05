/* ==========================================================================
   КХАМАЧ — КИНЕМАТОГРАФИЧЕСКИЙ ПРОЦЕДУРНЫЙ АУДИО-ДВИЖОК (v0.6.0-beta.31)
   ========================================================================== */

let audioCtx = null;
let currentMusicState = null;
let nextNodeTimeout = null;
let combatHeartbeatInterval = null;

let delayNode = null;
let delayGain = null;

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
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
    } catch (e) {
        console.warn("Не удалось инициализировать аудио-систему устройства:", e);
    }
}

function playAmbientNode() {
    if (!currentMusicState || !audioCtx || audioCtx.state === 'suspended' || audioCtx.state === 'closed') return;
    try {
        const now = audioCtx.currentTime;
        let duration = 4.0 + Math.random() * 1.5;
        
        const roots = currentMusicState === 'menu' ? [220.0, 261.63, 293.66, 329.63, 392.0] : [110.0, 130.81, 146.83, 164.81];
        const baseRoot = roots[Math.floor(Math.random() * roots.length)];
        const chordFrequencies = [baseRoot, baseRoot * 1.1892, baseRoot * 1.4983];
        
        chordFrequencies.forEach((freq, index) => {
            if (!audioCtx || audioCtx.state === 'closed') return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = currentMusicState === 'menu' ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            osc.detune.setValueAtTime((index * 4) - 6, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.008, now + 1.5); 
            gain.gain.setValueAtTime(0.008, now + duration - 1.5);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            if (delayNode) gain.connect(delayNode);
            
            osc.start(now);
            osc.stop(now + duration);
        });
        
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, (duration - 0.5) * 1000);
    } catch (e) { 
        console.warn("Сбой генерации музыкального аккорда:", e);
        // При сбое пробуем перезапуститься через 2 секунды
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, 2000);
    }
}

function startCombatHeartbeat() {
    if (combatHeartbeatInterval) clearInterval(combatHeartbeatInterval);
    
    combatHeartbeatInterval = setInterval(() => {
        if (!audioCtx || currentMusicState !== 'combat' || audioCtx.state === 'suspended' || audioCtx.state === 'closed') return;
        try {
            const now = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(65.41, now); 
            osc.frequency.exponentialRampToValueAtTime(30.00, now + 0.15); 
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 0.25);
        } catch(e) {}
    }, 800);
}

function changeMusicState(state) {
    initAudioContext();
    if (currentMusicState === state) return;
    currentMusicState = state;
    
    if (nextNodeTimeout) { clearTimeout(nextNodeTimeout); nextNodeTimeout = null; }
    if (combatHeartbeatInterval) { clearInterval(combatHeartbeatInterval); combatHeartbeatInterval = null; }
    
    if (audioCtx && audioCtx.state !== 'suspended' && audioCtx.state !== 'closed') {
        playAmbientNode();
        if (state === 'combat') startCombatHeartbeat();
    }
}

function stopBackgroundMusic() {
    currentMusicState = null;
    if (nextNodeTimeout) { clearTimeout(nextNodeTimeout); nextNodeTimeout = null; }
    if (combatHeartbeatInterval) { clearInterval(combatHeartbeatInterval); combatHeartbeatInterval = null; }
}

function playMatch3Sound(type) {
    try {
        initAudioContext();
        if (!audioCtx || audioCtx.state === 'suspended' || audioCtx.state === 'closed') return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (delayNode && type !== 'swap') gain.connect(delayNode); 
        const now = audioCtx.currentTime;
        
        if (type === 'swap') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(280, now);
            osc.frequency.exponentialRampToValueAtTime(550, now + 0.08);
            gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
            osc.start(now); osc.stop(now + 0.08);
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
    } catch (e) { console.warn("Аудио-эффект заблокирован устройством:", e); }
}
