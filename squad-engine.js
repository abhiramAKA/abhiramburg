/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ И СТРОИТЕЛЬСТВА В ОКНЕ ЦИТАДЕЛИ (v4.9.1-BETA)
   ========================================================================== */

function setupSquadInterfaceListeners() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.onclick = function() {
                if (typeof openModeDescription === 'function') openModeDescription(id);
            };
        }
    });
    
    const forgeBtn = document.getElementById('city-forge-btn');
    if (forgeBtn) forgeBtn.onclick = function() { if (typeof openModeDescription === 'function') openModeDescription('forge'); };
    
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
}

function executeUnifiedBuildingTransaction() {
    if (!currentOpenedModeKey) return;
    
    const isHeroType = ['tank', 'damage', 'archer', 'mage'].includes(currentOpenedModeKey);
    
    if (!isHeroType) {
        if (typeof buyTownBuilding === 'function' && buyTownBuilding(currentOpenedModeKey)) {
            alert("Здание успешно построено!");
            if (typeof openModeDescription === 'function') openModeDescription(currentOpenedModeKey);
        } else {
            alert("Недостаточно средств! Требуется 🪙 100.");
        }
        return;
    }

    const id = currentOpenedModeKey;
    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    if (!isPurchased) {
        const costBuild = 100;
        if (currentGold >= costBuild) {
            localStorage.setItem('khamach_gold', currentGold - costBuild);
            localStorage.setItem(`khamach_squad_build_${id}`, 'true');
            localStorage.setItem(`khamach_build_${id}`, '1');
            
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            updateSquadVisualStyles();
            alert(`Строительство успешно завершено! Открыт лимит прокачки бойца до 1 уровня.`);
            if (typeof openModeDescription === 'function') openModeDescription(id);
        } else {
            alert(`Недостаточно средств! Требуется 🪙 100.`);
        }
        return;
    }

    const currentBldLvl = parseInt(localStorage.getItem(`khamach_build_${id}`) || '0');
    if (currentBldLvl >= 15) return;

    const nextBldLvl = currentBldLvl + 1;
    const costUpgradeGold = 150;

    if (currentGold < costUpgradeGold) {
        alert(`Недостаточно средств! Требуется 🪙 150.`);
        return;
    }

    localStorage.setItem('khamach_gold', currentGold - costUpgradeGold);
    localStorage.setItem(`khamach_build_${id}`, nextBldLvl);

    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    updateSquadVisualStyles();
    alert(`Здание модернизировано! Потолок прокачки воина расширен до ${nextBldLvl} ур.`);
    if (typeof openModeDescription === 'function') openModeDescription(id);
}

function updateSquadVisualStyles() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (!btn) return;

        const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
        const loreKey = id === 'mage' ? 'damage_mage' : id;
        const data = typeof SQUAD_HERO_LORE !== 'undefined' ? SQUAD_HERO_LORE[loreKey] : { name: id };
        
        if (isPurchased) {
            const currentLvl = localStorage.getItem(`khamach_build_${id}`) || '1';
            btn.innerText = `${data.name} [Ур. ${currentLvl}]`;
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
        } else {
            btn.innerText = `${data.name} (🪙 100)`;
            btn.style.background = "";
            btn.style.borderColor = "";
        }
    });
}
