/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (ИСПРАВЛЕН - v2.8.1-BETA)
   ========================================================================== */

function setupAllGameListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) toCombatBtn.addEventListener('click', () => showScreen('dragon-select-screen'));

    const fromSelectBtn = document.getElementById('from-select-to-menu-btn');
    if (fromSelectBtn) fromSelectBtn.addEventListener('click', () => showScreen('main-menu'));
    
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            const textContainer = document.getElementById('info-screen-text');
            if (textContainer) {
                textContainer.innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
            }
            showScreen('info-screen');
        });
    }
    
    const fromInfoBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoBtn) fromInfoBtn.addEventListener('click', () => showScreen('main-menu'));
    
    const toForgeBtn = document.getElementById('to-forge-btn');
    if (toForgeBtn) toForgeBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('forge'); });

    const toAlchemyBtn = document.getElementById('to-alchemy-btn');
    if (toAlchemyBtn) toAlchemyBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('alchemy'); });

    const toClansBtn = document.getElementById('to-clans-btn');
    if (toClansBtn) toClansBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('clans'); });
    
    const toSquadBtn = document.getElementById('to-squad-btn');
    if (toSquadBtn) toSquadBtn.addEventListener('click', () => showScreen('squad-screen'));

    const closeModeDescBtn = document.getElementById('close-mode-desc-btn');
    if (closeModeDescBtn) closeModeDescBtn.addEventListener('click', () => showScreen('main-menu'));

    const modeBuyBtn = document.getElementById('mode-buy-btn');
    if (modeBuyBtn) {
        modeBuyBtn.addEventListener('click', () => {
            if (currentOpenedModeKey && typeof buyTownBuilding === 'function') {
                if (buyTownBuilding(currentOpenedModeKey)) {
                    alert("Здание успешно восстановлено древней магией цитадели!");
                    if (typeof openModeDescription === 'function') openModeDescription(currentOpenedModeKey);
                } else {
                    alert("Недостаточно золота для выкупа! Требуется 100 🪙.");
                }
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
    const combatHelpBtn = document.getElementById('combat-help-btn');
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            const container = document.getElementById('combat-help-text-container');
            if (container) {
                container.innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
            }
            const screen = document.getElementById('combat-help-screen');
            if (screen) screen.style.display = 'flex';
        });
    }

    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    if (closeCombatHelpBtn) {
        closeCombatHelpBtn.addEventListener('click', () => {
            const screen = document.getElementById('combat-help-screen');
            if (screen) screen.style.display = 'none';
        });
    }
}
