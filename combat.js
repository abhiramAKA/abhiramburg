function startCombatSession(level) {
    activeSessionLevel = level || 1;
    combatData.currentRound = 1;
    
    const calculatedHP = 120 + (activeSessionLevel - 1) * 60;
    combatData.dragonMaxHP = calculatedHP; 
    combatData.dragonHP = calculatedHP;
    
    combatData.playerMaxAP = 1;
    combatData.playerAP = combatData.playerMaxAP;
    
    const shieldPerk = typeof getMetaPerkValue === 'function' ? getMetaPerkValue('khamach_perk_shield') : 0;
    const spPerk = typeof getMetaPerkValue === 'function' ? getMetaPerkValue('khamach_perk_sp') : 0;
    
    combatData.tankTaunting = shieldPerk > 0; 
    combatData.dragonBlinded = false;
    combatData.isActionPhase = false;
    
    const bossNameEl = document.getElementById('boss-name');
    if (bossNameEl) {
        const elements = ["ОГНЯ", "ЛЬДА", "ТЬМЫ", "СВЕТА"];
        const currentElement = elements[(activeSessionLevel - 1) % 4];
        bossNameEl.innerText = `ДРАКОН ${currentElement} (ТИР ${activeSessionLevel})`;
    }
    
    const tankLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('tank') : 0;
    const tankHpBonus = tankLvl * 20;

    // ВАЖНО: Фильтруем отряд, оставляя только тех, кто НЕ на поручении
    combatData.squad = [
        { id: "tank", name: "Танк", hp: 150, maxHP: 150, sp: 0, maxSP: 100, icon: "🛡️", color: "#4a90e2" },
        { id: "damage", name: "Дамагер", hp: 90, maxHP: 90, sp: 0, maxSP: 100, icon: "🔥", color: "#ff4500" },
        { id: "archer", name: "Лучник", hp: 100, maxHP: 100, sp: 0, maxSP: 100, icon: "⚡", color: "#f1c40f" },
        { id: "mage", name: "Маг", hp: 80, maxHP: 80, sp: 0, maxSP: 100, icon: "💚", color: "#2ecc71" }
    ].filter(hero => localStorage.getItem(`khamach_hero_busy_${hero.id}`) !== 'true');

    if (combatData.squad.length === 0) {
        alert("Ошибка: Все ваши воины на сменах! Некому идти в бой.");
        showScreen('main-menu');
        return;
    }
    
    combatData.squad.forEach(hero => {
        let base = (hero.id === "tank" ? 150 : hero.id === "damage" ? 90 : hero.id === "archer" ? 100 : 80);
        hero.maxHP = base + (hero.id === "tank" ? tankHpBonus : 0);
        hero.hp = hero.maxHP;
        hero.sp = Math.min(hero.maxSP, spPerk * 5); 
    });
    
    document.getElementById('combat-ap-display').innerText = "Сделайте ход на поле!";
    document.getElementById('combat-ap-display').style.color = "#ffd700";
    
    if (typeof buildDragonDOM === 'function') buildDragonDOM();
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    if (typeof initMatch3Board === 'function') initMatch3Board();
}
