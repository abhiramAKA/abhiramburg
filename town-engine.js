/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА ЦИТАДЕЛИ И ПРЯМОЙ СКЛАД НИШТЯКОВ (ОБНОВЛЕН - v2.1.0-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«Логово Чудовища»:</strong> Сражайся на поле боя, и собранные триады рун обрушат ярость героев на врага.</p>`,
    squadInfo: `<p><strong>«Штаб Отряда»:</strong> Тренируй лагеря воинов за золото, добытое с драконов, чтобы повысить здоровье и атаку.</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЕЕ ГОРНИЛО", buyText: "Кузнице требуется восстановление инструментов за 🪙 500.", activeText: "Инструменты исправны. Кузнец готов плавить редкие материалы или выковать мифическое оружие." },
    alchemy: { title: "🧪 ТАЙНЫЙ ОЧАГ", buyText: "Алхимику требуется закупка редких реагентов за 🪙 500.", activeText: "Реагенты закуплены. Мастер готов варить Сердце Змея." }
};

function getTownText(key) { return INLINE_TOWN_TEXTS[key] || ''; }

function getPlayerGold() { return parseInt(localStorage.getItem('khamach_gold') || '0'); }
function addPlayerGold(amount) { localStorage.setItem('khamach_gold', getPlayerGold() + amount); updateTownGoldDisplay(); }
function getPlayerResource(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); }
function addPlayerResource(key, amount) { localStorage.setItem(`khamach_res_${key}`, getPlayerResource(key) + amount); if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay(); }
function isBuildingPurchased(id) { return localStorage.getItem(`khamach_purchased_${id}`) === 'true'; }

function buyTownBuilding(id) {
    const cost = 500;
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
    const processBtn = document.getElementById('mode-process-btn');
    const textEl = document.getElementById('mode-desc-text');
    
    if (!isBuildingPurchased(modeKey)) {
        textEl.innerHTML = `<p>${modeData.buyText}</p>`;
        buyBtn.style.display = 'block';
        processBtn.style.display = 'none';
    } else {
        textEl.innerHTML = `<p>${modeData.activeText}</p><p>Используйте меню «Отряд» для тренировки героев за добытые ништяки.</p>`;
        buyBtn.style.display = 'none';
        processBtn.style.display = 'none';
    }
    showScreen('mode-desc-screen');
}

function getBuildingLevel(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); }
function getMetaPerkValue(key) { return parseInt(localStorage.getItem(key) || '0'); }

function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { el.innerText = `🪙 ${getPlayerGold()} Золота`; });
    const invContainer = document.getElementById('main-menu-inventory');
    if (!invContainer) return;
    
    invContainer.innerHTML = `
        <div style="color: #bfae96; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #3a3025; padding-bottom: 2px; font-weight: bold;">📜 Хранилище Цитадели</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 12px; margin: 6px 0; color: #cdb38c; text-align: left; padding: 0 5px;">
            <span>🛡️ Плазма: <strong style="color:#fff;">${getPlayerResource('plasma')}</strong></span>
            <span>🔥 Кровь: <strong style="color:#fff;">${getPlayerResource('blood')}</strong></span>
            <span>⚡ Урина: <strong style="color:#fff;">${getPlayerResource('urine')}</strong></span>
            <span>💚 Слезы: <strong style="color:#fff;">${getPlayerResource('tears')}</strong></span>
        </div>
    `;
}
