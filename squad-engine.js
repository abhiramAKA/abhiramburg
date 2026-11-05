/* ==========================================================================
   КХАМАЧ — МОДУЛЬ МГНОВЕННОГО УЛУЧШЕНИЯ ВОЕННОГО ЛАГЕРЯ (v1.6.0-BETA)
   ========================================================================== */

function getBuildingUpgradeCost(buildingId, currentLvl) {
    const nextLvl = currentLvl + 1;
    if (nextLvl > 15) return 0;
    
    // Первый уровень по-прежнему дешевый для быстрых тестов
    if (nextLvl === 1) return 100;
    
    // Поздние уровни растут линейно: 250, 500, 750, 1000...
    return currentLvl * 250;
}

function initSquadModuleListeners() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleSquadUpgradeClick(id));
        }
    });
}

function updateSquadButtonsDOM() {
    const buildings = [
        { id: 'tank', btnId: 'upgrade-tank-btn', name: '🛡️ Казармы Танка' },
        { id: 'damage', btnId: 'upgrade-damage-btn', name: '🔥 Плац Дамагера' },
        { id: 'archer', btnId: 'upgrade-archer-btn', name: '⚡ Стрельбище Лучника' },
        { id: 'mage', btnId: 'upgrade-mage-btn', name: '💚 Обитель Мага' }
    ];

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    buildings.forEach(b => {
        const btn = document.getElementById(b.btnId);
        if (!btn) return;

        const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(b.id) : 0;
        
        if (lvl >= 15) {
            btn.innerText = `${b.name} (Макс. Ур. 15)`;
            btn.classList.add('disabled');
            return;
        }

        const cost = getBuildingUpgradeCost(b.id, lvl);
        btn.innerText = `${b.name} (Ур. ${lvl} → ${lvl + 1}) — ${cost} 🪙`;

        if (currentGold < cost) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

function handleSquadUpgradeClick(buildingId) {
    const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(buildingId) : 0;
    if (lvl >= 15) return;

    const cost = getBuildingUpgradeCost(buildingId, lvl);
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    if (currentGold >= cost) {
        localStorage.setItem('khamach_gold', currentGold - cost);
        localStorage.setItem(`khamach_build_${buildingId}`, lvl + 1);
        
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
        updateSquadButtonsDOM();
        
        alert(`Мгновенное улучшение завершено! ${buildingId} теперь ${lvl + 1} уровня.`);
    } else {
        alert(`Недостаточно золота для мгновенной постройки! Требуется 🪙 ${cost}.`);
    }
}
