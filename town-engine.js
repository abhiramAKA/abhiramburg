function updateTownGoldDisplay() {
    document.querySelectorAll('.gold-counter-display').forEach(el => { 
        el.innerText = `🪙 ${getPlayerGold()} Золота`; 
    });
}

// РЕНДЕРИНГ И СОДЕРЖИМОЕ ОКНА СКЛАДА
function updateStorageScreenDOM() {
    const listContainer = document.getElementById('storage-resources-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="color: #e6c280; font-weight: bold; border-bottom: 1px solid #544432; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase; font-size: 13px;">📜 Добытые материалы:</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 14px; color: #cdb38c;">
            <div>🌋 Плазма древнего змея: <strong style="color:#fff; float: right;">${getPlayerResource('plasma')} шт.</strong></div>
            <div>🩸 Первородная кровь дракона: <strong style="color:#fff; float: right;">${getPlayerResource('blood')} шт.</strong></div>
            <div>🪶 Плотная чешуя ящера: <strong style="color:#fff; float: right;">${getPlayerResource('scale')} шт.</strong></div>
            <div>💧 Чистые слезы природы: <strong style="color:#fff; float: right;">${getPlayerResource('tears')} шт.</strong></div>
        </div>
    `;
}

// БАЗА ДАННЫХ ДЛЯ ГОРОДСКИХ ПОРУЧЕНИЙ (СМЕН)
const CITY_MISSIONS_POOL = [
    {
        id: "m_tank_1",
        allowedHero: "tank",
        heroName: "Танк",
        type: "обычное",
        duration: "1 ч",
        reward: 133, // Из таблицы баланса
        text: "Кузнец просит придержать наковальню и помочь с переносом тяжелых слитков метеоритной стали.",
        title: "Помощь в кузнице"
    },
    {
        id: "m_tank_2",
        allowedHero: "tank",
        heroName: "Танк",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "Городская стража просит постоять на центральных воротах во время пивного фестиваля для усмирения буйных.",
        title: "Охрана правопорядка"
    },
    {
        id: "m_damage_1",
        allowedHero: "damage",
        heroName: "Дамагер",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "Лесорубы боятся углубляться в чащу из-за расплодившихся диких кабанов-мутантов. Нужна грубая сила.",
        title: "Зачистка старой просеки"
    },
    {
        id: "m_damage_2",
        allowedHero: "damage",
        heroName: "Дамагер",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "Хозяин таверны ищет вышибалу, способного одним взглядом ломать дубовые столы и прекращать драки.",
        title: "Усмирение в таверне"
    },
    {
        id: "m_archer_1",
        allowedHero: "archer",
        heroName: "Лучник",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "Старый мельник жалуется на стаи гигантских ворон, ворующих мешки со склада. Нужен зоркий глаз.",
        title: "Отстрел вредителей"
    },
    {
        id: "m_archer_2",
        allowedHero: "archer",
        heroName: "Лучник",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "Купеческий караван ищет разведчика для проверки безопасности горного перевала от засад бандитов.",
        title: "Разведка перевала"
    },
    {
        id: "m_mage_1",
        allowedHero: "mage",
        heroName: "Маг",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "В местном госпитале лихорадка косит детей. Знахари бессильны, требуется подпитка чистой магией жизни.",
        title: "Исцеление больных"
    },
    {
        id: "m_mage_2",
        allowedHero: "mage",
        heroName: "Маг",
        type: "обычное",
        duration: "1 ч",
        reward: 133,
        text: "У алхимика-ученого скисло ценное зелье из-за нарушения температурной стабильности. Нужна стабилизация рун.",
        title: "Калибровка эссенций"
    },
    // Продвинутые смены для последующих этапов игры
    {
        id: "m_rare_1",
        allowedHero: "damage",
        heroName: "Дамагер",
        type: "редкое",
        duration: "2 ч",
        reward: 388, //
        text: "Торговцы наткнулись на логово редких подземных чудовищ. Задание повышенной опасности.",
        title: "Зачистка катакомб"
    },
    {
        id: "m_epic_1",
        allowedHero: "mage",
        heroName: "Маг",
        type: "эпическое",
        duration: "4 ч",
        reward: 1110, //
        text: "Лорды просят запечатать древний разлом магии, который грозит уничтожить четверть Абхирамбурга.",
        title: "Закрытие Разлома Пустоты"
    }
];

// ЛОГИКА ОТОБРАЖЕНИЯ ПОРУЧЕНИЙ
function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Определяем текущий этап игры по открытому тиру дракона
    const maxUnlockedTier = typeof getMaxUnlockedTier === 'function' ? getMaxUnlockedTier() : 1;
    
    // Блокировка редких/эпических смен на первых 3-х уровнях (Этап 1)
    const currentTierLimit = maxUnlockedTier; 
    
    CITY_MISSIONS_POOL.forEach(mission => {
        // Если тир игрока <= 3, скрываем редкие и эпические смены
        if (currentTierLimit <= 3 && mission.type !== "обычное") {
            return; 
        }
        
        const isHeroBusy = localStorage.getItem(`khamach_hero_busy_${mission.allowedHero}`) === 'true';
        const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${mission.id}`) === 'true';
        
        const card = document.createElement('div');
        card.style.background = "rgba(25, 20, 18, 0.9)";
        card.style.border = "1px solid #544432";
        card.style.padding = "8px";
        card.style.borderRadius = "3px";
        card.style.textAlign = "left";
        
        let actionButtonHTML = '';
        
        if (isThisMissionActive) {
            actionButtonHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #421e1e;" onclick="finishMission('${mission.id}', '${mission.allowedHero}', ${mission.reward})">Завершить смену</button>`;
        } else if (isHeroBusy) {
            actionButtonHTML = `<button class="menu-btn disabled" style="padding: 6px; font-size: 11px;" disabled>Герой занят</button>`;
        } else {
            actionButtonHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #1d3a1e;" onclick="startMission('${mission.id}', '${mission.allowedHero}')">Отправить (${mission.heroName})</button>`;
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 13px;">
                <span>${mission.title} (${mission.type})</span>
                <span style="color: #ffd700;">🪙 ${mission.reward}</span>
            </div>
            <div style="font-size: 11px; color: #bfae96; margin: 4px 0;">${mission.text}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span style="font-size: 10px; color: #8a7350;">⏱️ Длительность: ${mission.duration}</span>
                ${actionButtonHTML}
            </div>
        `;
        
        container.appendChild(card);
    });
}

// НАЧАТЬ СМЕНУ
window.startMission = function(missionId, heroId) {
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    alert(`Воин успешно отправлен на городское поручение! На время смены он покидает боевой отряд для рейдов.`);
    renderMissionsDOM();
};

// ЗАВЕРШИТЬ СМЕНУ И ПОЛУЧИТЬ ЗОЛОТО
window.finishMission = function(missionId, heroId, reward) {
    localStorage.removeItem(`khamach_hero_busy_${heroId}`);
    localStorage.removeItem(`khamach_mission_active_${missionId}`);
    addPlayerGold(reward);
    alert(`Смена благополучно отработана! Наш боец вернулся в казармы, а казна пополнилась на 🪙 ${reward} золота.`);
    renderMissionsDOM();
};
