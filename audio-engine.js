/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ПРОЦЕДУРНЫЙ АУДИО-ДВИЖОК (v0.7.9-BETA)
   ========================================================================== */

let audioCtx = null;
let isMusicPlaying = false; 

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
    isMusicPlaying = true;
    initAudioContext();
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
                case '🔥': 
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(140, now);
                    osc.frequency.linearRampToValueAtTime(40, now + 0.25);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
                    break;
                    
                case '🎯': 
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(800, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.18);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                    break;
                    
                case '🛡️': 
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
                    gain.gain.setValueAtTime(0.18, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                    break;
                    
                case '💚': 
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(330, now);
                    osc.frequency.exponentialRampToValueAtTime(660, now + 0.22);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
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
        console.warn("Аудио-эффект заблокирован.", e);
    }
}
