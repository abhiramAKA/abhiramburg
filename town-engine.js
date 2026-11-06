/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v3.8.0-BETA)
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

window.updateTownGoldDisplay = function() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${window.getPlayerGold()} Золота`; 
    });
    
    const tFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_tank') || '0'));
    const dFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_damage') || '0'));
    const aFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_archer') || '0'));
    const mFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_mage') || '0'));
    
    // 1. Вывод чистого значка и среднего процента усталости в Главное Меню
    const fatigueContainer = document.getElementById('team-fatigue-display');
    if (fatigueContainer) {
        const averageFatigue = Math.round((tFat + dFat + aFat + mFat) / 4);
        fatigueContainer.innerHTML = `🥱 ${averageFatigue}%`;
    }

    // 2. Наполнение списка индивидуальной усталости четырех стихий
    const listContainer = document.getElementById('individual-fatigue-list-container');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🛡️ Защитник (Земля):</span><strong>${tFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🔥 Воин (Огонь):</span><strong>${dFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>⚡ Стрелок (Молния):</span><strong>${aFat}%</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>💚 Маг (Жизнь):</span><strong>${mFat}%</strong></div>
        `;
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
