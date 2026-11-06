/* ==========================================================================
   КХАМАЧ — МОДУЛЬ АВТОМАТИЧЕСКИХ ТАЙМЕРОВ И ЛЕТОПИСИ (ОБНОВЛЕН - v3.3.2-BETA)
   ========================================================================== */

const CITY_MISSIONS_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Защитник", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Кузнец просит придержать тяжелую наковальню и разгрузить слитки метеоритной стали.", title: "Помощь в кузнице" },
    { id: "m_t2", allowedHero: "tank", heroName: "Защитник", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Капитан стражи ищет живой щит для блокирования прохода взбесившихся кабанов на рыночной площади.", title: "Живой заслон ворот" },
    { id: "m_d1", allowedHero: "damage", heroName: "Воин", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Дровосеки боятся идти на вырубку из-за расплодившихся диких волков Горнила. Требуется зачистить чащу.", title: "Очистка лесопилки" },
    { id: "m_d2", allowedHero: "damage", heroName: "Воин", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Хозяин таверны ищет вышибалу, способного взглядом прекращать массовые пьяные драки наемников.", title: "Вышибала в таверне" },
    { id: "m_a1", allowedHero: "archer", heroName: "Стрелок", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Старый мельник просит перестрелять стаю кровожадных летучих мышей, оккупировавших крышу мельницы.", title: "Отстрел вредителей" },
    { id: "m_a2", allowedHero: "archer", heroName: "Стрелок", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Купеческая гильдия нанимает зоркого следопыта для разведки засад бандитов на скалистом тракте.", title: "Охрана каравана" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "В лазарете вспыхнула болотная хворь. Лекари просят подпитать ослабших горожан магией жизни.", title: "Полевое исцеление" },
    { id: "m_m2", allowedHero: "mage", heroName: "Маг", type: "обычное", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Алхимик разлил эссенцию нестабильности. Требуется удерживать рунический контур от взрыва.", title: "Стабилизация лаборатории" }
];

function addChronicleLog(message) {
    let logs = [];
    try {
        logs = JSON.parse(localStorage.getItem('khamach_chronicle_logs') || '[]');
    } catch(e) { logs = []; }
    
    const timeStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logs.unshift(`[${timeStr}] ${message}`);
    localStorage.setItem('khamach_chronicle_logs', JSON.stringify(logs.slice(0, 50)));
}

function renderChronicleDOM() {
    const container = document.getElementById('chronicle-list-container');
    if (!container) return;
    
    let logs = [];
    try {
        logs = JSON.parse(localStorage.getItem('khamach_chronicle_logs') || '[]');
    } catch(e) { logs = []; }
    
    if (logs.length === 0) {
        container.innerHTML = `<div style="color: #6a5335; text-align: center; padding: 20px;">Записей в летописях пока нет. Совершайте подвиги!</div>`;
        return;
    }
    
    container.innerHTML = logs.map(log => {
        let color = "#cdb38c";
        if (log.includes("АВТО")) color = "#2ecc71";
        if (log.includes("ОТПРАВЛЕН")) color = "#f1c40f";
        if (log.includes("ПОБЕДА")) color = "#e6c280";
        return `<div style="color: ${color}; border-bottom: 1px solid #231c15; padding-bottom: 3px;">${log}</div>`;
    }).join('');
}

function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    let activeMissionId = localStorage.getItem('khamach_current_mission_id');
    let currentMission = null;
    
    if (activeMissionId) {
        currentMission = CITY_MISSIONS_POOL.find(m => m.id === activeMissionId);
    }
    
    if (!currentMission) {
        const randomIndex = Math.floor(Math.random() * CITY_MISSIONS_POOL.length);
        currentMission = CITY_MISSIONS_POOL[randomIndex];
        localStorage.setItem('khamach_current_mission_id', currentMission.id);
    }
    
    const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${currentMission.id}`) === 'true';
    const isHeroBusy = localStorage.getItem(`khamach_hero_busy_${currentMission.allowedHero}`) === 'true';
    
    const card = document.createElement('div');
    card.style.background = "rgba(25, 20, 18, 0.9)";
    card.style.border = "1px solid #544432";
    card.style.padding = "10px";
    card.style.borderRadius = "3px";
    card.style.textAlign = "left";
    
    let actionHTML = '';
    if (isThisMissionActive) {
        const startTimestamp = parseInt(localStorage.getItem(`khamach_mission_start_${currentMission.id}`) || '0');
        const now = Date.now();
        const elapsed = now - startTimestamp;
        const remaining = Math.max(0, currentMission.durationMs - elapsed);
        
        if (remaining > 0) {
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            actionHTML = `<div style="color: #ff4500; font-weight: bold; font-size: 11px; background: rgba(0,0,0,0.4); padding: 4px 6px; border: 1px dashed #ff4500;">⏱️ В пути: ${timeStr}</div>`;
        }
    } else if (isHeroBusy) {
        actionHTML = `<button class="menu-btn disabled" style="padding: 6px; font-size: 11px;" disabled>Боец занят</button>`;
    } else {
        actionHTML = `<button class="menu-btn" style="padding: 6px; font-size: 11px; background: #1d3a1e;" onclick="startMission('${currentMission.id}', '${currentMission.allowedHero}')">Отправить (${currentMission.heroName})</button>`;
    }
    
    card.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 13px;">
            <span>${currentMission.title}</span>
            <span style="color: #ffd700;">🪙 ${currentMission.reward}</span>
        </div>
        <div style="font-size: 11px; color: #bfae96; margin: 6px 0; line-height: 1.4;">${currentMission.text}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px;">
            <span style="font-size: 10px; color: #8a7350;">⏱️ Время: ${currentMission.duration}</span>
            ${actionHTML}
        </div>
    `;
    container.appendChild(card);
}

window.startMission = function(missionId, heroId) {
    const mission = CITY_MISSIONS_POOL.find(m => m.id === missionId);
    if (!mission) return;
    
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    localStorage.setItem(`khamach_mission_start_${missionId}`, Date.now().toString());
    
    addChronicleLog(`ОТПРАВЛЕН: ${mission.heroName} ушел на поручение «${mission.title}» (${mission.duration}).`);
    alert(`Боец успешно ушел на смену. Он автоматически вернется через ${mission.duration}.`);
    renderMissionsDOM();
};

window.checkAndProcessMissionsBackground = function() {
    let activeMissionId = localStorage.getItem('khamach_current_mission_id');
    if (!activeMissionId) return;
    
    const mission = CITY_MISSIONS_POOL.find(m => m.id === activeMissionId);
    if (!mission) return;
    
    const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${mission.id}`) === 'true';
    if (!isThisMissionActive) return;
    
    const startTimestamp = parseInt(localStorage.getItem(`khamach_mission_start_${mission.id}`) || '0');
    const now = Date.now();
    
    if (now - startTimestamp >= mission.durationMs) {
        localStorage.removeItem(`khamach_hero_busy_${mission.allowedHero}`);
        localStorage.removeItem(`khamach_mission_active_${mission.id}`);
        localStorage.removeItem(`khamach_mission_start_${mission.id}`);
        localStorage.removeItem('khamach_current_mission_id'); 
        
        if (typeof addPlayerGold === 'function') addPlayerGold(mission.reward);
        
        addChronicleLog(`АВТО-ВЫПОЛНЕНО: ${mission.heroName} завершил поручение «${mission.title}». На счет зачислено 🪙 ${mission.reward} золота.`);
        
        const screenMissions = document.getElementById('missions-screen');
        if (screenMissions && screenMissions.style.display !== 'none') {
            renderMissionsDOM();
        }
    } else {
        const screenMissions = document.getElementById('missions-screen');
        if (screenMissions && screenMissions.style.display !== 'none') {
            renderMissionsDOM();
        }
    }
};

const oldCheckBattleResolution = window.checkBattleResolution;
window.checkBattleResolution = function() {
    if (combatData && combatData.dragonHP <= 0) {
        addChronicleLog(`ВЕЛИКАЯ ПОБЕДА: Успешно ликвидирован древний дракон Тира ${activeSessionLevel}! Получен 1 случайный материал.`);
    }
    if (typeof oldCheckBattleResolution === 'function') oldCheckBattleResolution();
};
