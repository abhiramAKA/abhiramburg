/* ==========================================================================
   КХАМАЧ — ПОШАГОВЫЙ ТАКТИЧЕСКИЙ ДВИЖОК РЕЙДОВ (v0.6.0-alpha.2)
   ========================================================================== */

let combatData = {
    dragonHP: 1000,
    dragonMaxHP: 1000,
    playerAP: 3,
    playerMaxAP: 3,
    currentRound: 1,
    squad: [
        { name: "Воин", hp: 120, maxHP: 120, class: "warrior", role: "Атака/Щит" },
        { name: "Клирик", hp: 90, maxHP: 90, class: "cleric", role: "Лечение" }
    ]
};

// Динамическая сборка интерфейса Дракона (Соблюдение Strict Module Separation)
function buildDragonDOM() {
    const raidZone = document.getElementById('dragon-raid-zone');
    if (!raidZone) return;

    // Полностью очищаем зону перед созданием, чтобы избежать дубликатов
    raidZone.innerHTML = '';

    // Создаем контейнер
    const container = document.createElement('div');
    container.className = 'dragon-container';

    // Создаем модель дракона
    const model = document.createElement('div');
    model.id = 'dragon-model';
    model.className = 'dragon-idle';

    // Создаем слой эффекта огненного дыхания
    const fireFx = document.createElement('div');
    fireFx.id = 'dragon-fire-fx';
    fireFx.className = 'fire-breath-fx';

    // Собираем структуру воедино
    container.appendChild(model);
    container.appendChild(fireFx);
    raidZone.appendChild(container);
}

// Запуск боевого режима
function startCombatSession() {
    combatData.dragonHP = 1000;
    combatData.playerAP = 3;
    combatData.currentRound = 1;
    combatData.squad.forEach(hero => hero.hp = hero.maxHP);
    
    // Сначала динамически строим Дракона, затем обновляем интерфейсы
    buildDragonDOM();
    updateCombatInterfaceDOM();
    initMatch3Board();
}

// Применение собранных комбинаций рун игроком
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

// Трата Очков Действия (ОД) игрока при передвижении на поле
function usePlayerActionPoint() {
    combatData.playerAP--;
    updateCombatInterfaceDOM();
    
    if (combatData.playerAP <= 0) {
        setTimeout(executeDragonTurnAI, 800);
    }
}

// Пошаговый ИИ Дракона с воспроизведением анимаций огня и парения
function executeDragonTurnAI() {
    if (combatData.dragonHP <= 0) return;

    const dragonModel = document.getElementById('dragon-model');
    const fireFx = document.getElementById('dragon-fire-fx');

    // АКТИВАЦИЯ АНИМАЦИИ АТАКИ
    if (dragonModel) {
        dragonModel.classList.remove('dragon-idle');
        dragonModel.classList.add('dragon-attacking');
    }

    // Проверка на фазу массового Дыхания Рока (Каждый 3-й раунд)
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
    
    // Фаза завершения хода Дракона (через 1.5 секунды сброс в режим ожидания)
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

// Обновление всех шкал и текстовых полей боевого экрана
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

// Проверка исхода рейда (Победа / Поражение)
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
