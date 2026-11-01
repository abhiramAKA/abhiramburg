class GameplayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameplayScene' }); // Уникальное имя сцены
    }

    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        // Надпись, что мы в игре
        this.add.text(cx, cy - 150, 'ИГРОВОЙ ПРОЦЕСС', {
            fontSize: '24px',
            fill: '#ffff00',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Создаем счетчик кликов
        this.score = 0;
        this.scoreText = this.add.text(cx, cy, 'Кликов: 0', {
            fontSize: '40px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Большая интерактивная кнопка-мишень для кликов
        const target = this.add.circle(cx, cy + 100, 60, 0xff4757)
            .setInteractive();

        // Логика клика/тапа по мишени
        target.on('pointerdown', () => {
            this.score += 1;
            this.scoreText.setText('Кликов: ' + this.score);
            
            // Маленький визуальный эффект сочности: круг сжимается и разжимается
            this.tweens.add({
                targets: target,
                scale: 0.8,
                duration: 50,
                yoyo: true
            });
        });

        // Кнопка "ВЕРНУТЬСЯ В МЕНЮ"
        const backButton = this.add.text(cx, this.cameras.main.height - 80, 'В меню', {
            fontSize: '20px',
            fill: '#aaa',
            fontFamily: 'Arial'
        })
        .setOrigin(0.5)
        .setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene'); // Возвращаемся в меню
        });
    }

    update() {
        // Здесь каждую миллисекунду просчитывается физика, движение врагов и т.д.
    }
}
