/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ОБРАБОТЧИКОВ ИНТЕРФЕЙСА (ОБНОВЛЕН - v3.2.0-BETA)
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
            document.getElementById('eq-low-slider').value = parseInt(localStorage.getItem('khamach_eq_low') || '0');
            document.getElementById('eq-mid-slider').value = parseInt(localStorage.getItem('khamach_eq_mid') || '3');
            document.getElementById('eq-high-slider').value = parseInt(localStorage.getItem('khamach_eq_high') || '0');
            
            if (typeof initAudioContext === 'function') initAudioContext();
            
            document.getElementById('main-menu').style.display = 'none';
            document.getElementById('settings-screen').style.display = 'flex';
        });
    }

    document.getElementById('volume-music-slider').addEventListener('input', (e) => {
        if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('music', e.target.value);
    });
    document.getElementById('volume-fx-slider').addEventListener('input', (e) => {
        if (typeof updateEngineVolumeValues === 'function') updateEngineVolumeValues('fx', e.target.value);
    });
    document.getElementById('eq-low-slider').addEventListener('input', (e) => {
        if (typeof changeEqualizerGain === 'function') changeEqualizerGain('low', parseInt(e.target.value));
    });
    document.getElementById('eq-mid-slider').addEventListener('input', (e) => {
        if (typeof changeEqualizerGain === 'function') changeEqualizerGain('mid', parseInt(e.target.value));
    });
    document.getElementById('eq-high-slider').addEventListener('input', (e) => {
        if (typeof changeEqualizerGain === 'function') changeEqualizerGain('high', parseInt(e.target.value));
    });

    document.getElementById('close-settings-btn').addEventListener('click', () => {
        document.getElementById('settings-screen').style.display = 'none';
        document.getElementById('main-menu').style.display = 'flex';
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    });
    
    document.getElementById('to-forge-btn').addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('forge'); });
    document.getElementById('to-alchemy-btn').addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('alchemy'); });
    document.getElementById('to-clans-btn').addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('clans'); });
    document.getElementById('to-squad-btn').addEventListener('click', () => showScreen('squad-screen'));
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => showScreen('main-menu'));

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) {
                if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
                showScreen('main-menu');
            }
        });
    }

    // Обработчики окна склада цитадели
    const toStorageBtn = document.getElementById('to-storage-btn');
    if (toStorageBtn) toStorageBtn.addEventListener('click', () => showScreen('storage-screen'));
    
    const closeStorageBtn = document.getElementById('close-storage-btn');
    if (closeStorageBtn) closeStorageBtn.addEventListener('click', () => showScreen('main-menu'));

    // Обработчики доски городских поручений
    const toMissionsBtn = document.getElementById('to-missions-btn');
    if (toMissionsBtn) toMissionsBtn.addEventListener('click', () => showScreen('missions-screen'));
    
    const closeMissionsBtn = document.getElementById('close-missions-btn');
    if (closeMissionsBtn) closeMissionsBtn.addEventListener('click', () => showScreen('main-menu'));
}

function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            const container = document.getElementById('combat-help-text-container');
            if (container) container.innerHTML = typeof getTownText === 'function' ? getTownText('combatHelp') : '';
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
