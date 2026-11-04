// Боевое ядро рейда
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
        ]
    };

    document.getElementById('step-combat-btn').style.display = 'block';
    document.getElementById('restart-combat-btn').style.display = 'none';
    document.getElementById('battle-log-box').innerHTML = '<div class="log-row system">⚔️ Вы вступили на выжженную землю Логова. Дракон готов к бою! Нажмите на кнопку комбинаций.</div>';
    
    refreshBattleUI();
}

function refreshBattleUI() {
    document.getElementById('boss-name').innerText = combatData.dragonBoss.name;
    const hpPercent = Math.max(0, (combatData.dragonBoss.hp / combatData.dragonBoss.maxHp) * 100);
    document.getElementById('boss-hp-fill').style.width = hpPercent + '%';
    document.getElementById('boss-hp-text').innerText = `${Math.max(0, combatData.dragonBoss.hp)}/${combatData.dragonBoss.maxHp} HP`;

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
}

function appendToLog(message, type = 'player') {
    const logBox = document.getElementById('battle-log-box');
    const row = document.createElement('div');
    row.className = `log-row ${type}`;
    row.innerHTML = `<b>Раунд ${combatData.currentRound}:</b> ${message}`;
    logBox.appendChild(row);
    logBox.scrollTop = logBox.scrollHeight;
}

function processCombatTurn() {
    const aliveHeroes = combatData.heroes.filter(h => h.hp > 0);
    if (combatData.dragonBoss.hp <= 0 || aliveHeroes.length === 0) return;

    const matchOptions = ["FIRE", "SKULLS", "SHIELDS", "CRIT_COMBO"];
    const selectedMatch = matchOptions[Math.floor(Math.random() * matchOptions.length)];

    switch(selectedMatch) {
        case "FIRE":
            combatData.dragonBoss.hp -= 45;
            appendToLog("🔥 Собрана триада Огня! Чародей выпускает сгусток пламени. Нанесено 45 маг. урона.", "player");
            break;
        case "SKULLS":
            combatData.dragonBoss.hp -= 30;
            appendToLog("💀 Собрана комбинация Черепов! Авангард проводит натиск клинками. Нанесено 30 физ. урона.", "player");
            break;
        case "SHIELDS":
            appendToLog("🛡️ Собраны Щиты! Отряд выстраивает оборонительную стену, готовясь к ярости ящера.", "player");
            break;
        case "CRIT_COMBO":
            combatData.dragonBoss.hp -= 95;
            appendToLog("⚡ ВЕЛИКОЕ КОМБО (5 в ряд)! Слияние всех рун обрушивает сокрушительный удар на 95 урона!", "player");
            break;
    }

    if (combatData.dragonBoss.hp <= 0) {
        refreshBattleUI();
        appendToLog("🏆 ПОБЕДА! Древний змей рухнул оземь. Получено: 3 ресурса стихии Огонь (Тир 1).", "system");
        finishBattleSession();
        return;
    }

    if (aliveHeroes.length > 0) {
        if (combatData.currentRound % 3 === 0) {
            aliveHeroes.forEach(h => { h.hp -= 25; });
            appendToLog("🐉 Дракон копит ярость и изрыгает [Дыхание Рока]! Все живые члены отряда получают по 25 урона огнем.", "dragon");
        } else {
            const randomTarget = aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)];
            const finalDamage = (selectedMatch === "SHIELDS") ? 15 : 35;
            randomTarget.hp -= finalDamage;
            const shieldNote = (selectedMatch === "SHIELDS") ? " (Урон снижен щитами!)" : "";
            appendToLog(`🐉 Дракон наносит сокрушительный удар когтями по цели ${randomTarget.name} [${randomTarget.slot}]. Нанесено ${finalDamage} урона.${shieldNote}`, "dragon");
        }
    }

    if (combatData.heroes.filter(h => h.hp > 0).length === 0) {
        refreshBattleUI();
        appendToLog("💀 ОТРАД ПОЛНОСТЬЮ УНИЧТОЖЕН. Защитники Абхирамбурга пали и эвакуированы в Полевой Госпиталь.", "system");
        finishBattleSession();
        return;
    }

    combatData.currentRound++;
    refreshBattleUI();
}

function finishBattleSession() {
    document.getElementById('step-combat-btn').style.display = 'none';
    document.getElementById('restart-combat-btn').style.display = 'block';
}
