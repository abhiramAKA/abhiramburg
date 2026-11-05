/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (БЕЗ ЛОГИКИ ОТРЯДА - v1.0.0-BETA)
   ========================================================================== */

const GAME_VERSION = "v1.0.0-BETA";

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
let currentOpenedModeKey = null;

const GAME_TEXTS = {
    mainInfo: `
        <p><strong>«Логово Чудовища»:</strong></p>
        <p>Земля содрогается от поступи древнего змея. Сражайся на поле боя, и каждая собранная триада камней обрушит ярость вашего отряда на врага.</p>
    `,
    squadInfo: `
        <p><strong>«Военный Штаб Отряда»:</strong></p>
        <p>Здесь сосредоточены пассивные тренировочные лагеря ваших воинов. Развивайте оружейные, стрельбища и алтари за золото, добытое с драконов, чтобы многократно приумножить характеристики отряда перед вылазкой в Горнило.</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🛡️ Суперсила Танка:</strong> Провокация. Наносит урон дракону.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>🔥 Суперсила Дамагера:</strong> Наносит Дракону сокрушительный чистый урон.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>⚡ Суперсила Лучника:</strong> Ослепляет Дракона (урон босса -50%). Наносит урон.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 8px;"><strong>💚 Суперсила Мага:</strong> Моментально исцеляет здоровье всему отряду. Наносит урон.</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЕЕ ГОРНИЛО", buyText: "В полумраке кузницы тяжело вздыхают мехи. Старый мастер готов принять трофеи из чрева ящера, но сначала нужно выкупить и восстановить инструменты кузни за 🪙 500.", activeText: "Инструменты восстановлены. Кузнец готов перековать Драконью Чешую в укрепление лат отряда." },
    alchemy: { title: "🧪 ТАЙНЫЙ ОЧАГ", buyText: "Свитки, покрытые пылью веков, и склянки заполняют полки. Алхимик Абхирамбурга способен дистиллировать кровь Дракона, но лаборатории требуется закупка дорогих реагентов за 🪙 500.", activeText: "Реагенты закуплены. Алхимик готов дистиллировать Драконью Кровь в начальный эликсир ярости воинов." }
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
    if (typeof initSquadModuleListeners === 'function') initSquadModuleListeners();
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
}

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'squad-screen', 'combat-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            screenEl.style.display = (id === screenId) ? 'flex' : 'none';
        }
    });
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'squad-screen' && typeof updateSquadButtonsDOM === 'function') {
        updateSquadButtonsDOM();
    }
    if (screenId === 'main-menu' || screenId === 'squad-screen' || screenId === 'mode-desc-screen') {
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    }
}

function openModeDescription(modeKey) {
    currentOpenedModeKey = modeKey;
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    
    const buyBtn = document.getElementById('mode-buy-btn');
    const processBtn = document.getElementById('mode-process-btn');
    const textEl = document.getElementById('mode-desc-text');
    
    const purchased = typeof isBuildingPurchased === 'function' ? isBuildingPurchased(modeKey) : false;
    
    if (!purchased) {
        textEl.innerHTML = `<p>${modeData.buyText}</p>`;
        buyBtn.style.display = 'block';
        processBtn.style.display = 'none';
    } else {
        const resKey = modeKey === 'forge' ? 'scales' : 'blood';
        const resName = modeKey === 'forge' ? '🦴 Чешуя Дракона' : '🧪 Кровь Дракона';
        const perkName = modeKey === 'forge' ? '🛡️ Стартовая Броня отряда' : '⚡ Стартовая Ярость (SP)';
        
        const count = typeof getPlayerResource === 'function' ? getPlayerResource(resKey) : 0;
        const currentPerkLvl = typeof getMetaPerkValue === 'function' ? getMetaPerkValue(modeKey === 'forge' ? 'khamach_perk_shield' : 'khamach_perk_sp') : 0;
        
        textEl.innerHTML = `
            <p>${modeData.activeText}</p>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; border: 1px dashed #544432; margin-bottom: 15px;">
                <p style="margin: 5px 0;">На складе цитадели: <strong>${count} ед.</strong> ${resName}</p>
                <p style="margin: 5px 0; color: #ffd700;">Бонус переработки: <strong>+${currentPerkLvl * 5} ед.</strong> к параметру ${perkName}</p>
            </div>
            <p style="font-size: 13px; color: #8a7350;">Стоимость ремесла: 1 ед. ресурса + 🪙 50 золота мастерам за работу.</p>
        `;
        buyBtn.style.display = 'none';
        processBtn.style.display = 'block';
    }
    
    showScreen('mode-desc-screen');
}

function setupMenuListeners() {
    document.getElementById('to-combat-btn').addEventListener('click', () => showScreen('dragon-select-screen'));
    document.getElementById('from-select-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    
    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = GAME_TEXTS.mainInfo;
        showScreen('info-screen');
    });
    
    document.getElementById('squad-info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = GAME_TEXTS.squadInfo;
        showScreen('info-screen');
    });
    
    document.getElementById('from-info-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    
    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => showScreen('squad-screen'));
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('close-squad-btn').addEventListener('click', () => showScreen('main-menu'));

    document.getElementById('mode-buy-btn').addEventListener('click', () => {
        if (currentOpenedModeKey && typeof buyTownBuilding === 'function') {
            if (buyTownBuilding(currentOpenedModeKey)) {
                alert("Здание успешно выкуплено и восстановлено!");
                openModeDescription(currentOpenedModeKey);
            } else {
                alert("Недостаточно золота для выкупа! Требуется 🪙 500.");
            }
        }
    });

    document.getElementById('mode-process-btn').addEventListener('click', () => {
        if (currentOpenedModeKey && typeof processCraftResource === 'function') {
            if (processCraftResource(currentOpenedModeKey)) {
                alert("Материал успешно переработан! Мощь вашей цитадели возросла.");
                openModeDescription(currentOpenedModeKey);
            }
        }
    });

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
