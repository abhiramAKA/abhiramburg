/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК РЕЙДОВ (БОЕВОЙ МАРШ - v0.6.0-beta.31)
   ========================================================================== */

function buildDragonDOM() {
    const raidZone = document.getElementById('dragon-raid-zone');
    if (!raidZone) return;

    raidZone.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'dragon-container';

    const model = document.createElement('div');
    model.id = 'dragon-model';
    model.className = 'dragon-idle';
    model.innerText = '🐉';
    model.style.fontSize = '70px';
    model.style.display = 'flex';
    model.style.alignItems = 'center';
    model.style.justifyContent = 'center';

    const fireFx = document.createElement('div');
    fireFx.id = 'dragon-fire-fx';
    fireFx.className = 'fire-breath-fx';

    container.appendChild(model);
    container.appendChild(fireFx);
    raidZone.appendChild(container);
}

function startCombatSession() {
    combatData.dragonHP = 1000;
    combatData.playerAP = 3;
    combatData.currentRound = 1;
    combatData.playerShield = 0;
    combatData.squad.forEach(hero => hero.hp = hero.maxHP);
    
    if (typeof changeMusicState === 'function') {
        changeMusicState('combat');
    }
    
    buildDragonDOM();
    updateCombatInterfaceDOM();
    
    if (typeof initMatch3Board === 'function') {
        initMatch3Board();
    }
}

function applyRuneCombination(effects) {
    let totalDamage = (effects['🔥'] * 15) + (effects['⚡️'] * 10);
    if (totalDamage > 0) {
        combatData.dragonHP = Math.max(0, combatData.dragonHP - totalDamage);
    }
    
    let totalHeal = effects['💚'] * 8;
    if (totalHeal > 0) {
        combatData.squad.forEach(hero => {
            if (hero.hp > 0) hero.hp = Math.min(hero.maxHP, hero.hp + totalHeal);
        });
    }

    let totalShieldGain = effects['🛡️'] * 12;
    if (totalShieldGain > 0) {
        combatData.playerShield += totalShieldGain;
    }
    
    updateCombatInterfaceDOM();
    checkBattleResolution();
}

function usePlayerActionPoint() {
    combatData.playerAP--;
    updateCombatInterfaceDOM();
    
    if (combatData.playerAP <= 0) {
        setTimeout(executeDragonTurnAI, 800);
    }
}

function damageSquadWithShieldAbsorption(incomingDamage, hitAll = false) {
    let currentDamage = incomingDamage;

    if (combatData.playerShield > 0) {
        if (combatData.playerShield >= currentDamage) {
            combatData.playerShield -= currentDamage;
            currentDamage = 0;
        } else {
            currentDamage -= combatData.playerShield;
            combatData.playerShield = 0;
        }
    }

    if (currentDamage > 0) {
        if (hitAll) {
            combatData.squad.forEach(hero => {
                hero.hp = Math.max(0, hero.hp - currentDamage);
            });
        } else {
            let aliveHeroes = combatData.squad.filter(h => h.hp > 0);
            if (aliveHeroes.length > 0) {
                let target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
                target.hp = Math.max(0, target.hp - currentDamage);
            }
        }
    }
}

function executeDragonTurnAI() {
    if (combatData.dragonHP <= 0) return;

    const dragonModel = document.getElementById('dragon-model');
    const fireFx = document.getElementById('dragon-fire-fx');

    if (dragonModel) {
        dragonModel.classList.remove('dragon-idle');
        dragonModel.classList.add('dragon-attacking');
    }

    if (combatData.currentRound % 3 === 0) {
        if (fireFx) fireFx.classList.add('active');
        damageSquadWithShieldAbsorption(35, true);
    } else {
        damageSquadWithShieldAbsorption(20, false);
    }

    updateCombatInterfaceDOM();
    
    setTimeout(() => {
        if (dragonModel) {
            dragonModel.classList.remove('dragon-attacking');
            dragonModel.classList.add('dragon-idle');
        }
        if (fireFx) {
            fireFx.classList.remove('active');
        }
        
        combatData.currentRound++;
        combatData.playerAP = combatData.playerMaxAP;
        updateCombatInterfaceDOM();
        checkBattleResolution();
    }, 1500);
}

function updateCombatInterfaceDOM() {
    const hpBar = document.getElementById('boss-hp-bar');
    const hpText = document.getElementById('boss-hp-text');
    if (hpBar && hpText) {
        let pct = (combatData.dragonHP / combatData.dragonMaxHP) * 100;
        hpBar.style.width = pct + '%';
        hpText.innerText = `${combatData.dragonHP} / ${combatData.dragonMaxHP}`;
    }
    
    const roundDisp = document.getElementById('combat-round-display');
    const apDisp = document.getElementById('combat-ap-display');
    if (roundDisp) roundDisp.innerText = `Раунд: ${combatData.currentRound}`;
    if (apDisp) apDisp.innerText = `Очки Действия: ${combatData.playerAP} / ${combatData.playerMaxAP}`;
    
    const shieldDisp = document.getElementById('combat-shield-display');
    if (shieldDisp) {
        if (combatData.playerShield > 0) {
            shieldDisp.style.display = 'block';
            shieldDisp.innerText = `🛡️ Защита отряда: +${combatData.playerShield}`;
        } else {
            shieldDisp.style.display = 'none';
        }
    }
    
    const squadMatrix = document.getElementById('squad-matrix');
    if (squadMatrix) {
        squadMatrix.innerHTML = '';
        combatData.squad.forEach(hero => {
            const badge = document.createElement('div');
            badge.style.display = 'flex';
            badge.style.alignItems = 'center';
            badge.style.gap = '4px';
            badge.style.background = 'rgba(30, 25, 20, 0.9)';
            badge.style.border = '1px solid #8a7350';
            badge.style.padding = '3px 8px';
            badge.style.borderRadius = '12px';
            badge.style.fontSize = '12px';
            badge.style.color = hero.hp <= 0 ? '#555' : '#fff';
            badge.style.opacity = hero.hp <= 0 ? '0.5' : '1';
            
            badge.innerHTML = `
                <span>${hero.icon}</span>
                <span style="font-weight:bold;">${hero.hp}</span>
                <span style="color:#8a7350; font-size:10px;">/${hero.maxHP}</span>
            `;
            squadMatrix.appendChild(badge);
        });
    }
}

function checkBattleResolution() {
    if (combatData.dragonHP <= 0) {
        alert("ВЕЛИКАЯ ПОБЕДА! Дракон повержен!");
        showScreen('main-menu');
    } else {
        let allDead = combatData.squad.every(hero => hero.hp <= 0);
        if (allDead) {
            alert("ОТРЯД ПАЛ!");
            showScreen('main-menu');
        }
    }
}
