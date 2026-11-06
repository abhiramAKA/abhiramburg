/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЭЙТА И ТАЙМЕРОВ (ИСПРАВЛЕН - v4.9.4-BETA)
   ========================================================================== */

const GAME_VERSION = "v4.9.4-BETA";
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
        { id: "tank", name: "Защитник", hp: 150, maxHP: 150, sp: 0, maxSP: 100, icon: "🛡️", color: "#4a90e2" },
        { id: "damage", name: "Воин", hp: 90, maxHP: 90, sp: 0, maxSP: 100, icon: "🔥", color: "#ff4500" },
        { id: "archer", name: "Стрелок", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "⚡", color: "#f1c40f" },
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ]
};

let match3BoardData = null;
let selectedCell = null;
let selectedDragonLevel = 1;

window.currentOpenedModeKey = null;

function sanitizeAndMigrateStorage() {
    const currentGold = localStorage.getItem('khamach_gold') || '0';
    const currentMaxTier = localStorage.getItem('khamach_max_tier') || '1';
    
    const plasma = localStorage.getItem('khamach_res_plasma') || '0';
    const blood = localStorage.getItem('khamach_res_blood') || '0';
    const scale = localStorage.getItem('khamach_res_scale') || '0';
    const tears = localStorage.getItem('khamach_res_tears') || '0';

    const toxicKeys = [
        'GAME_TEXTS', 'town_dom_backup', 'main_menu_html_v2', 
        'khamach_menu_backup', 'town_dom_html', 'town_dom_backup_html',
        'khamach_html_backup', 'cached_menu_dom'
    ];
    toxicKeys.forEach(k => localStorage.removeItem(k));

    // Сброс триггеров для принудительного вызова лаконичных окон обучения
    localStorage.removeItem('khamach_combat_tutorial_done');
    localStorage.removeItem('khamach_combo_tut_done');

    localStorage.setItem('khamach_gold', currentGold);
    localStorage.setItem('khamach_max_tier', currentMaxTier);
    localStorage.setItem('khamach_res_plasma', plasma);
    localStorage.setItem('khamach_res_blood', blood);
    localStorage.setItem('khamach_res_scale', scale);
    localStorage.setItem('khamach_res_tears', tears);
}

function initDispatcherModule() {
    sanitizeAndMigrateStorage();

    if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM();
    if (typeof injectCombatInterfaceBaseDOM === 'function') injectCombatInterfaceBaseDOM();
    if (typeof injectSquadInterfaceDOM === 'function') injectSquadInterfaceDOM();
    
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;

    if (typeof setupAllGameListeners === 'function') {
        try { setupAllGameListeners(); } catch (e) { console.error("Ошибка навешивания листенеров:", e); }
    }
    
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();

    setInterval(() => {
        if (typeof checkAndProcessMissionsBackground === 'function') {
            checkAndProcessMissionsBackground();
        }
    }, 1000);
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'squad-screen', 'combat-screen', 'storage-screen', 'missions-screen', 'chronicle-screen', 'squad-heroes-spec-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) screenEl.style.display = (id === screenId) ? 'flex' : 'none';
    });
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'squad-screen') {
        if (typeof injectSquadInterfaceDOM === 'function') injectSquadInterfaceDOM();
        if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
        if (typeof updateSquadVisualStyles === 'function') updateSquadVisualStyles();
    }
    if (screenId === 'storage-screen' && typeof updateStorageScreenDOM === 'function') {
        updateStorageScreenDOM();
    }
    if (screenId === 'squad-heroes-spec-screen' && typeof updateSquadHeroesSpecScreenDOM === 'function') {
        updateSquadHeroesSpecScreenDOM();
    }
    if (screenId === 'missions-screen' && typeof renderMissionsDOM === 'function') {
        renderMissionsDOM();
    }
    if (screenId === 'chronicle-screen' && typeof renderChronicleDOM === 'function') {
        renderChronicleDOM();
    }
    if (screenId === 'main-menu' || screenId === 'squad-screen' || screenId === 'mode-desc-screen' || screenId === 'storage-screen') {
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    }
}
