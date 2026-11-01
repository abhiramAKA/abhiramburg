class GameplayScene extends Phaser.Scene {
    constructor() { 
        super({ key: 'GameplayScene' }); 
    }
    
    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        this.add.text(cx, cy - 150, 'ИГРОВОЙ ПРОЦЕСС', { 
            fontSize: '24px', fill: '#ffff00', fontFamily: 'Arial' 
        }).setOrigin(0.5);

        // Логика счета очков
        this.score = 0;
        this.scoreText = this.add.text(cx, cy, 'Кликов: 0', { 
            fontSize: '40px', fill: '#ffffff', fontFamily: 'Arial' 
        }).setOrigin(0.5);

        // ТЕСТОВЫЙ ЗЕЛЕНЫЙ КРУГ ДЛЯ ПРОВЕРКИ ОБНОВЛЕНИЯ (0x2ecc71)
        const target = this.add.circle(cx, cy + 100, 60, 0x2ecc71).setInteractive();
        
        target.on('pointerdown', () => {
            this.score += 1;
            this.scoreText.setText('Кликов: ' + this.score);
        });

        // Кнопка возврата в главное меню
        const backButton = this.add.text(cx, this.cameras.main.height - 80, 'В меню', { 
            fontSize: '20px', fill: '#aaaaaa', fontFamily: 'Arial' 
        }).setOrigin(0.5).setInteractive();
        
        backButton.on('pointerdown', () => { 
            this.scene.start('MainMenuScene'); 
        });
    }
}
