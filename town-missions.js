/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ ОДНОЙ СЛУЧАЙНОЙ СМЕНОЙ ГОРОЖАН (v3.2.7-BETA)
   ========================================================================== */

const CITY_MISSIONS_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Танк", type: "обычное", duration: "1 ч", reward: 133, text: "Кузнец просит придержать тяжелую наковальню и разгрузить слитки метеоритной стали.", title: "Помощь в кузнице" },
    { id: "m_t2", allowedHero: "tank", heroName: "Танк", type: "обычное", duration: "1 ч", reward: 133, text: "Капитан стражи ищет живой щит для блокирования прохода взбесившихся кабанов на рыночной площади.", title: "Живой заслон ворот" },
    { id: "m_d1", allowedHero: "damage", heroName: "Дамагер", type: "обычное", duration: "1 ч", reward: 133, text: "Дровосеки боятся идти на вырубку из-за расплодившихся диких волков Горнила. Требуется зачистить чащу.", title: "Очистка лесопилки" },
    { id: "m_d2", allowedHero: "damage", heroName: "Дамагер", type: "обычное", duration: "1 ч", reward: 133, text: "Хозяин таверны ищет вышибалу, способного взглядом прекращать массовые пьяные драки наемников.", title: "Вышибала в таверне" },
    { id: "m_a1", allowedHero: "archer", heroName: "Лучник", type: "обычное", duration: "1 ч", reward: 133, text: "Старый мельник просит перестрелять стаю кровожадных летучих мышей, оккупировавших крышу мельницы.", title: "Отстрел вредителей" },
    { id: "m_a2", allowedHero: "archer", heroName: "Лучник", type: "обычное", duration: "1 ч", reward: 133, text: "Купеческая гильдия нанимает зоркого следопыта для разведки засад бандитов на скалистом тракте.", title: "Охрана каравана" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", reward: 133, text: "В лазарете вспыхнула болотная хворь. Лекари просят подпитать ослабших горожан магией жизни.", title: "Полевое исцеление" },
    { id: "m_m2", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", reward: 133, text: "Алхимик разлил эссенцию нестабильности. Требуется удерживать рунический контур от взрыва.", title: "Стабилизация лаборатории" }
];

function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    // Проверяем, есть ли уже активное в данный момент поручение
    let activeMissionId = localStorage.getItem('khamach_current_mission_id');
    let currentMission = null;
    
    if (activeMissionId) {
        currentMission = CITY_MISSIONS_POOL.find(m => m.id === activeMissionId);
    }
    
    // Если активного поручения нет, выбираем одно полностью случайное
    if (!currentMission) {
        const randomIndex = Math.floor(Math.random() * CITY_MISSIONS_POOL.length);
        currentMission = CITY_MISSIONS_POOL[randomIndex];
        // Запоминаем его, чтобы оно не прыгало при каждом клике внутри окна
        localStorage.setItem('khamach_current_mission_id', currentMission.id);
    }
    
    const isHeroBusy = localStorage.getItem(`khamach_hero_busy_${currentMission.allowedHero}`) === 'true';
    const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${currentMission.id}`) === 'true';
    
    const card = document.createElement('div');
    card.style.background = "rgba(25, 20, 18, 0.9)";
    card.style.border = "1px solid #544432";
    card.style.padding = "10px";
    card.style.borderRadius = "3px";
    card.style.textAlign = "left";
    
    let btnHTML = '';
    if (isThisMissionActive) {
        btnHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #421e1e;" onclick="finishMission('${currentMission.id}', '${currentMission.allowedHero}', ${currentMission.reward})">Завершить смену</button>`;
    } else if (isHeroBusy) {
        btnHTML = `<button class="menu-btn disabled" style="padding: 6px; font-size: 11px;" disabled>Занят</button>`;
    } else {
        btnHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #1d3a1e;" onclick="startMission('${currentMission.id}', '${currentMission.allowedHero}')">Отправить (${currentMission.heroName})</button>`;
    }
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 13px;">
            <span>${currentMission.title} [${currentMission.type.toUpperCase()}]</span>
            <span style="color: #ffd700;">🪙 ${currentMission.reward}</span>
        </div>
        <div style="font-size: 11px; color: #bfae96; margin: 6px 0; line-height: 1.4;">${currentMission.text}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
            <span style="font-size: 10px; color: #8a7350;">⏱️ Время: ${currentMission.duration}</span>
            ${btnHTML}
        </div>
    `;
    container.appendChild(card);
}

window.startMission = function(missionId, heroId) {
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    alert("Воин успешно отправлен на городскую смену! До завершения работ он покидает боевой отряд.");
    renderMissionsDOM();
};

window.finishMission = function(missionId, heroId, reward) {
    localStorage.removeItem(`khamach_hero_busy_${heroId}`);
    localStorage.removeItem(`khamach_mission_active_${missionId}`);
    // Удаляем закрепление текущего поручения, чтобы в следующий раз вышло новое случайное
    localStorage.removeItem('khamach_current_mission_id');
    
    if (typeof addPlayerGold === 'function') addPlayerGold(reward);
    alert(`Смена благополучно отработана! Воин вернулся в казармы, а казна пополнилась на 🪙 ${reward} золота. На доске объявлений появилось новое поручение!`);
    renderMissionsDOM();
};
