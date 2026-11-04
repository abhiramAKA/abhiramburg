/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЕЙТА И ДАННЫХ (v0.6.0-alpha.6)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-alpha.6";

// Единые глобальные константы для всего проекта
const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '💚', '⚡️', '💀'];

// Глобальный стейт боя и отряда
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

// Глобальные данные для поля Match-3
let match3BoardData =;
let selectedCell = null;

// Инициализация игры при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    initVersionDisplay();
    setupMenuListeners();
});

// Автоматическое обновление версии в футере
function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) {
        versionElement.innerText = GAME_VERSION;
    }
}

// Переключение экранов (Бесшовный метод showScreen)
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

// Настройка слушателей событий для интерфейса окон
function setupMenuListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            showScreen('combat-screen');
            // Безопасный вызов инициализации боя
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            } else {
                console.error("Критическая ошибка: модуль combat.js не загружен или функция startCombatSession отсутствует!");
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
