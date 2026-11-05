/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА ГОРОДА И СТРОИТЕЛЬСТВА ЗА ЗОЛОТО (ОБНОВЛЕН - v1.0.0-BETA)
   ========================================================================== */

function getPlayerGold() {
    const gold = localStorage.getItem('khamach_gold');
    return gold ? parseInt(gold) : 0;
}

function addPlayerGold(amount) {
    const currentGold = getPlayerGold();
    localStorage.setItem('khamach_gold', currentGold + amount);
    updateTownGoldDisplay();
}

function getPlayerResource(resKey) {
    const res = localStorage.getItem(`khamach_res_${resKey}`);
    return res ? parseInt(res) : 0;
}

function addPlayerResource(resKey, amount) {
    const current = getPlayerResource(resKey);
    localStorage.setItem(`khamach_res_${resKey}`, current + amount);
}

function isBuildingPurchased(buildingId) {
    return localStorage.getItem(`khamach_purchased_${buildingId}`) === 'true';
}

function buyTownBuilding(buildingId) {
    const cost = 500;
    const currentGold = getPlayerGold();
    if (currentGold >= cost && !isBuildingPurchased(buildingId)) {
        localStorage.setItem('khamach_gold', currentGold - cost);
        localStorage.setItem(`khamach_purchased_${buildingId}`, 'true');
        updateTownGoldDisplay();
        return true;
    }
    return false;
}

function getBuildingLevel(buildingId) {
    const lvl = localStorage.getItem(`khamach_build_${buildingId}`);
    return lvl ? parseInt(lvl) : 0;
}

function upgradeBuilding(buildingId) {
    const currentLvl = getBuildingLevel(buildingId);
    const goldCost = 150; 
    const currentGold = getPlayerGold();

    if (currentGold >= goldCost) {
        localStorage.setItem('khamach_gold', currentGold - goldCost);
        localStorage.setItem(`` + `khamach_build_${buildingId}`, currentLvl + 1);
        updateTownGoldDisplay();
        return true;
    }
    return false;
}

function processCraftResource(modeKey) {
    const goldCost = 50;
    const currentGold = getPlayerGold();
    const resKey = modeKey === 'forge' ? 'scales' : 'blood';
    const currentRes = getPlayerResource(resKey);

    if (currentGold < goldCost) {
        alert("Недостаточно золота для оплаты работы мастера (требуется 🪙 50)!");
        return false;
    }
    if (currentRes < 1) {
        alert("У вас нет материалов для переработки! Добудьте их в рейдах на Драконов.");
        return false;
    }

    localStorage.setItem('khamach_gold', currentGold - goldCost);
    localStorage.setItem(`khamach_res_${resKey}`, currentRes - 1);
    
    const perkKey = modeKey === 'forge' ? 'khamach_perk_shield' : 'khamach_perk_sp';
    const currentPerk = parseInt(localStorage.getItem(perkKey) || '0');
    localStorage.setItem(perkKey, currentPerk + 1);
    
    updateTownGoldDisplay();
    return true;
}

function getMetaPerkValue(perkKey) {
    return parseInt(localStorage.getItem(perkKey) || '0');
}

function updateTownGoldDisplay() {
    const goldElements = document.querySelectorAll('.gold-counter-display');
    goldElements.forEach(el => {
        el.innerText = `🪙 ${getPlayerGold()} Золота`;
    });
}
