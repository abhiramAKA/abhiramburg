/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК РЕЙДОВ (v0.6.0-alpha.8)
   ========================================================================== */

// Динамическое создание блока 3D Дракона на экране
function buildDragonDOM() {
    const raidZone = document.getElementById('dragon-raid-zone');
    if (!raidZone) return;

    raidZone.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'dragon-container';
    container.style.width = '100%';
    container.style.height = '150px';

    const model = document.createElement('div');
    model.id = 'dragon-model';
    model.className = 'dragon-idle';

    const fireFx = document.createElement('div');
    fireFx.id = 'dragon-fire-fx';
    fireFx.className = 'fire-breath-fx';

    container.appendChild(model);
    container.appendChild(fireFx);
    raidZone.appendChild(container);
}

// Запуск боевого сеанса
function startCombatSession() {
    combatData.dragonHP = 1000;
    combatData.playerAP = 3;
    combatData.currentRound = 1;
    combatData.squad.forEach(hero => hero.hp = hero.maxHP);
    
    // Собираем Дракона и обновляем текст характеристик персонажей
    buildDragonDOM();
    updateCombatInterfaceDOM();
    
    // Запускаем генерацию рун из модуля match3.js
    if (typeof initMatch3Board === 'function') {
        initMatch3Board();
    } else {
        console.error("Сбой: Модуль match3.js не предоставил функцию initMatch3Board!");
    }
}

// Применение собранных комбинаций
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
    
    updateCombatInterfaceDOM();
    checkBattleResolution();
}

// Трата ОД
function usePlayerActionPoint() {
    combatData.playerAP--;
    updateCombatInterfaceDOM();
    
    if (combatData.playerAP <= 0) {
        setTimeout(executeDragonTurnAI, 800);
    }
}

// Действия ИИ Дракона
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
        
        combatData.squad.forEach(hero => {
            hero.hp = Math.max(0, hero.hp - 35);
        });
    } else {
        let aliveHeroes = combatData.squad.filter(h => h.hp > 0);
        if (aliveHeroes.length > 0) {
            let target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            target.hp = Math.max(0, target.hp - 20);
        }
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

// Отрисовка значений ХП отряда и здоровья босса
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
    
    const squadMatrix = document.getElementById('squad-matrix');
    if (squadMatrix) {
        squadMatrix.innerHTML = '';
        combatData.squad.forEach(hero => {
            const card = document.createElement('div');
            card.style.background = 'rgba(25, 20, 15, 0.8)';
            card.style.border = hero.hp <= 0 ? '1px solid #333' : '1px solid #8a7350';
            card.style.padding = '6px';
            card.style.fontSize = '12px';
            card.style.textAlign = 'left';
            card.style.opacity = hero.hp <= 0 ? '0.4' : '1';
            
            card.innerHTML = `
                <div style="font-weight:bold; color:#e6c280;">${hero.name} (${hero.role})</div>
                <div style="color:#bfae96;">ХП: ${hero.hp} / ${hero.maxHP}</div>
            `;
            squadMatrix.appendChild(card);
        });
    }
}

// Определение победы
function checkBattleResolution() {
    if (combatData.dragonHP <= 0) {
        alert("ВЕЛИКАЯ ПОБЕДА! Дракон повержен, руны Горнила принадлежат вам!");
        showScreen('main-menu');
    } else {
        let allDead = combatData.squad.every(hero => hero.hp <= 0);
        if (allDead) {
            alert("ОТРЯД ПАЛ! Дракон сжег ваши надежды. Попробуйте снова.");
            showScreen('main-menu');
        }
    }
}
