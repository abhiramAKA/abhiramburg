/* ==========================================================================
   КХАМАЧ — МОДУЛЬ РЕНДЕРИНГА БОЕВОГО ИНТЕРФЕЙСА (НОВЫЙ МОДУЛЬ - v0.8.3-BETA)
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
        shieldDisp.style.display = combatData.tankTaunting ? 'block' : 'none';
    }
    
    const squadMatrix = document.getElementById('squad-matrix');
    if (!squadMatrix) return;
    
    squadMatrix.innerHTML = '';
    combatData.squad.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-gothic-card';
        
        let isReady = (hero.sp >= hero.maxSP && hero.hp > 0);
        if (isReady) card.classList.add('ready-glow');
        if (hero.hp <= 0) {
            card.style.opacity = '0.3';
            card.style.filter = 'grayscale(1)';
        }
        
        let hpPct = (hero.hp / hero.maxHP) * 100;
        let spPct = (hero.sp / hero.maxSP) * 100;
        
        card.innerHTML = `
            <div class="hero-card-avatar" style="color: ${hero.color};">${hero.icon}</div>
            <div class="hero-card-name">${hero.name}</div>
            <div class="hero-bar-container">
                <div class="hero-bar-fill hp-fill" style="width: ${hpPct}%;"></div>
                <div class="hero-bar-text">${hero.hp}/${hero.maxHP}</div>
            </div>
            <div class="hero-bar-container" style="border-color: #5c4314; background: #0f0a02;">
                <div class="hero-bar-fill sp-fill" style="width: ${spPct}%;"></div>
                <div class="hero-bar-text" style="color: #ffd700;">SP ${Math.round(spPct)}%</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (hero.hp > 0 && hero.sp >= hero.maxSP && typeof activateHeroSuperpower === 'function') {
                activateHeroSuperpower(hero.id);
            }
        });
        squadMatrix.appendChild(card);
    });
}
