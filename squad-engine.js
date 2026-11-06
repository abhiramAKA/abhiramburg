/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ И СТРОИТЕЛЬСТВА В ОКНЕ ЦИТАДЕЛИ (v4.9.13-BETA)
   ========================================================================== */

function setupSquadInterfaceListeners() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) btn.onclick = function() { if (typeof openModeDescription === 'function') openModeDescription(id); };
    });
    
    const alchemyBtn = document.getElementById('city-alchemy-btn');
    if (alchemyBtn) alchemyBtn.onclick = function() { if (typeof openModeDescription === 'function') openModeDescription('alchemy'); };

    const closeBtn = document.getElementById('close-squad-btn');
    if (closeBtn) closeBtn.onclick = function() { showScreen('main-menu'); };

    const globalBuyBtn = document.getElementById('mode-buy-btn');
    if (globalBuyBtn) {
        globalBuyBtn.onclick = function() {
            executeUnifiedBuildingTransaction();
        };
    }

    const squadHelpBtn = document.getElementById('squad-help-btn');
    if (squadHelpBtn) {
        squadHelpBtn.onclick = function() {
            const container = document.getElementById('squad-help-popup-text');
            if (container && typeof TOWN_BUILDING_PRICES !== 'undefined') {
                let html = '<div style="display:flex; flex-direction:column; gap:3px;">';
                for(let i=1; i<=15; i++) {
                    html += `<div style="display:flex; justify-content:space-between; border-bottom:1px dashed #3a3025; padding-bottom:1px;"><span>Уровень ${i}:</span><strong style="color:#ffd700;">🪙 ${TOWN_BUILDING_PRICES[i].toLocaleString('ru-RU')}</strong></div>`;
                }
                html += '</div>';
                container.innerHTML = html;
            }
            const popup = document.getElementById('squad-help-popup-screen');
            if (popup) popup.style.display = 'flex';
        };
    }

    const closePopupBtn = document.getElementById('close-squad-help-popup-btn');
    if (closePopupBtn) {
        closePopupBtn.onclick = function() {
            const popup = document.getElementById('squad-help-popup-screen');
            if (popup) popup.style.display = 'none';
        };
    }
}

function executeUnifiedBuildingTransaction() {
    if (!currentOpenedModeKey) return;
    
    const bldId = (['tank', 'damage', 'archer', 'mage'].includes(currentOpenedModeKey)) 
        ? currentOpenedModeKey 
        : (currentOpenedModeKey === 'alchemy' ? 'alchemy' : null);
        
    if (!bldId) return;

    const currentBldLvl = parseInt(localStorage.getItem(`khamach_build_${bldId}`) || '0');
    if (currentBldLvl >= 15) return;

    const nextLvl = currentBldLvl + 1;
    const cost = TOWN_BUILDING_PRICES[nextLvl];
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    if (currentGold < cost) {
        alert(`Недостаточно средств в казне! Требуется 🪙 ${cost.toLocaleString('ru-RU')}.`);
        return;
    }

    localStorage.setItem('khamach_gold', currentGold - cost);
    localStorage.setItem(`khamach_build_${bldId}`, nextLvl);
    if (bldId !== 'alchemy') {
        localStorage.setItem(`khamach_squad_build_${bldId}`, 'true');
    }

    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    updateSquadVisualStyles();
    
    alert(`Модернизация строения успешно завершена! Достигнут ${nextLvl} уровень.`);
    if (typeof openModeDescription === 'function') openModeDescription(currentOpenedModeKey);
}

function updateSquadVisualStyles() {
    const ids = ['tank', 'damage', 'archer', 'mage', 'alchemy'];
    ids.forEach(id => {
        let btnId = id === 'alchemy' ? 'city-alchemy-btn' : `upgrade-${id}-btn`;
        const btn = document.getElementById(btnId);
        if (!btn) return;

        const currentLvl = parseInt(localStorage.getItem(`khamach_build_${id}`) || '0');
        
        if (currentLvl > 0) {
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
            if (id === 'alchemy') btn.innerText = `🧪 Лаборатория алхимии [Ур. ${currentLvl}]`;
        } else {
            btn.style.background = "";
            btn.style.borderColor = "";
            if (id === 'alchemy') btn.innerText = `🧪 Лаборатория алхимии`;
        }
    });
}
