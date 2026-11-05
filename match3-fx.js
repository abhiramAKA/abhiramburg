/* ==========================================================================
   КХАМАЧ — АУДИО-ДВИЖОК С ПАНЕЛЬЮ УПРАВЛЕНИЯ ГРОМКОСТЬЮ (v0.6.0-beta.41)
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
            delayGain.gain.setValueAtTime(0.38, audioCtx.currentTime); 
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
        let duration = 2.5 + Math.random() * 1.2;
        
        const fluteNotes = new Array(440.00, 523.25, 587.33, 659.25, 783.99, 880.00);
        const freq = fluteNotes[Math.floor(Math.random() * fluteNotes.length)];
        
        if (gameIsMuted || gameVolumeMusic <= 0) {
            nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, duration * 1000);
            return;
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        
        osc.detune.setValueAtTime(0, now);
        osc.detune.linearRampToValueAtTime(5, now + duration * 0.3);
        osc.detune.linearRampToValueAtTime(-4, now + duration * 0.7);
        osc.detune.linearRampToValueAtTime(0, now + duration);
        
        const targetVol = 0.014 * gameVolumeMusic;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(targetVol, now + 0.3); 
        gain.gain.setValueAtTime(targetVol, now + duration - 0.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        if (delayNode) gain.connect(delayNode); 
        
        osc.start(now);
        osc.stop(now + duration);
        
        nextNodeTimeout = setTimeout(() => { nextNodeTimeout = null; playAmbientNode(); }, (duration - 0.2) * 1000);
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
            switch(type) {
                case '🔥':
                    osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now);
                    osc.frequency.exponentialRampToValueAtTime(450, now + 0.15);
                    gain.gain.setValueAtTime(0.12 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                    break;
                case '⚡️':
                    osc.type = 'sine'; osc.frequency.setValueAtTime(600, now);
                    osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
                    gain.gain.setValueAtTime(0.08 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                    break;
                case '🛡️':
                    osc.type = 'triangle'; osc.frequency.setValueAtTime(250, now);
                    osc.frequency.exponentialRampToValueAtTime(350, now + 0.18);
                    gain.gain.setValueAtTime(0.14 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                    break;
                case '💚':
                    osc.type = 'sine'; osc.frequency.setValueAtTime(350, now);
                    osc.frequency.exponentialRampToValueAtTime(700, now + 0.22);
                    gain.gain.setValueAtTime(0.1 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
                    break;
                case '💀':
                    osc.type = 'sine'; osc.frequency.setValueAtTime(180, now);
                    osc.frequency.exponentialRampToValueAtTime(220, now + 0.25);
                    gain.gain.setValueAtTime(0.12 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                    break;
                default:
                    osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
                    gain.gain.setValueAtTime(0.08 * fxVol, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            }
            osc.start(now); osc.stop(now + 0.3);
        }
    } catch (e) {}
}
