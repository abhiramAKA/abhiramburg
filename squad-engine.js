/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ И СТРОИТЕЛЬСТВА В ОКНЕ ЦИТАДЕЛИ (v4.2.0-BETA)
   ========================================================================== */

function setupSquadInterfaceListeners() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleSquadHeroClick(id));
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
}

function handleSquadHeroClick(id) {
    const loreKey = id === 'mage' ? 'damage_mage' : id;
    const data = SQUAD_HERO_LORE[loreKey];
    if (!data) return;

    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    if (!isPurchased) {
        const costBuild = 100;
        const textConfirm = `${data.title}\n\n${data.lore}\n\nЖелаете мгновенно возвести постройку «${data.name}» за 100 🪙 золота?`;
        
        if (confirm(textConfirm)) {
            if (currentGold >= costBuild) {
                localStorage.setItem('khamach_gold', currentGold - costBuild);
                localStorage.setItem(`khamach_squad_build_${id}`, 'true');
                localStorage.setItem(`khamach_build_${id}`, 0);
                
                if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
                updateSquadVisualStyles();
                alert(`Строительство постройки «${data.name}» успешно завершено! Открыты тренировки бойца.`);
            } else {
                alert(`Недостаточно золота в казне! Требуется 🪙 ${costBuild}.`);
            }
        }
        return;
    }

    const currentLvl = parseInt(localStorage.getItem(`khamach_build_${id}`) || '0');
    if (currentLvl >= 15) {
        alert(`${data.title}\n\nДостигнут максимальный уровень тренировок (15 ур)!\nТекущий бонус: ${data.statBonus}`);
        return;
    }

    const nextLvl = currentLvl + 1;
    const costUpgradeGold = 150; 
    const currentResource = typeof getPlayerResource === 'function' ? getPlayerResource(data.resourceKey) : 0;

    const textUpgrade = `${data.title}\nТекущий уровень: ${currentLvl} из 15\nМодификатор: ${data.statBonus}\n\nХотите повысить уровень бойца до ${nextLvl}-го?\n\nСтоимость тренировки:\n🪙 Золото: ${costUpgradeGold}\n${data.resourceIcon} ${data.resourceName}: 1 шт. (У вас: ${currentResource} шт.)`;

    if (confirm(textUpgrade)) {
        if (currentGold < costUpgradeGold) {
            alert(`Недостаточно золота! Требуется 🪙 ${costUpgradeGold}.`);
            return;
        }
        if (currentResource < 1) {
            alert(`Недостаточно трофеев! Требуется 1 шт. ${data.resourceIcon} ${data.resourceName}. Направляйтесь в боевой рейд!`);
            return;
        }

        localStorage.setItem('khamach_gold', currentGold - costUpgradeGold);
        if (typeof addPlayerResource === 'function') {
            addPlayerResource(data.resourceKey, -1);
        }
        localStorage.setItem(`khamach_build_${id}`, nextLvl);

        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
        updateSquadVisualStyles();
        
        alert(`Боец успешно прошел тренировку! Текущий уровень: ${nextLvl}.`);
    }
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
