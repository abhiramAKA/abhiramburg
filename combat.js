/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК СУПЕРСИЛ И БАЛАНСА БОССА (v2.3.0-BETA)
   ========================================================================== */

let activeSessionLevel = 1;

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

function chargeHeroSuperpowers(effects) {
    combatData.squad.forEach(hero => {
        if (hero.hp <= 0) return;
        let icon = hero.id === 'tank' ? '🛡️' : hero.id === 'damage' ? '🔥' : hero.id === 'archer' ? '⚡' : '💚';
        if (effects[icon]) {
            let charge = effects[icon] * 6;
            hero.sp = Math.min(hero.maxSP, hero.sp + charge);
        }
    });
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
}

function usePlayerActionPoint() {
    combatData.playerAP--;
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    if (combatData.playerAP <= 0) {
        if (typeof isBoardLocked !== 'undefined') isBoardLocked = true;
        document.getElementById('combat-ap-display').innerText = "Ход Дракона...";
        document.getElementById('combat-ap-display').style.color = "#ff4500";
        setTimeout(executeDragonTurnAI, 700);
    }
}

function executeDragonTurnAI() {
    if (combatData.dragonHP <= 0) return;
    const dModel = document.getElementById('dragon-model');
    if (dModel) { dModel.classList.remove('dragon-idle'); dModel.classList.add('dragon-attacking'); }

    const isAoEPhase = (activeSessionLevel >= 5) && (combatData.currentRound % 4 === 0);

    let baseDamage = isAoEPhase ? (20 + activeSessionLevel * 6) : (12 + activeSessionLevel * 4);
    if (combatData.dragonBlinded) { baseDamage = Math.round(baseDamage * 0.5); combatData.dragonBlinded = false; }

    if (isAoEPhase) {
        combatData.squad.forEach(h => { if (h.hp > 0) h.hp = Math.max(0, h.hp - baseDamage); });
    } else {
        let target = combatData.squad.find(h => h.id === "tank");
        if (!combatData.tankTaunting || !target || target.hp <= 0) {
            let alive = combatData.squad.filter(h => h.hp > 0);
            target = alive.length > 0 ? alive[Math.floor(Math.random() * alive.length)] : null;
        }
        if (target) target.hp = Math.max(0, target.hp - baseDamage);
        combatData.tankTaunting = false; 
    }

    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    setTimeout(() => {
        if (dModel) { dModel.classList.remove('dragon-attacking'); dModel.classList.add('dragon-idle'); }
        combatData.currentRound++; combatData.playerAP = combatData.playerMaxAP;
        if (typeof isBoardLocked !== 'undefined') isBoardLocked = false;
        document.getElementById('combat-ap-display').innerText = "Сделайте ход на поле!";
        document.getElementById('combat-ap-display').style.color = "#ffd700";
        checkBattleResolution();
    }, 1000);
}

function activateHeroSuperpower(heroId) {
    let hero = combatData.squad.find(h => h.id === heroId);
    if (!hero || hero.hp <= 0 || hero.sp < hero.maxSP) return;
    
    hero.sp = 0;
    if (typeof playMatch3Sound === 'function') playMatch3Sound(hero.icon);
    
    const damageLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('damage') : 0;
    const archerLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('archer') : 0;
    const mageLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel('mage') : 0;

    let dmgUnyielding = 120 + damageLvl * 15;
    let archerUnyielding = 25 + archerLvl * 10;
    let mageHealAmount = 25 + mageLvl * 5;
    
    switch(heroId) {
        case "tank": combatData.tankTaunting = true; combatData.dragonHP = Math.max(0, combatData.dragonHP - 25); break;
        case "damage": combatData.dragonHP = Math.max(0, combatData.dragonHP - dmgUnyielding); break;
        case "archer": combatData.dragonBlinded = true; combatData.dragonHP = Math.max(0, combatData.dragonHP - archerUnyielding); break;
        case "mage":
            combatData.squad.forEach(h => { if (h.hp > 0) h.hp = Math.min(h.maxHP, h.hp + mageHealAmount); });
            combatData.dragonHP = Math.max(0, combatData.dragonHP - 25);
            break;
    }
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    checkBattleResolution();
}

function checkBattleResolution() {
    if (combatData.dragonHP <= 0) {
        const earnedGold = Math.floor(activeSessionLevel * 50 + Math.random() * 50);
        
        const lootTypes = ['plasma', 'blood', 'scale', 'tears']; // Заменено на scale
        const lootNames = ['🛡️ Плазма', '🔥 Кровь', '🪶 Чешуя', '💚 Слезы'];
        const randIndex = Math.floor(Math.random() * lootTypes.length);
        
        let lootKey = lootTypes[randIndex];
        let lootName = lootNames[randIndex];

        if (typeof addPlayerResource === 'function') {
            addPlayerResource(lootKey, 1);
        }
        
        alert(`ВЕЛИКАЯ ПОБЕДА! Дракон Тира ${activeSessionLevel} повержен!\nТрофеи: 🪙 ${earnedGold} Золота!\n📦 На склад Цитадели доставлено: ${lootName} (1 шт).`);
        
        if (typeof addPlayerGold === 'function') addPlayerGold(earnedGold);
        if (typeof saveCompletedTier === 'function') saveCompletedTier(activeSessionLevel);
        if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
        showScreen('main-menu');
    } else if (combatData.squad.every(hero => hero.hp <= 0)) {
        alert("ОТРЯД ПАЛ В БИТВЕ!");
        if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
        showScreen('main-menu');
    }
}
