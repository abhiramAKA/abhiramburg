/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ И СТРОИТЕЛЬСТВА В ОКНЕ ЦИТАДЕЛИ (v4.4.0-BETA)
   ========================================================================== */

function setupSquadInterfaceListeners() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            // Перенаправление на единый готический менеджер описаний
            btn.addEventListener('click', () => {
                if (typeof openModeDescription === 'function') openModeDescription(id);
            });
        }
    });
    
    const forgeBtn = document.getElementById('city-forge-btn');
    if (forgeBtn) forgeBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('forge'); });
    
    const alchemyBtn = document.getElementById('city-alchemy-btn');
    if (alchemyBtn) alchemyBtn.addEventListener('click', () => { if (typeof openModeDescription === 'function') openModeDescription('alchemy'); });

    const closeBtn = document.getElementById('close-squad-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => showScreen('main-menu'));
    }

    // Перехват единой интерактивной кнопки покупки внутри окна описаний
    const globalBuyBtn = document.getElementById('mode-buy-btn');
    if (globalBuyBtn) {
        globalBuyBtn.onclick = function() {
            executeUnifiedBuildingTransaction();
        };
    }
}

function executeUnifiedBuildingTransaction() {
    if (!currentOpenedModeKey) return;
    
    // Проверяем, является ли открытый ключ персонажем отряда
    const isHeroType = ['tank', 'damage', 'archer', 'mage'].includes(currentOpenedModeKey);
    
    if (!isHeroType) {
        // Стандартный выкуп Лаборатории Алхимии
        if (typeof buyTownBuilding === 'function' && buyTownBuilding(currentOpenedModeKey)) {
            alert("Здание успешно выкуплено и введено в эксплуатацию!");
            if (typeof openModeDescription === 'function') openModeDescription(currentOpenedModeKey);
        } else {
            alert("Недостаточно золота в казне Цитадели! Требуется 100 🪙.");
        }
        return;
    }

    // Логика покупки/прокачки воинов через окно
    const id = currentOpenedModeKey;
    const loreKey = id === 'mage' ? 'damage_mage' : id;
    const data = SQUAD_HERO_LORE[loreKey];
    if (!data) return;

    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    if (!isPurchased) {
        const costBuild = 100;
        if (currentGold >= costBuild) {
            localStorage.setItem('khamach_gold', currentGold - costBuild);
            localStorage.setItem(`khamach_squad_build_${id}`, 'true');
            localStorage.setItem(`khamach_build_${id}`, 0);
            
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            updateSquadVisualStyles();
            alert(`Строительство постройки «${data.name}» завершено! Боец готов к тренировкам.`);
            if (typeof openModeDescription === 'function') openModeDescription(id);
        } else {
            alert(`Недостаточно золота! Требуется 100 🪙.`);
        }
        return;
    }

    const currentLvl = parseInt(localStorage.getItem(`khamach_build_${id}`) || '0');
    if (currentLvl >= 15) return;

    const nextLvl = currentLvl + 1;
    const costUpgradeGold = 150;
    const currentResource = typeof getPlayerResource === 'function' ? getPlayerResource(data.resourceKey) : 0;

    if (currentGold < costUpgradeGold) {
        alert(`Недостаточно золота! Требуется 150 🪙.`);
        return;
    }
    if (currentResource < 1) {
        alert(`Недостаточно трофеев дракона! Требуется 1 шт. ${data.resourceIcon} ${data.resourceName}`);
        return;
    }

    localStorage.setItem('khamach_gold', currentGold - costUpgradeGold);
    if (typeof addPlayerResource === 'function') addPlayerResource(data.resourceKey, -1);
    localStorage.setItem(`khamach_build_${id}`, nextLvl);

    if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    updateSquadVisualStyles();
    alert(`Боец успешно прошел тренировку! Текущий уровень: ${nextLvl}.`);
    if (typeof openModeDescription === 'function') openModeDescription(id);
}

function updateSquadVisualStyles() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (!btn) return;

        const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
        const loreKey = id === 'mage' ? 'damage_mage' : id;
        const data = SQUAD_HERO_LORE[loreKey];
        
        if (isPurchased) {
            const currentLvl = localStorage.getItem(`khamach_build_${id}`) || '0';
            btn.innerText = `${data.name} [Ур. ${currentLvl}]`;
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
        } else {
            btn.innerText = `${data.name} (Выкуп: 100 🪙)`;
            btn.style.background = "";
            btn.style.borderColor = "";
        }
    });
}
