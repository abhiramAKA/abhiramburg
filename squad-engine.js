/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ТРЕНИРОВКИ ВОИНОВ ЗА ТРОФЕЙНЫЕ НИШТЯКИ (v2.4.0-BETA)
   ========================================================================== */

function getBuildingTypeName(id) {
    if (id === 'tank') return '⛺ Тренировочный лагерь';
    if (id === 'damage') return '🛡️ Казармы';
    if (id === 'archer') return '⚡ Стрельбище';
    return '💚 Обитель';
}

function initSquadModuleListeners() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleBuildingPurchaseClick(id));
        }
    });
}

function updateSquadButtonsDOM() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (!btn) return;

        const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
        const name = getBuildingTypeName(id);

        if (isPurchased) {
            btn.innerText = `${name} (⚙️ ГОТОВО / ВОЗВЕДЕНО)`;
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
        } else {
            btn.innerText = `${name} — 100 🪙`;
            btn.style.background = ""; // Возвращаем готический стандарт
            btn.style.borderColor = "";
            
            if (currentGold < 100) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        }
    });
}

function handleBuildingPurchaseClick(id) {
    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    const name = getBuildingTypeName(id);

    if (isPurchased) {
        alert(`Здание «${name}» уже успешно возведено и функционирует в вашей цитадели!`);
        return;
    }

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 100;

    if (confirm(`Вы хотите возвести «${name}» за 100 🪙 золота?`)) {
        if (currentGold >= cost) {
            localStorage.setItem('khamach_gold', currentGold - cost);
            localStorage.setItem(`khamach_squad_build_${id}`, 'true');
            localStorage.setItem(`khamach_build_${id}`, 1); // Активируем 1 уровень для боевых расчетов
            
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            updateSquadButtonsDOM();
            
            alert(`Строительство здания «${name}» успешно завершено!`);
        } else {
            alert(`Недостаточно золота! Чтобы выкупить постройку, требуется 🪙 ${cost}.`);
        }
    }
}
