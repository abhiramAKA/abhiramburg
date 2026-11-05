/* ==========================================================================
   КХАМАЧ — ЭКОНОМИКА И СИСТЕМА КРАФТА АРТЕФАКТОВ (ОБНОВЛЕН - v1.4.0-BETA)
   ========================================================================== */

const INLINE_TOWN_TEXTS = {
    mainInfo: `<p><strong>«Логово Чудовища»:</strong> Сражайся на поле боя, и собранные триады рун обрушит ярость героев на врага.</p>`,
    squadInfo: `<p><strong>«Штаб Отряда»:</strong> Тренируй лагеря воинов за золото, добытое с драконов, чтобы повысить здоровье и атаку.</p>`,
    combatHelp: `<p>🛡️-Танк: Провокация. 🔥-Дамагер: Чистый урон. ⚡-Лучник: Слепота босса. 💚-Маг: Масс-хил.</p>`
};

const INLINE_MODE_DESCRIPTIONS = {
    forge: { title: "⚒️ ДРЕВНЕЕ ГОРНИЛО", buyText: "Кузнице требуется восстановление инструментов за 🪙 500.", activeText: "Инструменты исправны. Кузнец готов плавить Горную руду или выковать мифическое оружие." },
    alchemy: { title: "🧪 ТАЙНЫЙ ОЧАГ", buyText: "Алхимику требуется закупка редких реагентов за 🪙 500.", activeText: "Реагенты закуплены. Мастер готов дистиллировать Вулканическую пыль или сварить Сердце Змея." }
};

function getTownText(key) { return INLINE_TOWN_TEXTS[key] || ''; }

function getPlayerGold() { return parseInt(localStorage.getItem('khamach_gold') || '0'); }
function addPlayerGold(amount) { localStorage.setItem('khamach_gold', getPlayerGold() + amount); updateTownGoldDisplay(); }
function getPlayerResource(key) { return parseInt(localStorage.getItem(`khamach_res_${key}`) || '0'); }
function addPlayerResource(key, amount) { localStorage.setItem(`khamach_res_${key}`, getPlayerResource(key) + amount); }
function isBuildingPurchased(id) { return localStorage.getItem(`khamach_purchased_${id}`) === 'true'; }

function getBackpackItem() { return localStorage.getItem('khamach_backpack') || null; }
function setBackpackItem(item) { localStorage.setItem('khamach_backpack', item || ''); updateTownGoldDisplay(); }

function unloadBackpackToStorage() {
    const item = getBackpackItem();
    if (!item || item === '') {
        alert("Ваш рюкзак уже пуст!");
        return;
    }
    
    if (item === 'ore') {
        addPlayerResource('ore', 1);
        alert("🪨 Горная руда успешно выгружена на склад Кузницы!");
    } else if (item === 'dust') {
        addPlayerResource('dust', 1);
        alert("🌋 Вулканическая пыль успешно сдана в Лабораторию алхимии!");
    } else if (item === 'junk') {
        alert("☠️ Бесполезный хлам из драконьего логова выброшен на помойку цитадели.");
    }
    
    setBackpackItem(null);
}

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
        const resKey = modeKey === 'forge' ? 'ore' : 'dust';
        const resName = modeKey === 'forge' ? '🪨 Горная руда' : '🌋 Вулканическая пыль';
        const itemStatus = localStorage.getItem(`khamach_artifact_${modeKey}`) === 'true' ? "⚔️ СКОНСТРУИРОВАН" : "❌ Отсутствует";
        
        textEl.innerHTML = `
            <p>${modeData.activeText}</p>
            <div style="background: rgba(0,0,0,0.5); padding: 8px; border: 1px dashed #544432; margin-bottom: 10px;">
                <p style="margin: 4px 0;">На складе: <strong>${getPlayerResource(resKey)} ед.</strong> ${resName}</p>
                <p style="margin: 4px 0; color: #ffd700;">Статус артефакта ветки: <strong>${itemStatus}</strong></p>
            </div>
            <p style="font-size: 11px; color: #8a7350;">Перерабатывайте ресурсы со склада в пассивные бонусы или соберите кристаллы на артефакт.</p>
        `;
        buyBtn.style.display = 'none';
        processBtn.style.display = 'block';
    }
    showScreen('mode-desc-screen');
}

function openCraftSelectionMenu(modeKey) {
    const choice = prompt("Выберите тип ремесла:\n1 - Переработка ресурсов со склада (1 шт + 50 🪙) -> Пассивный бонус\n2 - Создание Мифического Артефакта (3 уровня бонусов + 300 🪙)");
    
    if (choice === "1") {
        executeResourceProcessing(modeKey);
    } else if (choice === "2") {
        executeArtifactCrafting(modeKey);
    }
}

function executeResourceProcessing(modeKey) {
    const goldCost = 50;
    const resKey = modeKey === 'forge' ? 'ore' : 'dust';
    if (getPlayerGold() < goldCost || getPlayerResource(resKey) < 1) {
        alert("Недостаточно ресурсов на складе (нужно 1 ресурс и 50 🪙)!");
        return;
    }
    localStorage.setItem('khamach_gold', getPlayerGold() - goldCost);
    localStorage.setItem(`khamach_res_${resKey}`, getPlayerResource(resKey) - 1);
    
    const perkKey = modeKey === 'forge' ? 'khamach_perk_shield' : 'khamach_perk_sp';
    localStorage.setItem(perkKey, parseInt(localStorage.getItem(perkKey) || '0') + 1);
    alert("Ресурс успешно освоен кузнецами цитадели!");
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
        alert("Недостаточно условий! Требуется накопить минимум 3 уровня улучшения ресурсов и 300 🪙.");
        return;
    }
    
    localStorage.setItem('khamach_gold', getPlayerGold() - goldCost);
    localStorage.setItem(perkKey, currentPerks - 3);
    localStorage.setItem(`khamach_artifact_${modeKey}`, 'true');
    
    alert(modeKey === 'forge' ? "⚒️ КЛИНОК НЕКРОСМУТ ВЫКОВАН!" : "🔮 СЕРДЦЕ ЗМЕЯ СВАРЕНО!");
    openModeDescription(modeKey);
}

function getBuildingLevel(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); }
function getMetaPerkValue(key) { return parseInt(localStorage.getItem(key) || '0'); }

function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { el.innerText = `🪙 ${getPlayerGold()} Золота`; });
    const invContainer = document.getElementById('main-menu-inventory');
    if (!invContainer) return;
    
    const bpItem = getBackpackItem();
    let bpText = "<span style='color: #8a7350;'>Пусто</span>";
    let unloadBtnStyle = "display: none;";
    
    if (bpItem === 'ore') { bpText = "<strong style='color:#e6c280;'>🪨 Горная руда</strong>"; unloadBtnStyle = "display: inline-block;"; }
    else if (bpItem === 'dust') { bpText = "<strong style='color:#ff6666;'>🌋 Вулканическая пыль</strong>"; unloadBtnStyle = "display: inline-block;"; }
    else if (bpItem === 'junk') { bpText = "<strong style='color:#7f8c8d;'>☠️ Хлам (Мусор)</strong>"; unloadBtnStyle = "display: inline-block;"; }

    invContainer.innerHTML = `
        <div style="color: #bfae96; text-transform: uppercase; font-size: 10px; border-bottom: 1px solid #3a3025; padding-bottom: 2px; font-weight: bold;">📜 Арсенал Цитадели</div>
        <div style="display: flex; justify-content: space-around; margin: 4px 0; color: #cdb38c;">
            <span>Склад руды: <strong>${getPlayerResource('ore')}</strong></span>
            <span>Склад пыли: <strong>${getPlayerResource('dust')}</strong></span>
        </div>
        <div style="background: rgba(20,10,5,0.4); padding: 4px; border: 1px dashed #4a3e31; margin: 4px 0; text-align: center;">
            Карман рюкзака: ${bpText} 
            <button id="unload-backpack-btn" class="menu-btn" style="${unloadBtnStyle} padding: 2px 6px; font-size: 10px; margin-left: 6px; width: auto; height: auto;">Разгрузить</button>
        </div>
        <div style="display: flex; justify-content: space-around; font-size: 11px; color: #8a7350; margin-top: 4px;">
            <span>Бонус Лат: <strong style="color:#4a90e2;">+${getMetaPerkValue('khamach_perk_shield')*5}</strong></span>
            <span>Бонус Настоя: <strong style="color:#ffd700;">+${getMetaPerkValue('khamach_perk_sp')*5}%</strong></span>
        </div>
    `;
    
    const uBtn = document.getElementById('unload-backpack-btn');
    if (uBtn) {
        uBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            unloadBackpackToStorage();
        });
    }
}
