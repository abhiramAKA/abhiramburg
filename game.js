/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (НАВИГАЦИЯ МЕНЮ И ГОРОДА - v0.9.1-BETA)
   ========================================================================== */

const GAME_VERSION = "v0.9.1-BETA";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '⚡', '💚'];

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
        { id: "archer", name: "Лучник", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "⚡", color: "#f1c40f" },
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ]
};

let match3BoardData = [];
let selectedCell = null;
let selectedDragonLevel = 1;

const GAME_TEXTS = {
    mainInfo: `
        <p><strong>«Логово Чудовища»:</strong></p>
        <p>Земля содрогается от поступи древнего змея. Сражайся на поле боя, и каждая собранная триада камней обрушит ярость вашего отряда на врага.</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🛡️ Суперсила Танка:</strong> Провокация. Наносит урон дракону.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🔥 Суперсила Дамагера:</strong> Наносит Дракону сокрушительный чистый урон.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>⚡ Суперсила Лучника:</strong> Ослепляет Дракона (урон босса -50%). Наносит урон.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>💚 Суперсила Мага:</strong> Моментально исцеляет здоровье всему отряду. Наносит урон.</p>
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
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
}

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'town-screen', 'combat-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            screenEl.style.display = (id === screenId) ? 'flex' : 'none';
        }
    });
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'town-screen') {
        renderTownBuildingsList();
    }
    if (screenId === 'main-menu' || screenId === 'town-screen') {
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    }
}

function openModeDescription(modeKey) {
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    document.getElementById('mode-desc-title').innerText = modeData.title;
    document.getElementById('mode-desc-text').innerHTML = modeData.text;
    showScreen('mode-desc-screen');
}

function renderTownBuildingsList() {
    const listContainer = document.getElementById('town-buildings-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    const buildings = [
        { id: 'tank', name: '🛡️ Оружейная Танка', desc: 'Каждый уровень дает Танку +20 к Макс. HP' },
        { id: 'damage', name: '🔥 Кузница Дамагера', desc: 'Каждый уровень дает Дамагеру +15 к урону ульты' },
        { id: 'archer', name: '⚡ Стрельбище Лучника', desc: 'Каждый уровень дает Лучнику +10 к урону' },
        { id: 'mage', name: '💚 Алтарь Мага', desc: 'Каждый уровень дает Магу +5 к силе лечения' }
    ];

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 150;

    buildings.forEach(b => {
        const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(b.id) : 0;
        const card = document.createElement('div');
        card.style.background = 'rgba(0,0,0,0.3)';
        card.style.border = '1px solid #4a3e31';
        card.style.padding = '8px';
        card.style.marginBottom = '8px';
        card.style.borderRadius = '4px';
        card.style.textAlign = 'left';

        card.innerHTML = `
            <div style="font-weight:bold; color:#e6c280; font-size:14px;">${b.name} (Ур. ${lvl}/15)</div>
            <div style="font-size:11px; color:#bfae96; margin:4px 0 6px 0;">${b.desc}</div>
        `;

        const btn = document.createElement('button');
        btn.className = 'menu-btn';
        btn.style.padding = '6px';
        btn.style.fontSize = '12px';

        if (lvl >= 15) {
            btn.innerText = 'МАКС. УРОВЕНЬ';
            btn.classList.add('disabled');
        } else {
            btn.innerText = `Улучшить (150 🪙)`;
            if (currentGold < cost) btn.classList.add('disabled');
            btn.addEventListener('click', () => {
                if (typeof upgradeBuilding === 'function' && upgradeBuilding(b.id)) {
                    renderTownBuildingsList();
                }
            });
        }
        card.appendChild(btn);
        listContainer.appendChild(card);
    });
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
    
    document.getElementById('to-town-btn').addEventListener('click', () => showScreen('town-screen'));
    document.getElementById('close-town-btn').addEventListener('click', () => showScreen('main-menu'));

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
