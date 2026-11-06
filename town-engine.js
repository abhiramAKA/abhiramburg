/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v4.9.4-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«КХАМАЧ: Восхождение Рейдов»</strong></p><p>В недрах древних подземелий Абхирамбурга пробудился великий закон змея. Соберите свой верный отряд, заряжайте шкалы суперсил через камни стихий и сокрушите огнедышащих тварей в пошаговых тактических битвах Горнила!</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНЯ", reqText: "В полумраке кузницы тяжело вздыхают мехи. Здесь из костей и чешуи великих ящеров куется мифический доспех, не знающий износа.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Кузня открывается только на 12-м уровень развития отряда!</strong>", isLocked: true },
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "Знамена великих гильдий замерли под сводами залов безмолвия. Здесь куется коллективное Величие фракций, координируются рейды и возводятся Врата Разломов в другие измерения.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!</strong>", isLocked: true },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", buyText: "Полки уставлены древними фолиантами и склянками со светящимися эссенциями. Лаборатории требуется постройка рунического очага реагентов за 🪙 100.", activeText: "Реагенты закуплены. Лаборатория полностью готова дистиллировать эссенции драконов.", isLocked: false, isHero: false },
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

window.openModeDescription = function(id) {
    window.currentOpenedModeKey = id;
    const config = INLINE_MODE_DESCRIPTIONS[id];
    if (!config) return;

    const titleEl = document.getElementById('mode-desc-title');
    const textEl = document.getElementById('mode-desc-text');
    const buyBtn = document.getElementById('mode-buy-btn');

    if (titleEl) titleEl.innerText = config.title;

    if (textEl) {
        if (config.isLocked) {
            textEl.innerHTML = config.reqText;
            if (buyBtn) buyBtn.style.display = 'none';
        } else if (config.isHero) {
            const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
            const bldLvl = parseInt(localStorage.getItem(`khamach_build_${id}`) || '0');
            const data = typeof SQUAD_HERO_LORE !== 'undefined' ? SQUAD_HERO_LORE[id === 'mage' ? 'damage_mage' : id] : null;
            
            let loreText = data ? data.lore : "Оборонительное или тренировочное сооружение Цитадели.";
            let bonusText = data ? data.statBonus : "";

            let instructionText = "<br><br><span style='color:#cdb38c;'>⚠️ Данное здание необходимо для снятия ограничений и расширения текущего потолка прокачки бойца внутри Военного Лагеря. Каждая модернизация увеличивает максимальный доступный уровень тренировок.</span>";

            if (!isPurchased) {
                textEl.innerHTML = `${loreText}${instructionText}<br><br><span style='color:#ffb3ba;'>Ожидаемый эффект прокачки бойца: ${bonusText}</span>`;
                if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ ПОСТРОИТЬ (🪙 100)`; }
            } else if (bldLvl >= 15) {
                textEl.innerHTML = `${loreText}<br><br><span style='color:#2ecc71;'>Максимальный уровень модернизации здания достигнут! Потолок прокачки расширен до максимума.</span>`;
                if (buyBtn) buyBtn.style.display = 'none';
            } else {
                textEl.innerHTML = `${loreText}${instructionText}<br><br><span style='color:#ffd700;'>Текущий лимит уровня бойца: ${bldLvl}</span><br>Потенциал тренировок: ${bonusText}`;
                if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ УЛУЧШИТЬ ДО УР. ${bldLvl + 1} (🪙 150)`; }
            }
        } else {
            const purchased = window.isBuildingPurchased(id);
            textEl.innerHTML = purchased ? config.activeText : config.buyText;
            if (buyBtn) {
                buyBtn.style.display = purchased ? 'none' : 'block';
                buyBtn.innerText = `⚒️ ПОСТРОИТЬ (🪙 100)`;
            }
        }
    }
    showScreen('mode-desc-screen');
};

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
        el.innerText = `🪙 ${window.getPlayerGold()}`; 
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
