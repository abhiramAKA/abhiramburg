/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТИХИЙ (v0.7.0-ALPHA.1)
   ========================================================================== */

const GAME_VERSION = "v0.7.0-alpha.1";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['⛰️', '🔥', '💧', '💨'];

let combatData = {
    currentLevel: 1,
    dragonHP: 200,
    dragonMaxHP: 200,
    dragonBaseDamage: 10,
    dragonMassDamage: 20,
    playerAP: 3,
    playerMaxAP: 3,
    currentRound: 1,
    playerShield: 0,
    squad: [
        { name: "Танк Земли", hp: 60, maxHP: 60, role: "⛰️", icon: "⛰️" },
        { name: "Берсерк Огня", hp: 50, maxHP: 50, role: "🔥", icon: "🔥" },
        { name: "Снайпер Воды", hp: 45, maxHP: 45, role: "💧", icon: "💧" },
        { name: "Маг Воздуха", hp: 40, maxHP: 40, role: "💨", icon: "💨" }
    ]
};

let match3BoardData = [];
let selectedCell = null;

const GAME_TEXTS = {
    mainInfo: `
        <p><strong>Система Четырех Стихий:</strong> Поле сокращено до 4 элементов. Комбинации собираются значительно легче!</p>
        <p>Каждый уровень Дракон становится сильнее, наращивает здоровье и урон.</p>
        <p><strong>Камни-препятствия (🧱):</strong> Начиная со 2-го уровня, на поле появляются проклятые заблокированные ячейки, которые нельзя сдвинуть или уничтожить.</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>⛰️ Руна Земли:</strong> Танк генерирует +3 ед. Щита за камень. Защищает отряд от атак.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>🔥 Руна Огня:</strong> Берсерк наносит +4 ед. разрушительного ближнего урона за камень.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>💧 Руна Воды:</strong> Снайпер наносит +3 ед. точечного урона с дистанции за камень.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>💨 Руна Воздуха:</strong> Маг исцеляет всех живых героев на +2 ед. за камень.</p>
        <p style="border-top: 1px dashed #4a3f2c; padding-top: 10px; font-size: 13px; text-align: left;"><strong>⚠️ Важно:</strong> Если профильный герой погибает, его руны на поле перестают приносить пользу!</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНИЦА", text: "Модуль улучшения стихийного снаряжения. Будет доступен в следующих версиях." },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", text: "Смешивание эссенций земли, огня, воды и воздуха. Будет доступно в следующих версиях." },
    squad: { title: "👥 УПРАВЛЕНИЕ ОТРЯДОМ", text: "Прокачка характеристик ваших четырех стихийных бойцов. Будет доступно в следующих версиях." }
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
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            if (typeof initAudioContext === 'function') {
                initAudioContext();
            }
            combatData.currentLevel = 1;
            showScreen('combat-screen');
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            }
        });
    }

    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            const infoTextEl = document.getElementById('info-screen-text');
            if (infoTextEl) infoTextEl.innerHTML = GAME_TEXTS.mainInfo;
            showScreen('info-screen');
        });
    }

    const fromInfoToMenuBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoToMenuBtn) {
        fromInfoToMenuBtn.addEventListener('click', () => {
            showScreen('main-menu');
        });
    }

    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => openModeDescription('squad'));

    document.getElementById('close-mode-desc-btn').addEventListener('click', () => {
        showScreen('main-menu');
    });

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда? Уровень прогресса будет потерян.")) {
                if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
                showScreen('main-menu');
            }
        });
    }
}

function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            const txtContainer = document.getElementById('combat-help-text-container');
            if (txtContainer) txtContainer.innerHTML = GAME_TEXTS.combatHelp;
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
