/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНАЯ ЭКОНОМИКА ЦИТАДЕЛИ И ХРАНИЛИЩЕ РЕСУРСОВ (v3.2.0-BETA)
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

function getTownText(key) { return INLINE_TOWN_TEXTS[key] || ''; }

function getPlayerGold() { return parseInt(localStorage.getItem('khamach_gold') || '0'); }
function addPlayerGold(amount) { localStorage.setItem('khamach_gold', getPlayerGold() + amount); updateTownGoldDisplay(); }
function getPlayerResource(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); }
function addPlayerResource(key, amount) { localStorage.setItem(`khamach_res_${key}`, getPlayerResource(key) + amount); if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay(); }
function isBuildingPurchased(id) { return localStorage.getItem(`khamach_purchased_${id}`) === 'true'; }

function buyTownBuilding(id) {
    const cost = 100; 
    if (getPlayerGold() >= cost && !isBuildingPurchased(id)) {
        localStorage.setItem('khamach_gold', getPlayerGold() - cost);
        localStorage.setItem(`khamach_purchased_${id}`, 'true');
        updateTownGoldDisplay();
        return true;
    }
    return false;
}

function openModeDescription(modeKey) {
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
        const purchased = isBuildingPurchased(modeKey);
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
}

function getBuildingLevel(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); }
function getMetaPerkValue(key) { return parseInt(localStorage.getItem(key) || '0'); }

function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${getPlayerGold()} Золота`; 
    });
}

function updateStorageScreenDOM() {
    const listContainer = document.getElementById('storage-resources-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="color: #e6c280; font-weight: bold; border-bottom: 1px solid #544432; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase; font-size: 13px;">📜 Материалы Хранилища:</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 14px; color: #cdb38c;">
            <div>🌋 Плазма древнего змея: <strong style="color:#fff; float: right;">${getPlayerResource('plasma')} шт.</strong></div>
            <div>🩸 Первородная кровь дракона: <strong style="color:#fff; float: right;">${getPlayerResource('blood')} шт.</strong></div>
            <div>🪶 Плотная чешуя ящера: <strong style="color:#fff; float: right;">${getPlayerResource('scale')} шт.</strong></div>
            <div>💧 Чистые слезы природы: <strong style="color:#fff; float: right;">${getPlayerResource('tears')} шт.</strong></div>
        </div>
    `;
}
