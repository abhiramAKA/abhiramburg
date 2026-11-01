class GameplayScene {
    create() {
        const gi = window.gameInstance;
        const ctx = gi.ctx;
        const cx = gi.canvas.width / 2;
        const cy = gi.canvas.height / 2;

        // Заголовок
        ctx.fillStyle = '#ffff00';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ИГРОВОЙ ПРОЦЕСС', cx, cy - 150);

        // Счетчик кликов
        ctx.fillStyle = '#ffffff';
        ctx.font = '40px Arial';
        ctx.fillText('Кликов: ' + gi.score, cx, cy);

        // НАШ ТЕСТОВЫЙ ЗЕЛЕНЫЙ КРУГ
        ctx.fillStyle = '#2ecc71'; 
        ctx.beginPath();
        ctx.arc(cx, cy + 100, 60, 0, Math.PI * 2);
        ctx.fill();

        // Кнопка назад
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '20px Arial';
        ctx.fillText('В меню', cx, gi.canvas.height - 80);
    }
}
