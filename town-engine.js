/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v4.9.0-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«КХАМАЧ: Восхождение Рейдов»</strong></p><p>В недрах древних подземелий Абхирамбурга пробудился великий закон змея. Соберите свой верный отряд, заряжайте шкалы суперсил через камни стихий и сокрушите огнедышащих тварей в пошаговых тактических битвах Горнила!</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНЯ", reqText: "В полумраке кузницы тяжело вздыхают мехи. Здесь из костей и чешуи великих ящеров куется мифический доспех, не знающий износа.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Кузня открывается только на 12-м уровне развития отряда!</strong>", isLocked: true },
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "Знамена великих гильдий замерли под сводами залов безмолвия. Здесь куется коллективное Величие фракций, координируются рейды и возводятся Врата Разломов в другие измерения.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!</strong>", isLocked: true },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", buyText: "Полки уставлены древними фолиантами и склянками со светящимися эссенциями. Лаборатории требуется постройка рунического очага реагентов за 100 🪙.", activeText: "Реагенты закуплены. Лаборатория полностью готова дистиллировать эссенции драконов.", isLocked: false, isHero: false },
    tank: { title: "🛡️ ГАРНИЗОН", isLocked: false, isHero: true, heroId: "tank" },
    damage: { title: "🔥 КАЗАРМЫ", isLocked: false, isHero: true, heroId: "damage" },
    archer: { title: "⚡ СТРЕЛЬБИЩЕ", isLocked: false, isHero: true, heroId: "archer" },
    mage: { title: "💚 ОБИТЕЛЬ", isLocked: false, isHero: true, heroId: "mage" }
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

window.updateTownGoldDisplay = function() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${window.getPlayerGold()} Монет`; 
    });
    
    const tFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_tank') || '0'));
    const dFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_damage') || '0'));
    const aFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_archer') || '0'));
    const mFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_mage') || '0'));
    
    const fatigueContainer = document.getElementById('team-fatigue-display');
    if (fatigueContainer) {
        const averageFatigue = Math.round((tFat + dFat + aFat + mFat) / 4);
        fatigueContainer.innerHTML = `🥱 ${averageFatigue}%`;
    }

    const listContainer = document.getElementById('individual-fatigue-list-container');
    if (listContainer) {
        listContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🛡️ Защитник:</span><strong>${tFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>🔥 Воин:</span><strong>${dFat}%</strong></div>
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid #3a3025; padding-bottom:4px;"><span>⚡ Стрелок:</span><strong>${aFat}%</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>💚 Маг:</span><strong>${mFat}%</strong></div>
        `;
    }
    if (typeof window.updateStorageScreenDOM === 'function') window.updateStorageScreenDOM();
};
