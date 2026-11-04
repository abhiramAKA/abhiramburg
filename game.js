/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЕЙТА, ДАННЫХ И ИНИЦИАЛИЗАЦИИ (v0.6.0-alpha.9)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-alpha.9";

// Единые глобальные константы и параметры сетки 8х8
const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '💚', '⚡️', '💀'];

// Глобальное состояние рейда
let combatData = {
    dragonHP: 1000,
    dragonMaxHP: 1000,
    playerAP: 3,
    playerMaxAP: 3,
    currentRound: 1,
    squad: [
        { name: "Воин", hp: 120, maxHP: 120, class: "warrior", role: "Атака/Щит" },
        { name: "Клирик", hp: 90, maxHP: 90, class: "cleric", role: "Лечение" }
    ]
};

// Состояние игрового поля Match-3
let match3BoardData = [];
let selectedCell = null;

// Старт при полной загрузке DOM-дерева страницы
window.addEventListener('DOMContentLoaded', () => {
    initVersionDisplay();
    setupMenuListeners();
});

// Запись версии в интерфейс
function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) {
        versionElement.innerText = GAME_VERSION;
    }
}

// Архитектурный метод переключения экранов
function showScreen(screenId) {
    const screens = ['main-menu', 'info-screen', 'combat-screen'];
    
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            if (id === screenId) {
                screenEl.style.display = 'flex';
            } else {
                screenEl.style.display = 'none';
            }
        }
    });
}

// Настройка кликов и запуск игрового процесса
function setupMenuListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            // Переключаем окно
            showScreen('combat-screen');
            
            // Запускаем последовательную сборку боя напрямую из combat.js
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            } else {
                console.error("Критический сбой: Функция startCombatSession не обнаружена в combat.js!");
            }
        });
    }

    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            showScreen('info-screen');
        });
    }

    const fromInfoToMenuBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoToMenuBtn) {
        fromInfoToMenuBtn.addEventListener('click', () => {
            showScreen('main-menu');
        });
    }

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда? Прогресс раунда будет утерян.")) {
                showScreen('main-menu');
            }
        });
    }
}
