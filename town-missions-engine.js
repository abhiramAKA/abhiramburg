/* ==========================================================================
   КХАМАЧ — ВЫЧИСЛИТЕЛЬНЫЙ ДВИЖОК ТАЙМЕРОВ И УСТАЛОСТИ (v1.0.0-BETA)
   ========================================================================== */

function getHeroFatigue(heroId) {
    return Math.min(100, Math.max(0, parseFloat(localStorage.getItem(`khamach_fatigue_${heroId}`) || '0')));
}

function setHeroFatigue(heroId, value) {
    localStorage.setItem(`khamach_fatigue_${heroId}`, Math.min(100, Math.max(0, Math.round(value))));
}

function startMission(missionId, heroId, finalExpectedReward) {
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
    if (typeof renderMissionsDOM === 'function') renderMissionsDOM();
}

function checkAndProcessMissionsBackground() {
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
        if (typeof renderMissionsDOM === 'function') renderMissionsDOM();
    }
}
