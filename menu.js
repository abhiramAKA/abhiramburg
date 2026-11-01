class MainMenuScene extends Phaser.Scene {
    constructor() { 
        super({ key: 'MainMenuScene' }); 
    }
    
    create() {
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY;

        // Название игры
        this.add.text(cx, cy - 100, 'МЕГА ИГРА 2026', { 
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial' 
        }).setOrigin(0.5);

        // Кнопка запуска
        const startButton = this.add.text(cx, cy + 50, '[ НАЧАТЬ ИГРУ ]', { 
            fontSize: '28px', fill: '#00ffcc', backgroundColor: '#1e272e', padding: 10, fontFamily: 'Arial' 
        }).setOrigin(0.5).setInteractive();
        
        // Переход на игровой экран
        startButton.on('pointerdown', () => { 
            this.scene.start('GameplayScene'); 
        });
    }
}
