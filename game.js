/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (ВЕРНУЛИ МАГА! - v0.6.0-beta.10)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-beta.10";

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
        { name: "Маг", hp: 80, maxHP: 80, class: "mage", role: "⚡️", icon: "⚡️" },
        { name: "Клирик", hp: 90, maxHP: 90, class: "cleric", role: "💚", icon: "💚" }
    ]
};

let match3BoardData = [];
let selectedCell = null;

// Тексты описаний для кнопок главного меню
const MODE_DESCRIPTIONS = {
    forge: {
        title: "⚒️ ДРЕВНЯЯ КУЗНИЦА",
        text: "Священное место, где из осколков побеждённых монстров и застывшей лавы можно выковывать мифическое снаряжение для Воина, Мага и Клирика. Повышает базовую атаку и открывает пассивные навыки рун."
    },
    alchemy: {
        title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ",
        text: "Здесь вы сможете трансмутировать руны прямо во время боя, варить зелья Очков Действия (AP) и дистиллировать драконью кровь для получения мощных эликсиров бессмертия."
    },
    squad: {
        title: "👥 УПРАВЛЕНИЕ ОТРЯДОМ",
        text: "Военный лагерь ваших героев. Позволяет распределять очки характеристик (Сила, Дух, Выносливость), нанимать новых бойцов в рейд и изучать сокрушительные комбо-приемы."
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initVersionDisplay();
    setupMenuListeners();
    setupCombatHelpListeners();
});

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) {
        versionElement.innerText = GAME_VERSION;
    }
}

function showScreen(screenId) {
    const screens = ['main-menu', 'info-screen', 'mode-desc-screen', 'combat-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            screenEl.style.display = (id === screenId) ? 'flex' : 'none';
        }
    });
}

function openModeDescription(modeKey) {
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    document.getElementById('mode-desc-text').innerHTML = modeData.text;
    showScreen('mode-desc-screen');
}

function setupMenuListeners() {
    // Кнопка В БОЙ
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            showScreen('combat-screen');
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            }
        });
    }

    // Вопросик главного меню
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

    // Обработчики новых активных кнопок меню
    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => openModeDescription('squad'));

    // Закрытие окна описания модов
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => {
        showScreen('main-menu');
    });

    // Кнопка побега из боя
    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) {
                showScreen('main-menu');
            }
        });
    }
}

// Слушатели для всплывающей подсказки прямо на боевом экране
function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            const helpScreen = document.getElementById('combat-help-screen');
            if (helpScreen) helpScreen.style.display = 'flex';
        });
    }
    
    if (closeCombatHelpBtn) {
        closeCombatHelpBtn.addEventListener('click', () => {
            const helpScreen = document.getElementById('combat-help-screen');
            if (helpScreen) helpScreen.style.display = 'none';
        });
    }
}
