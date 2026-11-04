/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (v0.6.0-alpha.12)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-alpha.12";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '💚', '⚡️', '💀'];

let combatData = {
    dragonHP: 1000,
    dragonMaxHP: 1000,
    playerAP: 3,
    playerMaxAP: 3,
    currentRound: 1,
    squad: [
        { name: "Воин", hp: 120, maxHP: 120, class: "warrior", role: "⚔️", icon: "⚔️" },
        { name: "Клирик", hp: 90, maxHP: 90, class: "cleric", role: "💚", icon: "💚" }
    ]
};

let match3BoardData = [];
let selectedCell = null;

window.addEventListener('DOMContentLoaded', () => {
    initVersionDisplay();
    setupMenuListeners();
});

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) {
        versionElement.innerText = GAME_VERSION;
    }
}

function showScreen(screenId) {
    const screens = ['main-menu', 'info-screen', 'combat-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            screenEl.style.display = (id === screenId) ? 'flex' : 'none';
        }
    });
}

function setupMenuListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            showScreen('combat-screen');
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            } else {
                console.error("Критический сбой: Функция startCombatSession не обнаружена!");
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
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) {
                showScreen('main-menu');
            }
        });
    }
}
