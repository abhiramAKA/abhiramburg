// Боевое ядро рейда. Интегрировано с глобальным стейтом game.js и системой ОД.

function setupBattleSession() {
    // Если сессия не инициализирована в game.js, подтягиваем базовые параметры раундов
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
        // Стилизация карточек героев под Disciples 2
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

    // Суммируем эффекты от всех собранных комбинаций за один ход
    matches.forEach(match => {
        switch(match.type) {
            case '🔥':
                totalDamage += 45;
                logMessage += "🔥 Маг: Огненный Шар (45) ";
                break;
            case '💀':
                totalDamage += 30;
                logMessage += "💀 Воины: Натиск (30) ";
                break;
            case '🛡️':
                protectionActive = true;
                logMessage += "🛡️ Щиты подняты! ";
                break;
            case '🧪':
                totalHeal += 25;
                break;
            case '💎':
                totalDamage += 60;
                logMessage += "💎 Бездна: Чистый урон (60) ";
                break;
        }
    });

    // Наносим урон боссу
    if (totalDamage > 0) {
        combatData.dragonBoss.hp -= totalDamage;
    }

    // Лечим раненых союзников
    if (totalHeal > 0) {
        let wounded = combatData.heroes.filter(h => h.hp > 0 && h.hp < h.maxHp);
        if (wounded.length > 0) {
            let targetHero = wounded[Math.floor(Math.random() * wounded.length)];
            targetHero.hp = Math.min(targetHero.maxHp, targetHero.hp + totalHeal);
            logMessage += `🧪 Лечение: +${totalHeal} ОЗ для ${targetHero.name} `;
        } else {
            logMessage += "🧪 Алхимия: Отряд здоров ";
        }
    }

    // Выводим аккуратную сводку комбинации в строку состояния
    if (logMessage) {
        if (typeof updateStatusPanel === 'function') {
            updateStatusPanel(logMessage.trim());
        }
    }

    // Запускаем физику разрушения рун и падения верхних рядов
    if (typeof applyBoardGravity === 'function') {
        applyBoardGravity(matches);
    }
    
    if (typeof refreshBattleUI === 'function') {
        refreshBattleUI();
    }

    // Проверяем, не вызвали ли упавшие камни новые автоматические комбо (Каскады)
    let nextMatches = (typeof checkMatches === 'function') ? checkMatches() : [];

    if (nextMatches.length > 0 && combatData.dragonBoss.hp > 0) {
        setTimeout(() => {
            executeComboRules(nextMatches, false);
        }, 600);
    } else {
        // Каскады завершились. Списываем 1 Очко Действия за совершенный игроком ход
        combatData.ap--;
        
        if (typeof refreshBattleUI === 'function') {
            refreshBattleUI();
        }

        // Проверяем триггеры окончания раунда или победы
        if (combatData.dragonBoss.hp <= 0) {
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel("🏆 ПОБЕДА! Древний змей повержен!");
            }
            isProcessingGrid = true; // Блокируем поле
            return;
        }

        // Если Очки Действия закончились (0/3) — наступает фаза контратаки Дракона
        if (combatData.ap <= 0) {
            isProcessingGrid = true; // Блокируем ходы во время атаки босса
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel("🐉 Ход Дракона! Защищайтесь...", true);
            }
            
            setTimeout(() => {
                handleDragonTurn(protectionActive);
            }, 1200);
        } else {
            // Если ОД еще есть — возвращаем управление игроку для следующего хода
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
        // Каждый третий раунд Дракон бьет массовой магией по всему отряду
        if (combatData.turnCount % 3 === 0) {
            let dmg = protectionActive ? 10 : 25;
            aliveHeroes.forEach(h => { h.hp -= dmg; });
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel(`🐉 Дракон изрыгает [Дыхание Рока]! Все получили по ${dmg} урона.`);
            }
        } else {
            // В остальные ходы наносит точечный удар по случайному герою
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            let dmg = protectionActive ? 15 : 35;
            target.hp -= dmg;
            if (typeof updateStatusPanel === 'function') {
                updateStatusPanel(`🐉 Дракон бьет когтями! ${target.name} теряет ${dmg} ОЗ.`);
            }
        }
    }

    // Проверка глобального поражения (все пали)
    const survivors = combatData.heroes.filter(h => h.hp > 0);
    if (survivors.length === 0) {
        if (typeof updateStatusPanel === 'function') {
            updateStatusPanel("💀 ОТРАД УНИЧТОЖЕН. Защитники Абхирамбурга пали.", true);
        }
        return;
    }

    // Завершаем полный цикл раунда: обновляем ОД игрока и увеличиваем счетчик ходов босса
    setTimeout(() => {
        combatData.ap = combatData.maxAp; // Полное восстановление 3/3 ОД
        combatData.turnCount++;
        isProcessingGrid = false; // Открываем доступ к доске Match-3
        
        if (typeof updateStatusPanel === 'function') {
            updateStatusPanel(`⚔️ Раунд ${combatData.turnCount}. Ваш ход!`);
        }
        if (typeof refreshBattleUI === 'function') {
            refreshBattleUI();
        }
    }, 1500);
}
