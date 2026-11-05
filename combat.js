/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК СУПЕРСИЛ (v0.7.0-BETA)
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
    combatData.playerAP = 1;
    combatData.currentRound = 1;
    combatData.tankTaunting = false;
    combatData.dragonBlinded = false;
    combatData.isActionPhase = false;
    
    combatData.squad.forEach(hero => {
        hero.hp = hero.maxHP;
        hero.sp = 0;
    });
    
    const endTurnBtn = document.getElementById('end-turn-btn');
    if (endTurnBtn) endTurnBtn.style.display = 'none';
    
    document.getElementById('combat-ap-display').innerText = "Сделайте ход на поле!";
    document.getElementById('combat-ap-display').style.color = "#ffd700";
    
    buildDragonDOM();
    updateCombatInterfaceDOM();
    
    if (typeof initMatch3Board === 'function') {
        initMatch3Board();
    }
}

function applyRuneCombination(effects) {
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
    
    updateCombatInterfaceDOM();
}

function usePlayerActionPoint() {
    combatData.playerAP = 0;
    updateCombatInterfaceDOM();
    
    if (typeof isBoardLocked !== 'undefined') isBoardLocked = true;
    
    document.getElementById('combat-ap-display').innerText = "Ход Дракона...";
    document.getElementById('combat-ap-display').style.color = "#ff4500";
    
    setTimeout(executeDragonTurnAI, 800);
}

function executeDragonTurnAI() {
    if (combatData.dragonHP <= 0) return;

    const dragonModel = document.getElementById('dragon-model');
    const fireFx = document.getElementById('dragon-fire-fx');

    if (dragonModel) {
        dragonModel.classList.remove('dragon-idle');
        dragonModel.classList.add('dragon-attacking');
    }

    // Первый уровень дракона: всегда базовая точечная атака (20 ед. урона)
    let baseDamage = 20;

    // Если Лучник ослепил дракона Суперсилой, урон режется на 50%
    if (combatData.dragonBlinded) {
        baseDamage = Math.round(baseDamage * 0.5);
        combatData.dragonBlinded = false; 
    }

    let tankHero = combatData.squad.find(h => h.id === "tank");

    // ПРАВИЛО ПРОВОКАЦИИ И РАНДОМА ДЛЯ 1-ГО УРОВНЯ
    if (combatData.tankTaunting && tankHero && tankHero.hp > 0) {
        tankHero.hp = Math.max(0, tankHero.hp - baseDamage);
        combatData.tankTaunting = false; // Провокация израсходована
    } else {
        // Провокации нет -> Дракон наносит точечный урон по случайному живому герою
        let aliveHeroes = combatData.squad.filter(h => h.hp > 0);
        if (aliveHeroes.length > 0) {
            let target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            target.hp = Math.max(0, target.hp - baseDamage);
        }
    }

    updateCombatInterfaceDOM();
    
    setTimeout(() => {
        if (dragonModel) {
            dragonModel.classList.remove('dragon-attacking');
            dragonModel.classList.add('dragon-idle');
        }
        if (fireFx) fireFx.classList.remove('active');
        
        // Включаем ручную фазу приказов для игрока
        combatData.isActionPhase = true;
        
        document.getElementById('combat-ap-display').innerText = "Фаза приказов: активируйте Суперсилы!";
        document.getElementById('combat-ap-display').style.color = "#2ecc71";
        
        const endTurnBtn = document.getElementById('end-turn-btn');
        if (endTurnBtn) endTurnBtn.style.display = 'block';
        
        updateCombatInterfaceDOM();
        checkBattleResolution();
    }, 1200);
}

function activateHeroSuperpower(heroId) {
    if (!combatData.isActionPhase) return;
    
    let hero = combatData.squad.find(h => h.id === heroId);
    if (!hero || hero.hp <= 0 || hero.sp < hero.maxSP) return;
    
    hero.sp = 0; 
    
    if (typeof playMatch3Sound === 'function') {
        playMatch3Sound(hero.icon);
    }
    
    switch(heroId) {
        case "tank": // Танк только провоцирует босса на следующий раунд
            combatData.tankTaunting = true;
            break;
            
        case "damage": // Дамагер наносит чистый урон
            combatData.dragonHP = Math.max(0, combatData.dragonHP - 120);
            break;
            
        case "archer": // Лучник снижает силу следующей атаки на 50%
            combatData.dragonBlinded = true;
            break;
            
        case "mage": // Маг лечит здоровье всей четверке сразу
            combatData.squad.forEach(h => {
                if (h.hp > 0) h.hp = Math.min(h.maxHP, h.hp + 25);
            });
            break;
    }
    
    updateCombatInterfaceDOM();
    checkBattleResolution();
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
    if (roundDisp) roundDisp.innerText = `Раунд: ${combatData.currentRound}`;
    
    const shieldDisp = document.getElementById('combat-shield-display');
    if (shieldDisp) {
        if (combatData.tankTaunting) {
            shieldDisp.style.display = 'block';
        } else {
            shieldDisp.style.display = 'none';
        }
    }
    
    const squadMatrix = document.getElementById('squad-matrix');
    if (squadMatrix) {
        squadMatrix.innerHTML = '';
        combatData.squad.forEach(hero => {
            const card = document.createElement('div');
            card.className = 'hero-gothic-card';
            
            // Ореол зажигается только если накоплено 100% энергии И идет фаза приказов
            let isReady = (hero.sp >= hero.maxSP && hero.hp > 0);
            if (isReady && combatData.isActionPhase) {
                card.classList.add('ready-glow');
            }
            if (hero.hp <= 0) {
                card.style.opacity = '0.3';
                card.style.filter = 'grayscale(1)';
            }
            
            let hpPct = (hero.hp / hero.maxHP) * 100;
            let spPct = (hero.sp / hero.maxSP) * 100;
            
            card.innerHTML = `
                <div class="hero-card-avatar" style="color: ${hero.color};">${hero.icon}</div>
                <div class="hero-card-name">${hero.name}</div>
                
                <!-- Шкала Здоровья (Красная) -->
                <div class="hero-bar-container">
                    <div class="hero-bar-fill hp-fill" style="width: ${hpPct}%;"></div>
                    <div class="hero-bar-text">${hero.hp}/${hero.maxHP}</div>
                </div>
                
                <!-- Шкала Суперсилы (Золотая) -->
                <div class="hero-bar-container" style="border-color: #5c4314; background: #0f0a02;">
                    <div class="hero-bar-fill sp-fill" style="width: ${spPct}%;"></div>
                    <div class="hero-bar-text" style="color: #ffd700;">SP ${Math.round(spPct)}%</div>
                </div>
            `;
            
            card.addEventListener('click', () => {
                if (hero.hp > 0 && hero.sp >= hero.maxSP && combatData.isActionPhase) {
                    activateHeroSuperpower(hero.id);
                }
            });
            
            squadMatrix.appendChild(card);
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
