/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v3.7.4-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«КХАМАЧ: Восхождение Рейдов»</strong></p><p>В недрах древних подземелий Абхирамбурга пробудился великий закон змея. Соберите свой верный отряд, заряжайте шкалы суперсил через камни стихий и сокрушите огнедышащих тварей в пошаговых тактических битвах Горнила!</p>`,
    squadInfo: `<p><strong>«Военная Цитадель Казарм»:</strong></p><p>Здесь сосредоточены тренировочные лагеря, полигоны и алтари ваших героев. Развивайте инфраструктуру отряда, чтобы открыть скрытые вехи развития и многократно приумножить характеристики воинов перед вылазкой в рейд.</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНЯ", reqText: "В полумраке кузницы тяжело вздыхают мехи. Здесь из костей и чешуи великих ящеров куется мифический доспех, не знающий износа.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Кузня открывается только на 12-м уровень развития отряда!</strong>", isLocked: true },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", buyText: "Полки уставлены древними фолиантами и склянками со светящимися эссенциями. Лаборатории требуется закупка редких алхимических реагентов за 100 🪙.", activeText: "Реагенты закуплены. Лаборатория Абхирамбурга полностью готова дистиллировать эссенции драконов.", isLocked: false },
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "Знамена великих гильдий замерли под сводами залов безмолвия. Здесь куется коллективное Величие фракций, координируются рейды и возводятся Врата Разломов в Мир 2.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!</strong>", isLocked: true }
};

window.getTownText = function(key) { return INLINE_TOWN_TEXTS[key] || ''; };

window.getPlayerGold = function() { return parseInt(localStorage.getItem('khamach_gold') || '0'); };
window.addPlayerGold = function(amount) { localStorage.setItem('khamach_gold', window.getPlayerGold() + amount); window.updateTownGoldDisplay(); };
window.getPlayerResource = function(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); };
window.addPlayerResource = function(key, amount) { localStorage.setItem(`khamach_res_${key}`, window.getPlayerResource(key) + amount); if (typeof window.updateTownGoldDisplay === 'function') window.updateTownGoldDisplay(); };
window.isBuildingPurchased = function(id) { return localStorage.getItem(`khamach_purchased_${id}`) === 'true'; };

window.buyTownBuilding = function(id) {
    const cost = 100; 
    if (window.getPlayerGold() >= cost && !window.isBuildingPurchased(id)) {
        localStorage.setItem('khamach_gold', window.getPlayerGold() - cost);
        localStorage.setItem(`khamach_purchased_${id}`, 'true');
        window.updateTownGoldDisplay();
        return true;
    }
    return false;
};

window.openModeDescription = function(modeKey) {
    currentOpenedModeKey = modeKey;
    const modeData = INLINE_MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    const buyBtn = document.getElementById('mode-buy-btn');
    const textEl = document.getElementById('mode-desc-text');
    
    if (modeData.isLocked) {
        textEl.innerHTML = `<p>${modeData.reqText}</p>`;
        buyBtn.style.display = 'none';
    } else {
        const purchased = window.isBuildingPurchased(modeKey);
        if (!purchased) {
            textEl.innerHTML = `<p>${modeData.buyText}</p>`;
            buyBtn.style.display = 'block';
            buyBtn.innerText = `🛒 ВЫКУПИТЬ ЛАБОРАТОРИЮ (100 🪙)`;
        } else {
            textEl.innerHTML = `<p>${modeData.activeText}</p><p style='color:#2ecc71;'>Лаборатория успешно функционирует в вашей цитадели!</p>`;
            buyBtn.style.display = 'none';
        }
    }
    showScreen('mode-desc-screen');
};

window.getBuildingLevel = function(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); };
window.getMetaPerkValue = function(key) { return parseInt(localStorage.getItem(key) || '0'); };

window.updateTownGoldDisplay = function() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${window.getPlayerGold()} Золота`; 
    });
    
    // Вычисление единой средней усталости всей команды
    const fatigueContainer = document.getElementById('team-fatigue-display');
    if (fatigueContainer) {
        const tFat = parseFloat(localStorage.getItem('khamach_fatigue_tank') || '0');
        const dFat = parseFloat(localStorage.getItem('khamach_fatigue_damage') || '0');
        const aFat = parseFloat(localStorage.getItem('khamach_fatigue_archer') || '0');
        const mFat = parseFloat(localStorage.getItem('khamach_fatigue_mage') || '0');
        
        const averageFatigue = Math.round((tFat + dFat + aFat + mFat) / 4);
        fatigueContainer.innerHTML = `🥱 Усталость команды: ${averageFatigue}%`;
    }
};

window.updateStorageScreenDOM = function() {
    const listContainer = document.getElementById('storage-resources-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="color: #e6c280; font-weight: bold; border-bottom: 1px solid #544432; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase; font-size: 13px;">📜 Материалы Хранилища:</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 14px; color: #cdb38c;">
            <div>🌋 Плазма древнего змея: <strong style="color:#fff; float: right;">${window.getPlayerResource('plasma')} шт.</strong></div>
            <div>🩸 Первородная кровь дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('blood')} шт.</strong></div>
            <div>🪶 Плотная чешуя ящера: <strong style="color:#fff; float: right;">${window.getPlayerResource('scale')} шт.</strong></div>
            <div>💧 Чистые слезы природы: <strong style="color:#fff; float: right;">${window.getPlayerResource('tears')} шт.</strong></div>
        </div>
    `;
};
