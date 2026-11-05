/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ТРЕНИРОВКИ ВОИНОВ ЗА ТРОФЕЙНЫЕ НИШТЯКИ (v2.3.0-BETA)
   ========================================================================== */

function getHeroUpgradeGoldCost(heroId, currentLvl) {
    if (currentLvl >= 15) return 0;
    if (currentLvl === 0) return 100; 
    return currentLvl * 250;
}

function getHeroResourceKey(heroId) {
    if (heroId === 'tank') return 'plasma';
    if (heroId === 'damage') return 'blood';
    if (heroId === 'archer') return 'scale'; // Заменено на scale
    return 'tears';
}

function getHeroResourceName(heroId) {
    if (heroId === 'tank') return '🛡️ Плазма';
    if (heroId === 'damage') return '🔥 Кровь';
    if (heroId === 'archer') return '🪶 Чешуя'; // Заменено на Чешую 🪶
    return '💚 Слезы';
}

function initSquadModuleListeners() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleHeroLevelUpClick(id));
        }
    });
}

function updateSquadButtonsDOM() {
    const heroes = [
        { id: 'tank', btnId: 'upgrade-tank-btn', name: '🛡️ Прокачать Танка' },
        { id: 'damage', btnId: 'upgrade-damage-btn', name: '🔥 Прокачать Дамагера' },
        { id: 'archer', btnId: 'upgrade-archer-btn', name: '⚡ Прокачать Лучника' },
        { id: 'mage', btnId: 'upgrade-mage-btn', name: '💚 Прокачать Мага' }
    ];

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    heroes.forEach(h => {
        const btn = document.getElementById(h.btnId);
        if (!btn) return;

        const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(h.id) : 0;
        
        if (lvl >= 15) {
            btn.innerText = `${h.name} (Макс. Ур. 15)`;
            btn.classList.add('disabled');
            return;
        }

        const goldCost = getHeroUpgradeGoldCost(h.id, lvl);
        const resKey = getHeroResourceKey(h.id);
        const resName = getHeroResourceName(h.id);
        const currentResCount = typeof getPlayerResource === 'function' ? getPlayerResource(resKey) : 0;

        btn.innerText = `${h.name} (Ур. ${lvl} → ${lvl + 1}) — ${goldCost} 🪙 + 1 ${resName} (Есть: ${currentResCount})`;

        if (currentGold < goldCost || currentResCount < 1) {
            btn.classList.add('disabled');
        } else {
            btn.classList.remove('disabled');
        }
    });
}

function handleHeroLevelUpClick(heroId) {
    const lvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(heroId) : 0;
    if (lvl >= 15) return;

    const goldCost = getHeroUpgradeGoldCost(heroId, lvl);
    const resKey = getHeroResourceKey(heroId);
    
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const currentResCount = typeof getPlayerResource === 'function' ? getPlayerResource(resKey) : 0;

    if (currentGold < goldCost) { alert(`Недостаточно золота! Нужно 🪙 ${goldCost}.`); return; }
    if (currentResCount < 1) { alert(`Недостаточно материалов! Требуется 1 ед. ресурса: ${getHeroResourceName(heroId)}.`); return; }

    localStorage.setItem('khamach_gold', currentGold - goldCost);
    localStorage.setItem(`khamach_res_${resKey}`, currentResCount - 1);
    localStorage.setItem(`khamach_build_${heroId}`, lvl + 1);
    
    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    updateSquadButtonsDOM();
    
    alert(`Уровень героя успешно повышен! Текущий ранг: ${lvl + 1}.`);
}
