// Боевое ядро рейда и состояния характеристик
let combatData = {};

function setupBattleSession() {
    if (!combatData.currentRound) {
        reviveAndRestart();
    } else {
        refreshBattleUI();
    }
}

function reviveAndRestart() {
    combatData = {
        currentRound: 1,
        dragonBoss: { name: "Огненный Дракон (Тир 1)", hp: 500, maxHp: 500, element: "Огонь" },
        heroes: [
            { id: 1, name: "Рыцарь смерти", role: "Воитель", hp: 150, maxHp: 150, slot: "Фронт-Лево", isRecruit: false },
            { id: 2, name: "Гвардеец", role: "Танк", hp: 120, maxHp: 120, slot: "Фронт-Право", isRecruit: false },
            { id: 3, name: "Чародей", role: "Маг", hp: 80, maxHp: 80, slot: "Тыл-Лево", isRecruit: false },
            { id: 4, name: "Рекрут лагеря", role: "Рекрут", hp: 70, maxHp: 70, slot: "Тыл-Право", isRecruit: true }
        ],
        board: []
    };

    if(document.getElementById('restart-combat-btn')) document.getElementById('restart-combat-btn').style.display = 'none';
    document.getElementById('battle-log-box').innerHTML = '<div class="log-row system">⚔️ Вы вступили в Логово. Передвигайте соседние фишки на поле 5х5, чтобы наносить урон!</div>';
    
    generateValidBoard(); // Вызов из модуля match3.js
    rebuildActionArea();  // Вызов из модуля match3.js
    refreshBattleUI();
}

function refreshBattleUI() {
    // Рендер здоровья босса
    document.getElementById('boss-name').innerText = combatData.dragonBoss.name;
    const hpPercent = Math.max(0, (combatData.dragonBoss.hp / combatData.dragonBoss.maxHp) * 100);
    document.getElementById('boss-hp-fill').style.width = hpPercent + '%';
    document.getElementById('boss-hp-text').innerText = `${Math.max(0, combatData.dragonBoss.hp)}/${combatData.dragonBoss.maxHp} HP`;

    // Рендер карточек отряда
    const gridContainer = document.getElementById('squad-battle-grid');
    gridContainer.innerHTML = '';
    combatData.heroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = `squad-card ${hero.isRecruit ? 'recruit' : ''} ${hero.hp <= 0 ? 'dead' : ''}`;
        card.innerHTML = `
            <div style="font-weight: bold;">${hero.name}</div>
            <div style="font-size: 10px; color: #7a6b58;">[${hero.slot}] — ${hero.role}</div>
            <div class="card-hp">❤️ ${Math.max(0, hero.hp)}/${hero.maxHp}</div>
        `;
        gridContainer.appendChild(card);
    });

    // Рендер самого игрового поля
    renderMatch3Board(); // Вызов из модуля match3.js
}

function appendToLog(message, type = 'player') {
    const logBox = document.getElementById('battle-log-box');
    const row = document.createElement('div');
    row.className = `log-row ${type}`;
    row.innerHTML = `<b>Раунд ${combatData.currentRound}:</b> ${message}`;
    logBox.appendChild(row);
    logBox.scrollTop = logBox.scrollHeight;
}

// Применение боевых эффектов собранных комбинаций
function executeComboRules(matches) {
    let protectionActive = false;

    matches.forEach(match => {
        switch(match.type) {
            case '🔥':
                combatData.dragonBoss.hp -= 45;
                appendToLog("🔥 Руны Огня! Чародей выпускает Огненный Шар на 45 маг. урона.", "player");
                break;
            case '💀':
                combatData.dragonBoss.hp -= 30;
                appendToLog("💀 Руны Смерти! Воители наносят дракону 30 физ. урона.", "player");
                break;
            case '🛡️':
                protectionActive = true;
                appendToLog("🛡️ Руны Защиты! Отряд поднял щиты, снижая будущий урон.", "player");
                break;
            case '🧪':
                let wounded = combatData.heroes.filter(h => h.hp > 0 && h.hp < h.maxHp);
                if(wounded.length > 0) {
                    let targetHero = wounded[Math.floor(Math.random() * wounded.length)];
                    targetHero.hp = Math.min(targetHero.maxHp, targetHero.hp + 25);
                    appendToLog(`🧪 Алхимия! Целебный состав восстановил 25 ОЗ герою ${targetHero.name}.`, "player");
                } else {
                    appendToLog("🧪 Алхимия! Отряд полностью здоров, лечить некого.", "player");
                }
                break;
            case '💎':
                combatData.dragonBoss.hp -= 60;
                appendToLog("💎 Кристаллы Бездны взрывают чешую дракона на 60 чистого урона.", "player");
                break;
        }

        // Обновляем клетки новыми рунами
        match.coords.forEach(coord => {
            const [r, c] = coord;
            combatData.board[r][c] = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
        });
    });

    if (combatData.dragonBoss.hp <= 0) {
        refreshBattleUI();
        appendToLog("🏆 ПОБЕДА! Древний змей повержен! Выпал дроп: 3 ресурса стихии Огонь (Тир 1).", "system");
        finishBattleSession();
        return;
    }

    // Ответный ход Дракона
    const aliveHeroes = combatData.heroes.filter(h => h.hp > 0);
    if (aliveHeroes.length > 0) {
        if (combatData.currentRound % 3 === 0) {
            let dmg = protectionActive ? 10 : 25;
            aliveHeroes.forEach(h => { h.hp -= dmg; });
            appendToLog(`🐉 Дракон изрыгает [Дыхание Рока]! Весь отряд получает по ${dmg} урона огнем.`, "dragon");
        } else {
            const target = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            let dmg = protectionActive ? 15 : 35;
            target.hp -= dmg;
            appendToLog(`🐉 Дракон бьет когтями по позиции ${target.slot}! ${target.name} получает ${dmg} урона.`, "dragon");
        }
    }

    if (combatData.heroes.filter(h => h.hp > 0).length === 0) {
        refreshBattleUI();
        appendToLog("💀 ОТРАД УНИЧТОЖЕН. Защитники Абхирамбурга пали.", "system");
        finishBattleSession();
        return;
    }

    combatData.currentRound++;
    refreshBattleUI();
}

function finishBattleSession() {
    const restartBtn = document.getElementById('restart-combat-btn');
    if (restartBtn) restartBtn.style.display = 'block';
}
