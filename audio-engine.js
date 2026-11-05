/* ==========================================================================
   КХАМАЧ — ПРОЦЕДУРНЫЙ АУДИО-ДВИЖОК СКАЗОЧНЫХ РУН (ОБНОВЛЕН - v2.9.1-BETA)
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
        const baseNotes = [146.83, 164.81, 196.00, 220.00, 261.63];
        const freq1 = baseNotes[Math.floor(Math.random() * baseNotes.length)];
        const freq2 = freq1 * 1.5; 
        const duration = 5 + Math.random() * 2;

        [freq1, freq2].forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            const targetVolume = idx === 0 ? 0.012 : 0.006;
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(targetVolume, now + 2.0); 
            gain.gain.setValueAtTime(targetVolume, now + duration - 2.0);
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
        console.warn("Ошибка эмбиента:", e);
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
        
        // Сказочный кристальный щелчок при перемещении камней
        if (type === 'swap') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } 
        // Нежный перезвон ветра при появлении поля
        else if (type === 'intro') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
            gain.gain.setValueAtTime(0.03, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } 
        // Сказочные, волшебные взрывы комбинаций на синусоидах и треугольниках
        else {
            osc.type = 'triangle';
            switch(type) {
                case '🔥': 
                    osc.frequency.setValueAtTime(350, now);
                    osc.frequency.linearRampToValueAtTime(120, now + 0.22);
                    gain.gain.setValueAtTime(0.15, now);
                    break;
                case '🛡️': 
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    osc.frequency.exponentialRampToValueAtTime(980, now + 0.25);
                    gain.gain.setValueAtTime(0.12, now);
                    break;
                case '⚡': 
                    osc.frequency.setValueAtTime(700, now);
                    osc.frequency.linearRampToValueAtTime(300, now + 0.18);
                    gain.gain.setValueAtTime(0.1, now);
                    break;
                case '💚': 
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(330, now);
                    osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
                    gain.gain.setValueAtTime(0.15, now);
                    break;
                default:
                    osc.frequency.setValueAtTime(300, now);
                    osc.frequency.linearRampToValueAtTime(150, now + 0.2);
                    gain.gain.setValueAtTime(0.1, now);
            }
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        }
    } catch (e) {
        console.warn("Аудио-эффект заблокирован.", e);
    }
}
