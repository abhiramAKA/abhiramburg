class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' }); // Уникальное имя сцены
    }

    preload() {
        // Здесь в будущем мы будем загружать картинки для меню
    }

    create() {
        // Находим центр экрана телефона
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        // Рисуем красивое название игры
        this.add.text(cx, cy - 100, 'МЕГА ИГРА 2026', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Создаем кнопку "ИГРАТЬ"
        const startButton = this.add.text(cx, cy + 50, '[ НАЧАТЬ ИГРУ ]', {
            fontSize: '28px',
            fill: '#00ffcc',
            fontFamily: 'Arial',
            backgroundColor: '#1e272e',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive(); // Делаем текст кликабельным (для тапов на телефоне)

        // Эффект при наведении (или удерживании пальца)
        startButton.on('pointerover', () => startButton.setStyle({ fill: '#ff00ff' }));
        startButton.on('pointerout', () => startButton.setStyle({ fill: '#00ffcc' }));

        // КЛИК ПО КНОПКЕ: Сцена меню выключается, включается сцена игры!
        startButton.on('pointerdown', () => {
            this.scene.start('GameplayScene'); 
        });
    }

    update() {
        // Логика меню, если нужна (пока пустая)
    }
}
