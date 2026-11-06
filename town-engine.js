/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v4.9.9-BETA)
   ========================================================================== */

const TOWN_BUILDING_PRICES = [
    0, 100, 300, 900, 2700, 11000, 30000, 75000, 125000, 200000, 310000, 540000, 850000, 1385000, 2300000, 3590500
];

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«КХАМАЧ: Восхождение Рейдов»</strong></p><p>В недрах древних подземелий Абхирамбурга пробудился великий закон змея. Соберите свой верный отряд, заряжайте шкалы суперсил через камни стихий и сокрушите огнедышащих тварей в пошаговых тактических битвах Горнила!</p>`,
    combatHelp: `
        <div style="text-align: left; font-size: 13px; line-height: 1.4; display: flex; flex-direction: column; gap: 8px; color: #cdb38c;">
            <div>🛡️ <strong>Защитник (Синие руны):</strong> Принимает весь урон Дракона на себя, закрывая союзников.</div>
            <div>🔥 <strong>Воин (Красные руны):</strong> Наносит Дракону чистый разрушительный урон.</div>
            <div>⚡ <strong>Стрелок (Желтые руны):</strong> Ослепляет Дракона молнией, снижая его атаку в два раза.</div>
            <div>💚 <strong>Маг (Зеленые руны):</strong> Накладывает мощное массовое исцеление на весь отряду.</div>
        </div>
    `
};

const INLINE_MODE_DESCRIPTIONS = {
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "Знамена великих гильдий замерли под сводами залов безмолвия. Здесь куется коллективное Величие фракций, координируются рейды, возводятся Врата Разломов, а также открывается Древняя Кузня!<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!</strong>", isLocked: true },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", isLocked: false, isHero: false, heroId: "alchemy", lore: "Полки уставлены древними фолиантами и склянками со светящимися эссенциями. Необходима для будущей дистилляции и переплавки драконьих ресурсов." },
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
            return;
        }

        const bldId = config.heroId || id;
        const bldLvl = parseInt(localStorage.getItem(`khamach_build_${bldId}`) || '0');
        const data = typeof SQUAD_HERO_LORE !== 'undefined' ? SQUAD_HERO_LORE[bldId === 'mage' ? 'damage_mage' : bldId] : null;
        
        let loreText = config.lore || (data ? data.lore : "Оборонительное или тренировочное сооружение Цитадели.");
        let bonusText = data ? `<br><br><span style='color:#ffb3ba;'>Прогресс бойца: ${data.statBonus}</span>` : "";
        let instructionText = config.heroId !== "alchemy" ? "<br><br><span style='color:#cdb38c;'>⚠️ Данное здание необходимо для снятия ограничений и расширения текущего потолка прокачки бойца внутри Военного Лагеря.</span>" : "";

        if (bldLvl === 0) {
            let price = TOWN_BUILDING_PRICES[1];
            textEl.innerHTML = `${loreText}${instructionText}${bonusText}`;
            if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ ПОСТРОИТЬ (🪙 ${price})`; }
        } else if (bldLvl >= 15) {
            textEl.innerHTML = `${loreText}<br><br><span style='color:#2ecc71;'>Максимальный 15 уровень модернизации здания достигнут! Лимиты расширены до предела.</span>`;
            if (buyBtn) buyBtn.style.display = 'none';
        } else {
            let nextPrice = TOWN_BUILDING_PRICES[bldLvl + 1];
            textEl.innerHTML = `${loreText}${instructionText}<br><br><span style='color:#ffd700;'>Текущий уровень строения: ${bldLvl}</span>${bonusText}`;
            if (buyBtn) { buyBtn.style.display = 'block'; buyBtn.innerText = `⚒️ УЛУЧШИТЬ ДО УР. ${bldLvl + 1} (🪙 ${nextPrice})`; }
        }
    }
    showScreen('mode-desc-screen');
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
            <div style="display:flex; justify-content:space-between;"><span>💚 Maг:</span><strong>${mFat}%</strong></div>
        `;
    }
    if (typeof window.updateStorageScreenDOM === 'function') window.updateStorageScreenDOM();
};
