/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ ГОРОДСКИМИ ПОДРАБОТКАМИ И СМЕНАМИ (v3.2.0-BETA)
   ========================================================================== */

const CITY_MISSIONS_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Танк", type: "обычное", duration: "1 ч", reward: 133, text: "Кузнец просит придержать тяжелую наковальню и разгрузить слитки метеоритной стали.", title: "Помощь в кузнице" },
    { id: "m_t2", allowedHero: "tank", heroName: "Танк", type: "обычное", duration: "1 ч", reward: 133, text: "Капитан стражи ищет живой щит для блокирования прохода взбесившихся кабанов на рыночной площади.", title: "Живой заслон ворот" },
    { id: "m_d1", allowedHero: "damage", heroName: "Дамагер", type: "обычное", duration: "1 ч", reward: 133, text: "Дровосеки боятся идти на вырубку из-за расплодившихся диких волков Горнила. Требуется зачистить чащу.", title: "Очистка лесопилки" },
    { id: "m_d2", allowedHero: "damage", heroName: "Дамагер", type: "обычное", duration: "1 ч", reward: 133, text: "Хозяин таверны ищет вышибалу, способного взглядом прекращать массовые пьяные драки наемников.", title: "Вышибала в таверне" },
    { id: "m_a1", allowedHero: "archer", heroName: "Лучник", type: "обычное", duration: "1 ч", reward: 133, text: "Старый мельник просит перестрелять стаю кровожадных летучих мышей, оккупировавших крышу мельницы.", title: "Отстрел вредителей" },
    { id: "m_a2", allowedHero: "archer", heroName: "Лучник", type: "обычное", duration: "1 ч", reward: 133, text: "Купеческая гильдия нанимает зоркого следопыта для разведки засад бандитов на скалистом тракте.", title: "Охрана каравана" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", reward: 133, text: "В лазарете вспыхнула болотная хворь. Лекари просят подпитать ослабших горожан магией жизни.", title: "Полевое исцеление" },
    { id: "m_m2", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", reward: 133, text: "Алхимик разлил эссенцию нестабильности. Требуется удерживать рунический контур от взрыва.", title: "Стабилизация лаборатории" },
    { id: "m_r1", allowedHero: "damage", heroName: "Дамагер", type: "редкое", duration: "2 ч", reward: 388, text: "В древних катакомбах под собором проснулись мертвецы. Требуется опытный штурмовик.", title: "Зачистка склепа" },
    { id: "m_e1", allowedHero: "mage", heroName: "Маг", type: "эпическое", duration: "4 ч", reward: 1110, text: "Магический разлом угрожает разорвать городскую ратушу. Срочно требуется магистр душ.", title: "Закрытие Разлома Магов" }
];

function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    const maxUnlockedTier = typeof getMaxUnlockedTier === 'function' ? getMaxUnlockedTier() : 1;
    
    CITY_MISSIONS_POOL.forEach(mission => {
        if (maxUnlockedTier <= 3 && mission.type !== "обычное") {
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
        
        let btnHTML = '';
        if (isThisMissionActive) {
            btnHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #421e1e;" onclick="finishMission('${mission.id}', '${mission.allowedHero}', ${mission.reward})">Завершить смену</button>`;
        } else if (isHeroBusy) {
            btnHTML = `<button class="menu-btn disabled" style="padding: 6px; font-size: 11px;" disabled>Занят</button>`;
        } else {
            btnHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #1d3a1e;" onclick="startMission('${mission.id}', '${mission.allowedHero}')">Отправить (${mission.heroName})</button>`;
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 13px;">
                <span>${mission.title} [${mission.type.toUpperCase()}]</span>
                <span style="color: #ffd700;">🪙 ${mission.reward}</span>
            </div>
            <div style="font-size: 11px; color: #bfae96; margin: 4px 0;">${mission.text}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                <span style="font-size: 10px; color: #8a7350;">⏱️ Время: ${mission.duration}</span>
                ${btnHTML}
            </div>
        `;
        container.appendChild(card);
    });
}

window.startMission = function(missionId, heroId) {
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    alert("Герой успешно покинул казармы и отправился на смену! До окончания работ он недоступен для битв с драконами.");
    renderMissionsDOM();
};

window.finishMission = function(missionId, heroId, reward) {
    localStorage.removeItem(`khamach_hero_busy_${heroId}`);
    localStorage.removeItem(`khamach_mission_active_${missionId}`);
    if (typeof addPlayerGold === 'function') addPlayerGold(reward);
    alert(`Поручение выполнено! Воин возвращается в строй, в городскую казну отчислено 🪙 ${reward} золота.`);
    renderMissionsDOM();
};
