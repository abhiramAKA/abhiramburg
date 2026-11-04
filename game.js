/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЕЙТА (v0.6.0-alpha.3)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-alpha.3";

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
    // Находим все окна игры
    const screens = ['main-menu', 'info-screen', 'combat-screen'];
    
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            if (id === screenId) {
                // Показываем целевой экран
                screenEl.style.display = 'flex';
            } else {
                // Скрываем остальные
                screenEl.style.display = 'none';
            }
        }
    });
}

// Настройка слушателей событий для интерфейса окон
function setupMenuListeners() {
    // Кнопка "В БОЙ"
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            showScreen('combat-screen');
            // Вызываем запуск сессии из combat.js
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            }
        });
    }

    // Кнопка контекстной справки "❓"
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            showScreen('info-screen');
        });
    }

    // Кнопка "Назад в меню" из справки
    const fromInfoToMenuBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoToMenuBtn) {
        fromInfoToMenuBtn.addEventListener('click', () => {
            showScreen('main-menu');
        });
    }

    // Кнопка "Сбежать из рейда" из боевого экрана
    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда? Прогресс раунда будет утерян.")) {
                showScreen('main-menu');
            }
        });
    }
}
