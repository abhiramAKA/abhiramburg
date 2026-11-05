/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА ГОРОДА И СТРОИТЕЛЬСТВА ЗА ЗОЛОТО (НОВЫЙ МОДУЛЬ - v0.8.6-BETA)
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

function getBuildingLevel(buildingId) {
    const lvl = localStorage.getItem(`khamach_build_${buildingId}`);
    return lvl ? parseInt(lvl) : 0;
}

function upgradeBuilding(buildingId) {
    const currentLvl = getBuildingLevel(buildingId);
    const goldCost = 150; // Фиксированная стоимость постройки уровня
    const currentGold = getPlayerGold();

    if (currentGold >= goldCost) {
        localStorage.setItem('khamach_gold', currentGold - goldCost);
        localStorage.setItem(`khamach_build_${buildingId}`, currentLvl + 1);
        updateTownGoldDisplay();
        return true;
    }
    return false;
}

function updateTownGoldDisplay() {
    const goldElements = document.querySelectorAll('.gold-counter-display');
    goldElements.forEach(el => {
        el.innerText = `🪙 ${getPlayerGold()} Золота`;
    });
}
