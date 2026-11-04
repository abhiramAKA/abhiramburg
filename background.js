// Код управления живым фоном с искрами
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

const particles = [];
for (let i = 0; i < 35; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height + height,
        speed: 0.4 + Math.random() * 1.2,
        radius: Math.random() * 2 + 0.5
    });
}

function animateBg() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(230, 194, 128, 0.15)';

    particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateBg);
}

// Запускаем анимацию сразу при загрузке скрипта
animateBg();
