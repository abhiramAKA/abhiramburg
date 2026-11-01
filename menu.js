class MainMenuScene {
    create() {
        const gi = window.gameInstance;
        const ctx = gi.ctx;
        const cx = gi.canvas.width / 2;
        const cy = gi.canvas.height / 2;

        // Название игры
        ctx.fillStyle = '#ffffff';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('МЕГА ИГРА 2026', cx, cy - 50);

        // Кнопка старта
        ctx.fillStyle = '#1e272e';
        ctx.fillRect(cx - 120, cy, 240, 50);
        ctx.fillStyle = '#00ffcc';
        ctx.font = '24px Arial';
        ctx.fillText('[ НАЧАТЬ ИГРУ ]', cx, cy + 35);
    }
}
