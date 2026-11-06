/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ТРЕХ СЛУЧАЙНЫХ ПОРУЧЕНИЙ И ТАЙМЕРОВ УСТАЛОСТИ (v4.0.0-BETA)
   ========================================================================== */

const CITY_MISSIONS_POOL = [
    { id: "m_t1", allowedHero: "tank", heroName: "Защитник", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Кузнец просит придержать тяжелую наковальню и разгрузить слитки стали.", title: "Помощь в кузнице" },
    { id: "m_t2", allowedHero: "tank", heroName: "Защитник", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Стража ищет живой щит для блокирования прохода взбесившихся кабанов.", title: "Живой заслон ворот" },
    { id: "m_d1", allowedHero: "damage", heroName: "Воин", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Дровосеки боятся идти на вырубку из-за расплодившихся диких волков.", title: "Очистка лесопилки" },
    { id: "m_d2", allowedHero: "damage", heroName: "Воин", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Хозяин таверны ищет вышибалу, способного взглядом прекращать драки.", title: "Вышибала в таверне" },
    { id: "m_a1", allowedHero: "archer", heroName: "Стрелок", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Старый мельник просит перестрелять стаю кровожадных летучих мышей.", title: "Отстрел вредителей" },
    { id: "m_a2", allowedHero: "archer", heroName: "Стрелок", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Купеческая гильдия нанимает зоркого следопыта для разведки засад.", title: "Охрана каравана" },
    { id: "m_m1", allowedHero: "mage", heroName: "Маг", duration: "1 ч", durationMs: 3600000, reward: 133, text: "В лазарете вспыхнула хворь. Лекари просят подпитать людей магией жизни.", title: "Полевое исцеление" },
    { id: "m_m2", allowedHero: "mage", heroName: "Маг", duration: "1 ч", durationMs: 3600000, reward: 133, text: "Алхимик разлил эссенцию. Требуется удерживать рунический контур.", title: "Стабилизация очага" }
];

function getHeroFatigue(heroId) {
    return Math.min(100, Math.max(0, parseFloat(localStorage.getItem(`khamach_fatigue_${heroId}`) || '0')));
}

function setHeroFatigue(heroId, value) {
    localStorage.setItem(`khamach_fatigue_${heroId}`, Math.min(100, Math.max(0, Math.round(value))));
}

function renderMissionsDOM() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    let activeMissionsJSON = localStorage.getItem('khamach_active_triad_ids');
    let currentTriad = [];
    
    if (activeMissionsJSON) {
        try { currentTriad = JSON.parse(activeMissionsJSON); } catch(e) { currentTriad = []; }
    }
    
    if (!currentTriad || currentTriad.length !== 3) {
        currentTriad = [];
        let tempPool = [...CITY_MISSIONS_POOL];
        for (let i = 0; i < 3; i++) {
            if (tempPool.length === 0) tempPool = [...CITY_MISSIONS_POOL];
            const randIdx = Math.floor(Math.random() * tempPool.length);
            currentTriad.push(tempPool[randIdx].id);
            tempPool.splice(randIdx, 1);
        }
        localStorage.setItem('khamach_active_triad_ids', JSON.stringify(currentTriad));
    }
    
    currentTriad.forEach(mId => {
        const mission = CITY_MISSIONS_POOL.find(m => m.id === mId);
        if (!mission) return;
        
        const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${mission.id}`) === 'true';
        const isHeroBusy = localStorage.getItem(`khamach_hero_busy_${mission.allowedHero}`) === 'true';
        
        const currentFatigue = Math.round(getHeroFatigue(mission.allowedHero));
        const reductionMultiplier = 1 - (currentFatigue / 100);
        const calculatedReward = Math.max(0, Math.round(mission.reward * reductionMultiplier));
        
        const card = document.createElement('div');
        card.style.background = "rgba(25, 20, 18, 0.9)";
        card.style.border = "1px solid #544432";
        card.style.padding = "8px 10px";
        card.style.borderRadius = "3px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "4px";
        
        let actionHTML = '';
        if (isThisMissionActive) {
            const startTimestamp = parseInt(localStorage.getItem(`khamach_mission_start_${mission.id}`) || '0');
            const elapsed = Date.now() - startTimestamp;
            const remaining = Math.max(0, mission.durationMs - elapsed);
            
            if (remaining > 0) {
                const min = Math.floor(remaining / 60000);
                const sec = Math.floor((remaining % 60000) / 1000);
                actionHTML = `<div style="color:#ff4500; font-weight:bold; font-size:11px; text-align:center; padding:4px; border:1px dashed #ff4500;">⏱️ В пути: ${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}</div>`;
            }
        } else if (isHeroBusy) {
            actionHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px;" disabled>Боец на задании</button>`;
        } else {
            actionHTML = `<button class="menu-btn" style="padding:4px; font-size:11px; background:#1d3a1e; height:28px;" onclick="startMission('${mission.id}', '${mission.allowedHero}', ${calculatedReward})">Отправить ${mission.heroName}</button>`;
        }
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #e6c280; font-size: 12px;">
                <span>${mission.title}</span>
                <span style="color: #ffd700;">🪙 ${calculatedReward} <span style="font-size:9px; color:#8a7350; font-weight:normal;">(база: ${mission.reward})</span></span>
            </div>
            <div style="font-size: 11px; color: #bfae96; line-height: 1.2;">${mission.text}</div>
            <div style="font-size: 10px; color: #ffb3ba;">🥱 Свежесть ${mission.heroName}: Усталость ${currentFatigue}% (Доход: ${Math.round(reductionMultiplier * 100)}%)</div>
            <div style="margin-top: 2px;">${actionHTML}</div>
        `;
        container.appendChild(card);
    });
}

window.startMission = function(missionId, heroId, finalExpectedReward) {
    const fatigueBefore = getHeroFatigue(heroId);
    
    localStorage.setItem(`khamach_hero_busy_${heroId}`, 'true');
    localStorage.setItem(`khamach_mission_active_${missionId}`, 'true');
    localStorage.setItem(`khamach_mission_start_${missionId}`, Date.now().toString());
    localStorage.setItem(`khamach_mission_reward_frozen_${missionId}`, finalExpectedReward.toString());
    
    setHeroFatigue(heroId, fatigueBefore + 15);
    
    if (typeof addChronicleLog === 'function') {
        addChronicleLog(`ОТПРАВЛЕН: Боец [${heroId}] отправлен на поручение за 🪙 ${finalExpectedReward}.`);
    }
    
    alert(`Боец успешно отправлен! Усталость выросла на +15%. Контракт зафиксирован.`);
    renderMissionsDOM();
};

window.checkAndProcessMissionsBackground = function() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        if (localStorage.getItem(`khamach_hero_busy_${id}`) !== 'true') {
            const current = getHeroFatigue(id);
            if (current > 0) setHeroFatigue(id, current - 0.0028); 
        }
    });

    let activeMissionsJSON = localStorage.getItem('khamach_active_triad_ids');
    if (!activeMissionsJSON) return;
    
    let currentTriad = [];
    try { currentTriad = JSON.parse(activeMissionsJSON); } catch(e) { return; }
    
    let stateChanged = false;
    
    currentTriad.forEach((mId, index) => {
        const isThisMissionActive = localStorage.getItem(`khamach_mission_active_${mId}`) === 'true';
        if (!isThisMissionActive) return;
        
        const mission = CITY_MISSIONS_POOL.find(m => m.id === mId);
        if (!mission) return;
        
        const startTimestamp = parseInt(localStorage.getItem(`khamach_mission_start_${mission.id}`) || '0');
        
        if (Date.now() - startTimestamp >= mission.durationMs) {
            localStorage.removeItem(`khamach_hero_busy_${mission.allowedHero}`);
            localStorage.removeItem(`khamach_mission_active_${mission.id}`);
            localStorage.removeItem(`khamach_mission_start_${mission.id}`);
            
            const finalReward = parseInt(localStorage.getItem(`khamach_mission_reward_frozen_${mission.id}`) || '0');
            localStorage.removeItem(`khamach_mission_reward_frozen_${mission.id}`);
            
            if (typeof addPlayerGold === 'function') addPlayerGold(finalReward);
            if (typeof addChronicleLog === 'function') {
                addChronicleLog(`АВТО-ВЫПОЛНЕНО: ${mission.heroName} успешно вернулся и принес 🪙 ${finalReward} золота.`);
            }
            
            // Роллим новое случайное задание взамен выполненного в этот слот
            let tempPool = CITY_MISSIONS_POOL.filter(m => !currentTriad.includes(m.id));
            if (tempPool.length === 0) tempPool = [...CITY_MISSIONS_POOL];
            const randMission = tempPool[Math.floor(Math.random() * tempPool.length)];
            
            currentTriad[index] = randMission.id;
            stateChanged = true;
        }
    });
    
    if (stateChanged) {
        localStorage.setItem('khamach_active_triad_ids', JSON.stringify(currentTriad));
    }
    
    const screenMissions = document.getElementById('missions-screen');
    if (screenMissions && screenMissions.style.display !== 'none') {
        renderMissionsDOM();
    }
};
