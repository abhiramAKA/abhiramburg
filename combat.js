/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК СУПЕРСИЛ (НАГРАДА ЗОЛОТОМ - v0.8.7-BETA)
   ========================================================================== */

let activeSessionLevel = 1;

function startCombatSession(level) {
    activeSessionLevel = level || 1;
    combatData.currentRound = 1;
    
    const calculatedHP = 120 + (activeSessionLevel - 1) * 60;
    combatData.dragonMaxHP = calculatedHP; 
    combatData.dragonHP = calculatedHP;
    
    combatData.playerAP = 1;
    combatData.tankTaunting = false;
    combatData.dragonBlinded = false;
    combatData.isActionPhase = false;
    
    const bossNameEl = document.getElementById('boss-name');
    if (bossNameEl) {
        const elements = ["ОГНЯ", "ЛЬДА", "ТЬМЫ", "СВЕТА"];
        const currentElement = elements[(activeSessionLevel - 1) % 4];
        bossNameEl.innerText = `ДРАКОН ${currentElement} (ТИР ${activeSessionLevel})`;
    }
    
    combatData.squad.forEach(hero => {
        hero.hp = hero.maxHP;
        hero.sp = 0;
    });
    
    document.getElementById('combat-ap-display').innerText = "Сделайте ход на поле!";
    document.getElementById('combat-ap-display').style.color = "#ffd700";
    
    if (typeof buildDragonDOM === 'function') buildDragonDOM();
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    if (typeof initMatch3Board === 'function') initMatch3Board();
}

function chargeHeroSuperpowers(effects) {
    if (effects['🛡️']) {
        let t = combatData.squad.find(h => h.id === "tank");
        if (t && t.hp > 0) t.sp = Math.min(t.maxSP, t.sp + effects['🛡️'] * 6);
    }
    if (effects['🔥']) {
        let d = combatData.squad.find(h => h.id === "damage");
        if (d && d.hp > 0) d.sp = Math.min(d.maxSP, d.sp + effects['🔥'] * 6);
    }
    if (effects['🎯']) {
        let a = combatData.squad.find(h => h.id === "archer");
        if (a && a.hp > 0) a.sp = Math.min(a.maxSP, a.sp + effects['🎯'] * 6);
    }
    if (effects['💚']) {
        let m = combatData.squad.find(h => h.id === "mage");
        if (m && m.hp > 0) m.sp = Math.min(m.maxSP, m.sp + effects['💚'] * 6);
    }
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
}

function usePlayerActionPoint() {
    combatData.playerAP = 0;
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    
    if (typeof isBoardLocked !== 'undefined') isBoardLocked = true;
    document.getElementById('combat-ap-display').innerText = "Ход Дракона...";
    document.getElementById('combat-ap-display').style.color = "#ff4500";
    
    setTimeout(executeDragonTurnAI, 700);
}

function executeDragonTurnAI() {
    if (combatData.dragonHP <= 0) return;

    const dragonModel = document.getElementById('dragon-model');
    if (dragonModel) {
        dragonModel.classList.remove('dragon-idle');
        dragonModel.classList.add('dragon-attacking');
    }

    let baseDamage = 15 + activeSessionLevel * 5;
    if (combatData.dragonBlinded) {
        baseDamage = Math.round(baseDamage * 0.5);
        combatData.dragonBlinded = false; 
    }

    let tankHero = combatData.squad.find(h => h.id === "tank");

    if (combatData.tankTaunting && tankHero && tankHero.hp > 0) {
        tankHero.hp = Math.max(0, tankHero.hp - baseDamage);
        combatData.tankTaunting = false; 
    } else {
        let aliveHeroes = combatData.squad.filter(h => h.hp > 0);
        if (aliveHeroes.length > 0) {
            let target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            target.hp = Math.max(0, target.hp - baseDamage);
        }
    }

    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    
    setTimeout(() => {
        if (dragonModel) {
            dragonModel.classList.remove('dragon-attacking');
            dragonModel.classList.add('dragon-idle');
        }
        
        combatData.currentRound++;
        combatData.playerAP = combatData.playerMaxAP;
        if (typeof isBoardLocked !== 'undefined') isBoardLocked = false;
        
        document.getElementById('combat-ap-display').innerText = "Сделайте ход на поле!";
        document.getElementById('combat-ap-display').style.color = "#ffd700";
        
        if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
        checkBattleResolution();
    }, 1000);
}

function activateHeroSuperpower(heroId) {
    let hero = combatData.squad.find(h => h.id === heroId);
    if (!hero || hero.hp <= 0 || hero.sp < hero.maxSP) return;
    
    hero.sp = 0; 
    if (typeof playMatch3Sound === 'function') playMatch3Sound(hero.icon);
    
    const subHeroDamage = 25;
    
    switch(heroId) {
        case "tank":
            combatData.tankTaunting = true;
            combatData.dragonHP = Math.max(0, combatData.dragonHP - subHeroDamage);
            break;
        case "damage":
            combatData.dragonHP = Math.max(0, combatData.dragonHP - 120);
            break;
        case "archer":
            combatData.dragonBlinded = true;
            combatData.dragonHP = Math.max(0, combatData.dragonHP - subHeroDamage);
            break;
        case "mage":
            combatData.squad.forEach(h => {
                if (h.hp > 0) h.hp = Math.min(h.maxHP, h.hp + 25);
            });
            combatData.dragonHP = Math.max(0, combatData.dragonHP - subHeroDamage);
            break;
    }
    
    if (typeof updateCombatInterfaceDOM === 'function') updateCombatInterfaceDOM();
    checkBattleResolution();
}

function checkBattleResolution() {
    if (combatData.dragonHP <= 0) {
        const earnedGold = Math.floor(activeSessionLevel * 50 + Math.random() * 50);
        alert(`ВЕЛИКАЯ ПОБЕДА! Дракон Тира ${activeSessionLevel} повержен!\nНаграда: 🪙 ${earnedGold} Золота!`);
        
        if (typeof addPlayerGold === 'function') {
            addPlayerGold(earnedGold);
        }
        if (typeof saveCompletedTier === 'function') {
            saveCompletedTier(activeSessionLevel);
        }
        if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
        showScreen('main-menu');
    } else {
        let allDead = combatData.squad.every(hero => hero.hp <= 0);
        if (allDead) {
            alert("ОТРЯД ПАЛ!");
            if (typeof stopBackgroundMusic === 'function') stopBackgroundMusic();
            showScreen('main-menu');
        }
    }
}
