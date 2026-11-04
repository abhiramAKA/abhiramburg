// Боевое ядро рейда. Интегрировано с глобальным стейтом game.js и системой ОД.

function setupBattleSession() {
    if (!combatData.currentRound) {
        combatData.currentRound = 1;
    }
    
    if (!document.getElementById('match3-board')) {
        if (typeof rebuildActionArea === 'function') rebuildActionArea();
    }
    if (typeof refreshBattleUI === 'function') refreshBattleUI();
}

function renderSquad() {
    const gridContainer = document.getElementById('squad-matrix');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    combatData.heroes.forEach(hero => {
        const card = document.createElement('div');
        card.style.cssText = `
            background: #1c1510; border: 1px solid #4a3e31; border-radius: 4px;
            padding: 6px; text-align: center; font-size: 11px; color: #e6c280;
            box-shadow: inset 0 0 10px #000; box-sizing: border-box;
            opacity: ${hero.hp <= 0 ? '0.4' : '1'};
            filter: ${hero.hp <= 0 ? 'grayscale(1)' : 'none'};
        `;
        
        card.innerHTML = `
            <div style="font-weight: bold; color: ${hero.hp <= 0 ? '#7a6b58' : '#e6c280'}">${hero.name}</div>
            <div style="font-size: 9px; color: #8c765c; margin: 2px 0;">[${hero.role}]</div>
            <div style="font-weight: bold; color: ${hero.hp <= (hero.maxHp * 0.3) ? '#ff4d4d' : '#4ade80'}">
                ❤️ ${Math.max(0, hero.hp)}/${hero.maxHp}
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function executeComboRules(matches, isFirstCascade = true) {
    if (combatData.dragonBoss.hp <= 0) return;

    let totalDamage = 0;
    let totalHeal = 0;
    let protectionActive = false;
    let logMessage = "";

    matches.forEach(match => {
        switch(match.type) {
            case '🔥':
                totalDamage += 45;
                logMessage += "🔥 Маг: Шар (45) ";
                break;
            case '💀':
                totalDamage += 30;
                logMessage += "💀 Воины: Натиск (30) ";
                break;
            case '🛡️':
                protectionActive = true;
                logMessage += "🛡️ Щиты! ";
                break;
            case '🧪':
                totalHeal += 25;
                break;
            case '💎':
                totalDamage += 60;
                logMessage += "💎 Бездна: Чистый (60) ";
                break;
        }
    });

    if (totalDamage > 0) {
        combatData.dragonBoss.hp -= totalDamage;
    }

    if (totalHeal > 0) {
        let wounded = combatData.heroes.filter(h => h.hp > 0 && h.hp < h.maxHp);
        if (wounded.length > 0) {
            let targetHero = wounded[Math.floor(Math.random() * wounded.length)];
            targetHero.hp = Math.min(targetHero.maxHp, targetHero.hp + totalHeal);
            logMessage += `🧪 Лечение: +${totalHeal} ОЗ `;
        } else {
            logMessage += "🧪 Алхимия: Все здоровы ";
        }
    }

    if (logMessage && typeof updateStatusPanel === 'function') {
        updateStatusPanel(logMessage.trim());
    }

    if (typeof applyBoardGravity === 'function') {
        applyBoardGravity(matches);
    }
    
    if (typeof refreshBattleUI === 'function') {
        refreshBattleUI();
    }

    let nextMatches = (typeof checkMatches === 'function') ? checkMatches() : [];

    if (nextMatches.length > 0 && combatData.dragonBoss.hp > 0) {
        setTimeout(() => {
            executeComboRules(nextMatches, false);
        }, 600);
    } else {
        combatData.ap--;
        
        if (typeof refreshBattleUI === 'function') {
            refreshBattleUI();
        }

        if (combatData.dragonBoss.hp <= 0) {
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel("🏆 ПОБЕДА! Древний змей повержен!");
            }
            isProcessingGrid = true;
            return;
        }

        if (combatData.ap <= 0) {
            isProcessingGrid = true;
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel("🐉 Ход Дракона! Защищайтесь...", true);
            }
            
            setTimeout(() => {
                handleDragonTurn(protectionActive);
            }, 1200);
        } else {
            isProcessingGrid = false;
            if (typeof renderMatch3Board === 'function') {
                renderMatch3Board();
            }
        }
    }
}

function handleDragonTurn(protectionActive) {
    const aliveHeroes = combatData.heroes.filter(h => h.hp > 0);
    
    if (aliveHeroes.length > 0) {
        if (combatData.turnCount % 3 === 0) {
            let dmg = protectionActive ? 10 : 25;
            aliveHeroes.forEach(h => { h.hp -= dmg; });
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel(`🐉 Дракон: [Дыхание Рока]! Все получили по ${dmg} урона.`);
            }
        } else {
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            let dmg = protectionActive ? 15 : 35;
            target.hp -= dmg;
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel(`🐉 Дракон бьет когтями! ${target.name} теряет ${dmg} ОЗ.`);
            }
        }
    }

    const survivors = combatData.heroes.filter(h => h.hp > 0);
    if (survivors.length === 0) {
        if (typeof updateStatusPanel === 'function') {
            updateStatusPanel("💀 ОТРАД УНИЧТОЖЕН. Защитники Абхирамбурга пали.", true);
        }
        return;
    }

    setTimeout(() => {
        combatData.ap = combatData.maxAp;
        combatData.turnCount++;
        isProcessingGrid = false;
        
        if (typeof updateStatusPanel === 'function') {
            updateStatusPanel(`⚔️ Раунд ${combatData.turnCount}. Ваш ход!`);
        }
        if (typeof refreshBattleUI === 'function') {
            refreshBattleUI();
        }
    }, 1500);
}
