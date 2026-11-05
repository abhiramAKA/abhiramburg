/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА ЦИТАДЕЛИ И СКЛАДЫ НИШТЯКОВ ДРАКОНА (ОБНОВЛЕН - v2.5.0-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«Логово Чудовища»:</strong> Сражайся на поле боя, и собранные триады рун обрушат ярость героев на врага.</p>`,
    squadInfo: `<p><strong>«Штаб Отряда»:</strong> Тренируй лагеря воинов за золото, добытое с драконов, чтобы повысить здоровье и атаку.</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЯЯ КУЗНЯ", reqText: "В полумраке кузницы тяжело вздыхают мехи. Здесь из костей и чешуи великих ящеров куется мифический доспех, не знающий износа.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Кузня открывается на 12-м уровне развития отряда!</strong>" },
    alchemy: { title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ", reqText: "Полки уставлены древними фолиантами и склянками с мерцающими эссенциями. Алхимик Абхирамбурга способен дистиллировать кровь змея в чистую ярость.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Лаборатория открывается на 12-м уровне развития отряда!</strong>" },
    clans: { title: "🛡️ ОРДЕН КХАМАЧА (КЛАНЫ)", reqText: "Песок Арены и залы Великих Гильдий замерли в ожидании героев. Здесь возводятся Врата Разломов и куется коллективное Величие в Мире 2.<br><br><strong style='color:#ff6666;'>⚠️ Доступ заблокирован. Клановый шлюз открывается на 12-м уровне развития отряда!</strong>" }
};

function getTownText(key) { return INLINE_TOWN_TEXTS[key] || ''; }

function getPlayerGold() { return parseInt(localStorage.getItem('khamach_gold') || '0'); }
function addPlayerGold(amount) { localStorage.setItem('khamach_gold', getPlayerGold() + amount); updateTownGoldDisplay(); }
function getPlayerResource(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); }
function addPlayerResource(key, amount) { localStorage.setItem(`khamach_res_${key}`, getPlayerResource(key) + amount); if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay(); }
function isBuildingPurchased(id) { return localStorage.getItem(`khamach_purchased_${id}`) === 'true'; }

function openModeDescription(modeKey) {
    currentOpenedModeKey = modeKey;
    const modeData = INLINE_MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    const buyBtn = document.getElementById('mode-buy-btn');
    const textEl = document.getElementById('mode-desc-text');
    
    textEl.innerHTML = `<p>${modeData.reqText}</p>`;
    buyBtn.style.display = 'none'; // Кнопка купить скрыта, так как уровень еще недоступен
    
    showScreen('mode-desc-screen');
}

function getBuildingLevel(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); }
function getMetaPerkValue(key) { return parseInt(localStorage.getItem(key) || '0'); }

function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { el.innerText = `🪙 ${getPlayerGold()} Золота`; });
    const invContainer = document.getElementById('main-menu-inventory');
    if (!invContainer) return;
    
    invContainer.innerHTML = `
        <div style="color: #bfae96; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #3a3025; padding-bottom: 2px; font-weight: bold;">📜 Хранилище Цिताдели</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 12px; margin: 6px 0; color: #cdb38c; text-align: left; padding: 0 5px;">
            <span>🛡️ Плазма: <strong style="color:#fff;">${getPlayerResource('plasma')}</strong></span>
            <span>🔥 Кровь: <strong style="color:#fff;">${getPlayerResource('blood')}</strong></span>
            <span>🪶 Чешуя: <strong style="color:#fff;">${getPlayerResource('scale')}</strong></span>
            <span>💚 Слезы: <strong style="color:#fff;">${getPlayerResource('tears')}</strong></span>
        </div>
    `;
}
