/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (ДИСПЕТЧЕР ЭКРАНОВ - v0.8.0-BETA)
   ========================================================================== */

const GAME_VERSION = "v0.8.0-BETA";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '🎯', '💚'];

let combatData = {
    dragonHP: 120, 
    dragonMaxHP: 120,
    playerAP: 1, 
    playerMaxAP: 1,
    currentRound: 1,
    tankTaunting: false, 
    dragonBlinded: false, 
    squad: [
        { id: "tank", name: "Танк", hp: 150, maxHP: 150, sp: 0, maxSP: 100, icon: "🛡️", color: "#4a90e2" },
        { id: "damage", name: "Дамагер", hp: 90, maxHP: 90, sp: 0, maxSP: 100, icon: "🔥", color: "#ff4500" },
        { id: "archer", name: "Лучник", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "🎯", color: "#f1c40f" },
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ]
};

let match3BoardData = [];
let selectedCell = null;
let selectedDragonLevel = 1;

const GAME_TEXTS = {
    mainInfo: `
        <p><strong>Правила Боя v0.8.0:</strong></p>
        <p>1. Каждый раунд вы делаете ровно <strong>1 ход на поле Match-3</strong>.</p>
        <p>2. Взрывы рун заряжают Суперсилу героев (+6% за камень).</p>
        <p>3. Дракон атакует автоматически <strong>сразу после вашего хода на поле</strong>.</p>
        <p>4. Прожимайте Суперсилы сияющих героев в любой момент раунда, чтобы уничтожить босса!</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🛡️ Суперсила Танка:</strong> Провокация. Дракон в следующем раунде гарантированно ударит только Танка.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🔥 Суперсила Дамагера:</strong> Наносит Дракону сокрушительный чистый урон (120 ед.).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🎯 Суперсила Лучника:</strong> Ослепляет Дракона — следующая атака босса нанесет на 50% меньше урона!</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>💚 Суперсила Мага:</strong> Моментально исцеляет здоровье (+25 HP) сразу всему отряду.</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНИЦА", text: "Священное место, где из костей и чешуи поверженных драконов можно выковывать мифическую экипировку." },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", text: "Здесь вы сможете дистиллировать драконью кровь и варить катализаторы маны." },
    squad: { title: "👥 КНИГА ЗАКЛИНАНИЙ И ОТРЯД", text: "Военный лагерь. Позволяет повышать уровни героев и открывать новые ультимативные приемы." }
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initDispatcherModule);
} else {
    initDispatcherModule();
}

function initDispatcherModule() {
    initVersionDisplay();
    setupMenuListeners();
    setupCombatHelpListeners();
}

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'combat-screen'];
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
            showScreen('dragon-select-screen');
        });
    }

    const levelBtns = document.querySelectorAll('.dragon-level-btn');
    levelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectedDragonLevel = parseInt(e.currentTarget.dataset.level);
            if (typeof startBackgroundMusic === 'function') startBackgroundMusic();
            showScreen('combat-screen');
            if (typeof startCombatSession === 'function') {
                startCombatSession(selectedDragonLevel);
            }
        });
    });

    const fromSelectToMenuBtn = document.getElementById('from-select-to-menu-btn');
    if (fromSelectToMenuBtn) {
        fromSelectToMenuBtn.addEventListener('click', () => showScreen('main-menu'));
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
        fromInfoToMenuBtn.addEventListener('click', () => showScreen('main-menu'));
    }

    const toForgeBtn = document.getElementById('to-forge-btn');
    if (toForgeBtn) {
        toForgeBtn.addEventListener('click', () => openModeDescription('forge'));
    }

    const toAlchemyBtn = document.getElementById('to-alchemy-btn');
    if (toAlchemyBtn) {
        toAlchemyBtn.addEventListener('click', () => openModeDescription('alchemy'));
    }

    const toSquadBtn = document.getElementById('to-squad-btn');
    if (toSquadBtn) {
        toSquadBtn.addEventListener('click', () => openModeDescription('squad'));
    }

    const closeModeDescBtn = document.getElementById('close-mode-desc-btn');
    if (closeModeDescBtn) {
        closeModeDescBtn.addEventListener('click', () => showScreen('main-menu'));
    }

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) {
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
