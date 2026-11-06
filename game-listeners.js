/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (ИСПРАВЛЕН - v4.9.16-BETA)
   ========================================================================== */

window.closeModeDescriptionUnified = function() {
    const squadScreen = document.getElementById('squad-screen');
    const activeKey = window.currentOpenedModeKey || '';
    const isInsideSquad = (squadScreen && squadScreen.style.display !== 'none') || 
                          ['tank', 'damage', 'archer', 'mage', 'forge', 'alchemy'].includes(activeKey);
    
    if (activeKey === 'clans') {
        showScreen('main-menu');
    } else if (isInsideSquad) {
        showScreen('squad-screen');
    } else {
        showScreen('main-menu');
    }
};

function setupAllGameListeners() {
    document.onclick = null;
    document.body.onclick = null;

    // ПАТТЕРН НАДЁЖНОГО ПЕРЕХВАТА КЛИКОВ ЧЕРЕЗ CLOSEST
    const mainMenuEl = document.getElementById('main-menu');
    if (mainMenuEl) {
        mainMenuEl.onclick = function(e) {
            const clansBtn = e.target.closest('#to-clans-btn');
            const combatBtn = e.target.closest('#to-combat-btn');
            const settingsBtn = e.target.closest('#to-settings-btn');
            const infoBtn = e.target.closest('#info-btn');
            const squadBtn = e.target.closest('#to-squad-btn');
            const storageBtn = e.target.closest('#to-storage-btn');
            const missionsBtn = e.target.closest('#to-missions-btn');
            const chronicleBtn = e.target.closest('#to-chronicle-btn');

            if (clansBtn) {
                e.preventDefault(); e.stopPropagation();
                if (typeof openModeDescription === 'function') openModeDescription('clans');
            } else if (combatBtn) {
                showScreen('dragon-select-screen');
            } else if (settingsBtn) {
                document.getElementById('volume-music-slider').value = (parseFloat(localStorage.getItem('khamach_vol_music') || '0.5') * 100);
                document.getElementById('volume-fx-slider').value = (parseFloat(localStorage.getItem('khamach_vol_fx') || '0.7') * 100);
                if (typeof initAudioContext === 'function') initAudioContext();
                document.getElementById('main-menu').style.display = 'none';
                document.getElementById('settings-screen').style.display = 'flex';
            } else if (infoBtn) {
                const textContainer = document.getElementById('info-screen-text');
                if (textContainer) textContainer.innerHTML = typeof getTownText === 'function' ? getTownText('mainInfo') : '';
                showScreen('info-screen');
            } else if (squadBtn) {
                showScreen('squad-screen');
            } else if (storageBtn) {
                if (typeof updateSquadHeroesSpecScreenDOM === 'function') updateSquadHeroesSpecScreenDOM();
                showScreen('squad-heroes-spec-screen');
            } else if (missionsBtn) {
                showScreen('missions-screen');
            } else if (chronicleBtn) {
                showScreen('chronicle-screen');
            }
        };
    }

    const fromSelectBtn = document.getElementById('from-select-to-menu-btn');
    if (fromSelectBtn) fromSelectBtn.onclick = function() { showScreen('main-menu'); };
    
    const fromInfoBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoBtn) fromInfoBtn.onclick = function() { showScreen('main-menu'); };

    const musicSlider = document.getElementById('volume-music-slider');
    if (musicSlider) {
        musicSlider.oninput = function(e) {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('music', e.target.value);
        };
    }
    
    const fxSlider = document.getElementById('volume-fx-slider');
    if (fxSlider) {
        fxSlider.oninput = function(e) {
            if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('fx', e.target.value);
        };
        fxSlider.onchange = function() {
            if (typeof playMatch3Sound === 'function') playMatch3Sound('swap');
        };
    }

    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (closeSettingsBtn) {
        closeSettingsBtn.onclick = function() {
            document.getElementById('settings-screen').style.display = 'none';
            document.getElementById('main-menu').style.display = 'flex';
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
        };
    }
    
    const closeHeroesSpecBtn = document.getElementById('close-heroes-spec-btn');
    if (closeHeroesSpecBtn) closeHeroesSpecBtn.onclick = function() { showScreen('main-menu'); };

    const closeStorageBtn = document.getElementById('close-storage-btn');
    if (closeStorageBtn) closeStorageBtn.onclick = function() { showScreen('main-menu'); };

    const closeMissionsBtn = document.getElementById('close-missions-btn');
    if (closeMissionsBtn) closeMissionsBtn.onclick = function() { showScreen('main-menu'); };

    const closeChronicleBtn = document.getElementById('close-chronicle-btn');
    if (closeChronicleBtn) closeChronicleBtn.onclick = function() { showScreen('main-menu'); };

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.onclick = function() {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
        };
    }

    const clearChronicleBtn = document.getElementById('clear-chronicle-btn');
    if (clearChronicleBtn) {
        clearChronicleBtn.onclick = function() {
            if (confirm("Очистить все записи в Летописи Цитадели?")) {
                localStorage.setItem('khamach_chronicle_logs', JSON.stringify(new Array()));
                if (typeof renderChronicleDOM === 'function') renderChronicleDOM();
            }
        };
    }

    const goldDisplayLink = document.getElementById('main-gold-display');
    if (goldDisplayLink) {
        goldDisplayLink.onclick = function() {
            if (typeof updateStorageScreenDOM === 'function') updateStorageScreenDOM();
            showScreen('storage-screen');
        };
    }

    const teamFatigueBtn = document.getElementById('team-fatigue-display');
    if (teamFatigueBtn) {
        teamFatigueBtn.onclick = function() {
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            const screen = document.getElementById('squad-fatigue-screen');
            if (screen) screen.style.display = 'flex';
        };
    }
    
    const closeFatigueBtn = document.getElementById('close-fatigue-screen-btn');
    if (closeFatigueBtn) {
        closeFatigueBtn.onclick = function() {
            const screen = document.getElementById('squad-fatigue-screen');
            if (screen) screen.style.display = 'none';
        };
    }

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
