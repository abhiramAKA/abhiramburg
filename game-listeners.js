/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (НОВЫЙ МОДУЛЬ - v1.3.0-BETA)
   ========================================================================== */

function setupAllGameListeners() {
    document.getElementById('to-combat-btn').addEventListener('click', () => showScreen('dragon-select-screen'));
    document.getElementById('from-select-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    
    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
        showScreen('info-screen');
    });
    
    document.getElementById('squad-info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = typeof getTownText === 'function' ? getTownText('squadInfo') : '';
        showScreen('info-screen');
    });
    
    document.getElementById('from-info-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    
    document.getElementById('to-forge-btn').addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('forge'); });
    document.getElementById('to-alchemy-btn').addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('alchemy'); });
    document.getElementById('to-squad-btn').addEventListener('click', () => showScreen('squad-screen'));
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('close-squad-btn').addEventListener('click', () => showScreen('main-menu'));

    document.getElementById('mode-buy-btn').addEventListener('click', () => {
        if (currentOpenedModeKey && typeof buyTownBuilding === 'function') {
            if (buyTownBuilding(currentOpenedModeKey)) {
                alert("Здание успешно восстановлено древней магией цитадели!");
                if (typeof openModeDescription === 'function') openModeDescription(currentOpenedModeKey);
            } else {
                alert("Недостаточно золота для выкупа! Требуется 🪙 500.");
            }
        }
    });

    document.getElementById('mode-process-btn').addEventListener('click', () => {
        if (currentOpenedModeKey && typeof openCraftSelectionMenu === 'function') {
            openCraftSelectionMenu(currentOpenedModeKey);
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
        document.getElementById('combat-help-text-container').innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
        document.getElementById('combat-help-screen').style.display = 'flex';
    });
    document.getElementById('close-combat-help-btn').addEventListener('click', () => {
        document.getElementById('combat-help-screen').style.display = 'none';
    });
}
