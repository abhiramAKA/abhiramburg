/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА И СИСТЕМА КРАФТА АРТЕФАКТОВ (ОБНОВЛЕН - v1.3.0-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«Логово Чудовища»:</strong> Сражайся на поле боя, и собранные триады рун обрушат ярость героев на врага.</p>`,
    squadInfo: `<p><strong>«Штаб Отряда»:</strong> Тренируй лагеря воинов за золото, добытое с драконов, чтобы повысить здоровье и атаку.</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЕЕ ГОРНИЛО", buyText: "Кузнице требуется восстановление инструментов за 🪙 500.", activeText: "Инструменты исправны. Кузнец готов перерабатывать Чешую дракона или выковать мифическое оружие." },
    alchemy: { title: "🧪 ТАЙНЫЙ ОЧАГ", buyText: "Алхимику требуется закупка редких реагентов за 🪙 500.", activeText: "Реагенты закуплены. Мастер готов дистиллировать Кровь дракона или сварить Сердце Змея." }
};

function getTownText(key) { return INLINE_TOWN_TEXTS[key] || ''; }

function getPlayerGold() { return parseInt(localStorage.getItem('khamach_gold') || '0'); }
function addPlayerGold(amount) { localStorage.setItem('khamach_gold', getPlayerGold() + amount); updateTownGoldDisplay(); }
function getPlayerResource(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); }
function addPlayerResource(key, amount) { localStorage.setItem(`khamach_res_${key}`, getPlayerResource(key) + amount); }
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
        const resKey = modeKey === 'forge' ? 'scales' : 'blood';
        const itemStatus = localStorage.getItem(`khamach_artifact_${modeKey}`) === 'true' ? "⚔️ СКОНСТРУИРОВАН" : "❌ Отсутствует";
        
        textEl.innerHTML = `
            <p>${modeData.activeText}</p>
            <div style="background: rgba(0,0,0,0.5); padding: 8px; border: 1px dashed #544432; margin-bottom: 10px;">
                <p style="margin: 4px 0;">Ресурсы на складе: <strong>${getPlayerResource(resKey)} ед.</strong></p>
                <p style="margin: 4px 0; color: #ffd700;">Статус артефакта ветки: <strong>${itemStatus}</strong></p>
            </div>
            <p style="font-size: 11px; color: #8a7350;">Нажмите кнопку ремесла, чтобы выбрать: переработку сырья в пассивные перки или ковку артефакта.</p>
        `;
        buyBtn.style.display = 'none';
        processBtn.style.display = 'block';
    }
    showScreen('mode-desc-screen');
}

function openCraftSelectionMenu(modeKey) {
    const choice = prompt("Выберите тип ремесла:\n1 - Переработка сырья (1 шт + 50 🪙) -> Пассивный бонус\n2 - Создание Мифического Артефакта (3 шт переработ. бонусов + 300 🪙)");
    
    if (choice === "1") {
        executeResourceProcessing(modeKey);
    } else if (choice === "2") {
        executeArtifactCrafting(modeKey);
    }
}

function executeResourceProcessing(modeKey) {
    const goldCost = 50;
    const resKey = modeKey === 'forge' ? 'scales' : 'blood';
    if (getPlayerGold() < goldCost || getPlayerResource(resKey) < 1) {
        alert("Недостаточно ресурсов (нужно 1 ресурс и 50 🪙)!");
        return;
    }
    localStorage.setItem('khamach_gold', getPlayerGold() - goldCost);
    localStorage.setItem(`khamach_res_${resKey}`, getPlayerResource(resKey) - 1);
    
    const perkKey = modeKey === 'forge' ? 'khamach_perk_shield' : 'khamach_perk_sp';
    localStorage.setItem(perkKey, parseInt(localStorage.getItem(perkKey) || '0') + 1);
    alert("Сырье успешно дистиллировано мастерами!");
    openModeDescription(modeKey);
}

function executeArtifactCrafting(modeKey) {
    const goldCost = 300;
    const perkKey = modeKey === 'forge' ? 'khamach_perk_shield' : 'khamach_perk_sp';
    const currentPerks = parseInt(localStorage.getItem(perkKey) || '0');
    
    if (localStorage.getItem(`khamach_artifact_${modeKey}`) === 'true') {
        alert("Этот уникальный артефакт уже выкован в вашей цитадели!");
        return;
    }
    if (getPlayerGold() < goldCost || currentPerks < 3) {
        alert("Недостаточно условий! Требуется накопить минимум 3 уровня переработки сырья и 300 🪙.");
        return;
    }
    
    localStorage.setItem('khamach_gold', getPlayerGold() - goldCost);
    localStorage.setItem(perkKey, currentPerks - 3);
    localStorage.setItem(`khamach_artifact_${modeKey}`, 'true');
    
    alert(modeKey === 'forge' ? "⚒️ КЛИНОК НЕКРОСМУТА ВЫКОВАН! Дамагер получает сокрушительный бонус к критам!" : "🔮 СЕРДЦЕ ЗМЕЯ СВАРЕНО! Маг обретает тайный шанс сохранения ОД!");
    openModeDescription(modeKey);
}

function getBuildingLevel(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); }
function getMetaPerkValue(key) { return parseInt(localStorage.getItem(key) || '0'); }

function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { el.innerText = `🪙 ${getPlayerGold()} Золота`; });
    const invContainer = document.getElementById('main-menu-inventory');
    if (!invContainer) return;
    
    const hasForgeItem = localStorage.getItem('khamach_artifact_forge') === 'true' ? "⚔️Клинок" : "❌";
    const hasAlchItem = localStorage.getItem('khamach_artifact_alchemy') === 'true' ? "🔮Сердце" : "❌";

    invContainer.innerHTML = `
        <div style="color: #bfae96; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #3a3025; padding-bottom: 2px; font-weight: bold;">📜 Арсенал Цитадели</div>
        <div style="display: flex; justify-content: space-around; margin: 4px 0; color: #cdb38c;">
            <span>Чешуя: <strong>${getPlayerResource('scales')}</strong></span>
            <span>Кровь: <strong>${getPlayerResource('blood')}</strong></span>
        </div>
        <div style="display: flex; justify-content: space-around; font-size: 11px; color: #8a7350;">
            <span>Бонус Лат: <strong style="color:#4a90e2;">+${getMetaPerkValue('khamach_perk_shield')*5}</strong></span>
            <span>Бонус Настоя: <strong style="color:#ffd700;">+${getMetaPerkValue('khamach_perk_sp')*5}%</strong></span>
        </div>
        <div style="font-size: 10px; color: #e6c280; border-top: 1px dashed #3a3025; margin-top: 4px; padding-top: 2px;">
            Реликвии: Кузня: <strong>${hasForgeItem}</strong> | Алхимия: <strong>${hasAlchItem}</strong>
        </div>
    `;
}
