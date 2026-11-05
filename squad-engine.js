/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ВОЕННОГО ЛАГЕРЯ И ОТРАДА (НОВЫЙ МОДУЛЬ - v0.9.6-BETA)
   ========================================================================== */

function initSquadModuleListeners() {
    const upgradeTank = document.getElementById('upgrade-tank-btn');
    const upgradeDamage = document.getElementById('upgrade-damage-btn');
    const upgradeArcher = document.getElementById('upgrade-archer-btn');
    const upgradeMage = document.getElementById('upgrade-mage-btn');

    if (upgradeTank) upgradeTank.addEventListener('click', () => handleSquadUpgradeClick('tank'));
    if (upgradeDamage) upgradeDamage.addEventListener('click', () => handleSquadUpgradeClick('damage'));
    if (upgradeArcher) upgradeArcher.addEventListener('click', () => handleSquadUpgradeClick('archer'));
    if (upgradeMage) upgradeMage.addEventListener('click', () => handleSquadUpgradeClick('mage'));
}

function updateSquadButtonsDOM() {
    const buildings = [
        { id: 'tank', btnId: 'upgrade-tank-btn', name: '🛡️ Казармы Танка' },
        { id: 'damage', btnId: 'upgrade-damage-btn', name: '🔥 Плац Дамагера' },
        { id: 'archer', btnId: 'upgrade-archer-btn', name: '⚡ Стрельбище Лучника' },
        { id: 'mage', btnId: 'upgrade-mage-btn', name: '💚 Обитель Мага' }
    ];

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 150;

    buildings.forEach(b => {
        const btn = document.getElementById(b.btnId);
        if (!btn) return;

        const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(b.id) : 0;
        
        if (lvl >= 15) {
            btn.innerText = `${b.name} (Макс. Ур. 15)`;
            btn.classList.add('disabled');
        } else {
            btn.innerText = `${b.name} (Ур. ${lvl} → ${lvl + 1}) — 150 🪙`;
            if (currentGold < cost) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        }
    });
}

function handleSquadUpgradeClick(buildingId) {
    const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(buildingId) : 0;
    if (lvl >= 15) return;

    if (typeof upgradeBuilding === 'function' && upgradeBuilding(buildingId)) {
        updateSquadButtonsDOM();
        alert("Строительство военного лагеря завершено успешно!");
    } else {
        alert("Недостаточно золота для апгрейда лагеря! Отправляйтесь в рейд.");
    }
}
