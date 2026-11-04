// Исправленный модуль живого заднего плана (Искры походного костра) под готический интерфейс
(function() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = 35;

    function resizeCanvas() {
        // Задаем холсту точные размеры окна браузера для корректного отображения искр
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Spark {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; // Хаотичный старт по всей высоте
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 20;
            this.size = Math.random() * 2 + 1;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.alpha = Math.random() * 0.6 + 0.4;
            this.decay = Math.random() * 0.004 + 0.002;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.alpha -= this.decay;

            if (this.alpha <= 0 || this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = '#ff7315';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function init() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Spark());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Запуск анимации
    init();
    animate();
})();
