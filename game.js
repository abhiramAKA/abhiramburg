/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР И СТРУКТУРА БОНУСОВ ЗДАНbackgroundИЙ (v0.8.8-BETA)
   ========================================================================== */

const GAME_VERSION = "v0.8.8-BETA";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '⚡', '💚']; // Заменено на молнию

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
        { id: "archer", name: "Лучник", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "⚡", color: "#f1c40f" }, // Заменено на молнию
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ]
};

let match3BoardData = [];
let selectedCell = null;
let selectedDragonLevel = 1;
let activeModeKey = "";

const GAME_TEXTS = {
    mainInfo: `
        <p><strong>«Логово Чудовища»:</strong></p>
        <p>Земля содрогается от поступи древнего змея. Сражайся на поле боя, и каждая собранная триада камней обрушит ярость вашего отряда на врага.</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🛡️ Суперсила Танка:</strong> Провокация (Дракон атакует Танка). Наносит базовый урон (+урон Кузницы).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🔥 Суперсила Дамагера:</strong> Наносит Дракону сокрушительный чистый урон (120 ед.).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>⚡ Суперсила Лучника:</strong> Ослепляет Дракона (урон босса -50%). Наносит базовый урон (+урон Кузницы).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>💚 Суперсила Мага:</strong> Моментально исцеляет здоровье (+25 HP) всему отряду. Наносит базовый урон (+урон Кузницы).</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНИЦА (До 15 ур.)", text: "Священное место ковки оружия. Каждый уровень здания увеличивает урон суперсил Танка, Лучника и Мага на <strong>+5 единиц</strong>." },
    alchemy: { title: "🧪 БАШНЯ АЛХИМИКА (До 15 ур.)", text: "Здесь дистиллируют ману и харизму. Каждые 5 уровней строения навсегда увеличивают лимит ваших очков ходов (Макс. AP) в битвах на +1 ходов." },
    squad: { title: "👥 ВОЕННЫЙ ЛАГЕРЬ ЦИТАДЕЛИ", text: "Военный штаб планирования. Каждый уровень здания увеличивает максимальный запас здоровья (Max HP) всех героев отряда на <strong>+10 единиц</strong>." }
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
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
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
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'main-menu' && typeof updateTownGoldDisplay === 'function') {
        updateTownGoldDisplay();
    }
}

function openModeDescription(modeKey) {
    activeModeKey = modeKey;
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    document.getElementById('mode-desc-text').innerHTML = modeData.text;
    
    updateBuildButtonDOM();
    showScreen('mode-desc-screen');
}

function updateBuildButtonDOM() {
    const buildBtn = document.getElementById('build-upgrade-btn');
    if (!buildBtn || !activeModeKey) return;
    
    const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(activeModeKey) : 0;
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 150;
    
    if (lvl >= 15) {
        buildBtn.innerText = `МАКСИМАЛЬНЫЙ УРОВЕНЬ (Ур. 15)`;
        buildBtn.classList.add('disabled');
        return;
    }

    if (lvl === 0) {
        buildBtn.innerText = `ПОСТРОИТЬ УР. 1 (Цена: 150 🪙)`;
    } else {
        buildBtn.innerText = `УЛУЧШИТЬ ДО УР. ${lvl + 1} (Цена: 150 🪙)`;
    }
    
    if (currentGold < cost) {
        buildBtn.classList.add('disabled');
    } else {
        buildBtn.classList.remove('disabled');
    }
}

function setupMenuListeners() {
    document.getElementById('to-combat-btn').addEventListener('click', () => showScreen('dragon-select-screen'));
    document.getElementById('from-select-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    
    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = GAME_TEXTS.mainInfo;
        showScreen('info-screen');
    });
    
    document.getElementById('from-info-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => openModeDescription('squad'));
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => showScreen('main-menu'));

    const buildUpgradeBtn = document.getElementById('build-upgrade-btn');
    if (buildUpgradeBtn) {
        buildUpgradeBtn.addEventListener('click', () => {
            const currentLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(activeModeKey) : 0;
            if (currentLvl >= 15) return;

            if (typeof upgradeBuilding === 'function' && upgradeBuilding(activeModeKey)) {
                updateBuildButtonDOM();
                alert("Строительство успешно завершено! Бонусы обновлены.");
            } else {
                alert("Недостаточно золота для постройки! Сражайтесь с драконами.");
            }
        });
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
    document.getElementById('combat-help-btn').addEventListener('click', () => {
        document.getElementById('combat-help-text-container').innerHTML = GAME_TEXTS.combatHelp;
        document.getElementById('combat-help-screen').style.display = 'flex';
    });
    document.getElementById('close-combat-help-btn').addEventListener('click', () => {
        document.getElementById('combat-help-screen').style.display = 'none';
    });
}
