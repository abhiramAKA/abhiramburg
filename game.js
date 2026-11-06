/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР СТЭЙТА И ТАЙМЕРОВ (ИСПРАВЛЕН - v3.9.2-BETA)
   ========================================================================== */

const GAME_VERSION = "v3.9.2-BETA";
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

let match3BoardData = [];
let selectedCell = null;
let selectedDragonLevel = 1;
let currentOpenedModeKey = null;

function initDispatcherModule() {
    // Стартовый подрыв нулевого баланса для тестов интерфейса
    if (!localStorage.getItem('khamach_initial_bonus_v3')) {
        localStorage.setItem('khamach_gold', '1000');
        localStorage.setItem('khamach_res_plasma', '5');
        localStorage.setItem('khamach_res_blood', '5');
        localStorage.setItem('khamach_res_scale', '5');
        localStorage.setItem('khamach_res_tears', '5');
        localStorage.setItem('khamach_initial_bonus_v3', 'true');
    }

    if (typeof injectTownScreensDOM === 'function') injectTownScreensDOM();
    if (typeof injectCombatInterfaceBaseDOM === 'function') injectCombatInterfaceBaseDOM();
    if (typeof injectSquadInterfaceDOM === 'function') injectSquadInterfaceDOM();
    
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;

    if (typeof setupAllGameListeners === 'function') {
        try { 
            setupAllGameListeners(); 
        } catch (e) { 
            console.error("Ошибка навешивания листенеров:", e); 
        }
    }
    
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();

    setInterval(() => {
        if (typeof checkAndProcessMissionsBackground === 'function') {
            checkAndProcessMissionsBackground();
        }
    }, 1000);
}

function showScreen(screenId) {
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'squad-screen', 'combat-screen', 'storage-screen', 'missions-screen', 'chronicle-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) screenEl.style.display = (id === screenId) ? 'flex' : 'none';
    });
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'squad-screen' && typeof updateSquadVisualStyles === 'function') {
        updateSquadVisualStyles();
    }
    if (screenId === 'storage-screen' && typeof updateStorageScreenDOM === 'function') {
        updateStorageScreenDOM();
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
