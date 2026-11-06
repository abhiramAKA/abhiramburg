/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (ИСПРАВЛЕН - v4.7.2-BETA)
   ========================================================================== */

window.closeModeDescriptionUnified = function() {
    const squadScreen = document.getElementById('squad-screen');
    const isInsideSquad = (squadScreen && squadScreen.style.display !== 'none') || 
                          ['tank', 'damage', 'archer', 'mage', 'forge', 'alchemy'].includes(currentOpenedModeKey);
    
    if (currentOpenedModeKey === 'clans') {
        showScreen('main-menu');
    } else if (isInsideSquad) {
        showScreen('squad-screen');
    } else {
        showScreen('main-menu');
    }
};

function setupAllGameListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) toCombatBtn.addEventListener('click', () => showScreen('dragon-select-screen'));

    const fromSelectBtn = document.getElementById('from-select-to-menu-btn');
    if (fromSelectBtn) fromSelectBtn.addEventListener('click', () => showScreen('main-menu'));
    
    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            const textContainer = document.getElementById('info-screen-text');
            if (textContainer) textContainer.innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
            showScreen('info-screen');
        });
    }
    
    const fromInfoBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoBtn) fromInfoBtn.addEventListener('click', () => showScreen('main-menu'));
    
    const toSettingsBtn = document.getElementById('to-settings-btn');
    if (toSettingsBtn) {
        toSettingsBtn.addEventListener('click', () => {
            document.getElementById('volume-music-slider').value = (parseFloat(localStorage.getItem('khamach_vol_music') || '0.5') * 100);
            document.getElementById('volume-fx-slider').value = (parseFloat(localStorage.getItem('khamach_vol_fx') || '0.7') * 100);
            if (typeof initAudioContext === 'function') initAudioContext();
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('settings-screen').style.display = 'flex';
        });
    }

    const musicSlider = document.getElementById('volume-music-slider');
    if (musicSlider) {
        musicSlider.addEventListener('input', (e) => {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('music', e.target.value);
        });
    }
    
    const fxSlider = document.getElementById('volume-fx-slider');
    if (fxSlider) {
        fxSlider.addEventListener('input', (e) => {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('fx', e.target.value);
        });
        fxSlider.addEventListener('change', () => {
            if (typeof playMatch3Sound === 'function') playMatch3Sound('swap');
        });
    }

    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            document.getElementById('settings-screen').style.display = 'none';
            document.getElementById('main-menu').style.display = 'flex';
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
        });
    }
    
    const toClansBtn = document.getElementById('to-clans-btn');
    if (toClansBtn) toClansBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('clans'); });
    
    const toSquadBtn = document.getElementById('to-squad-btn');
    if (toSquadBtn) toSquadBtn.addEventListener('click', () => showScreen('squad-screen'));

    // ИСПРАВЛЕНО: Кнопка Отряд вызывает меню взаимодействия с бойцами, а не Склад!
    const toStorageBtn = document.getElementById('to-storage-btn');
    if (toStorageBtn) {
        toStorageBtn.onclick = function() {
            if (typeof updateSquadHeroesSpecScreenDOM === 'function') updateSquadHeroesSpecScreenDOM();
            showScreen('squad-heroes-spec-screen');
        };
    }
    
    const closeHeroesSpecBtn = document.getElementById('close-heroes-spec-btn');
    if (closeHeroesSpecBtn) closeHeroesSpecBtn.onclick = function() { showScreen('main-menu'); };

    const closeStorageBtn = document.getElementById('close-storage-btn');
    if (closeStorageBtn) closeStorageBtn.onclick = function() { showScreen('main-menu'); };

    const toMissionsBtn = document.getElementById('to-missions-btn');
    if (toMissionsBtn) toMissionsBtn.addEventListener('click', () => showScreen('missions-screen'));
    
    const closeMissionsBtn = document.getElementById('close-missions-btn');
    if (closeMissionsBtn) closeMissionsBtn.addEventListener('click', () => showScreen('main-menu'));

    const toChronicleBtn = document.getElementById('to-chronicle-btn');
    if (toChronicleBtn) toChronicleBtn.addEventListener('click', () => showScreen('chronicle-screen'));

    const closeChronicleBtn = document.getElementById('close-chronicle-btn');
    if (closeChronicleBtn) closeChronicleBtn.addEventListener('click', () => showScreen('main-menu'));

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
        });
    }

    const clearChronicleBtn = document.getElementById('clear-chronicle-btn');
    if (clearChronicleBtn) {
        clearChronicleBtn.addEventListener('click', () => {
            if (confirm("Очистить все записи в Летописи Цитадели?")) {
                localStorage.setItem('khamach_chronicle_logs', JSON.stringify());
                if (typeof renderChronicleDOM === 'function') renderChronicleDOM();
            }
        });
    }

    const goldDisplayLink = document.getElementById('main-gold-display');
    if (goldDisplayLink) {
        goldDisplayLink.addEventListener('click', () => {
            if (typeof updateStorageScreenDOM === 'function') updateStorageScreenDOM();
            showScreen('storage-screen');
        });
    }

    const teamFatigueBtn = document.getElementById('team-fatigue-display');
    if (teamFatigueBtn) {
        teamFatigueBtn.addEventListener('click', () => {
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            const screen = document.getElementById('squad-fatigue-screen');
            if (screen) screen.style.display = 'flex';
        });
    }
    
    const closeFatigueBtn = document.getElementById('close-fatigue-screen-btn');
    if (closeFatigueBtn) {
        closeFatigueBtn.addEventListener('click', () => {
            const screen = document.getElementById('squad-fatigue-screen');
            if (screen) screen.style.display = 'none';
        });
    }

    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
    setupCombatHelpListeners();
}

function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    if (combatHelpBtn) {
        combatHelpBtn.onclick = function() {
            const container = document.getElementById('combat-help-text-container');
            if (container) container.innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
            const screen = document.getElementById('combat-help-screen');
            if (screen) screen.style.display = 'flex';
        };
    }
    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    if (closeCombatHelpBtn) {
        closeCombatHelpBtn.onclick = function() {
            const screen = document.getElementById('combat-help-screen');
            if (screen) screen.style.display = 'none';
        };
    }
    const escapeTopBtn = document.getElementById('combat-escape-top-btn');
    if (escapeTopBtn) {
        escapeTopBtn.onclick = function() {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
        };
    }
    const closeTutorialBtn = document.getElementById('close-combat-tutorial-btn');
    if (closeTutorialBtn) {
        closeTutorialBtn.onclick = function() {
            localStorage.setItem('khamach_combat_tutorial_done', 'true');
            if (typeof isBoardLocked !== 'undefined') isBoardLocked = false;
            const screen = document.getElementById('combat-welcome-tutorial-screen');
            if (screen) screen.style.display = 'none';
        };
    }
}
