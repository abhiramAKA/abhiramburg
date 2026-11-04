// Глобальный объект данных состояния игры (Версия v0.5.2 под сетку 8х8 и систему ОД)
const combatData = {
    board: [],
    heroes: [
        { id: 1, name: "Воитель", hp: 150, maxHp: 150, role: "фронт-лево" },
        { id: 2, name: "Танк", hp: 120, maxHp: 120, role: "фронт-право" },
        { id: 3, name: "Маг", hp: 80, maxHp: 80, role: "тыл-лево" },
        { id: 4, name: "Рекрут", hp: 70, maxHp: 70, role: "тыл-право" }
    ],
    dragonBoss: { name: "Огненный Дракон", hp: 500, maxHp: 500 },
    ap: 3,
    maxAp: 3,
    turnCount: 1
};

// Функция бесшовного переключения экранов
function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(screenId);
    if (target) {
        target.style.display = 'flex';
        
        if (screenId === 'screen-battle') {
            combatData.ap = combatData.maxAp; // Сброс очков действий при старте рейда
            combatData.turnCount = 1;
            combatData.dragonBoss.hp = combatData.dragonBoss.maxHp; // Восстанавливаем босса
            combatData.heroes.forEach(h => h.hp = h.maxHp); // Восстанавливаем отряд
            
            setTimeout(() => {
                if (typeof rebuildActionArea === 'function') rebuildActionArea();
                if (typeof generateValidBoard === 'function') generateValidBoard();
                if (typeof renderMatch3Board === 'function') renderMatch3Board();
                if (typeof renderSquad === 'function') renderSquad();
                updateStatusPanel("⚔️ Раунд 1. Ваш ход!");
            }, 20);
        }
    }
}

// Управление компактной строкой состояния и отображением ОД
function updateStatusPanel(text, isBossTurn = false) {
    const statusText = document.getElementById('battle-status-text');
    const apDisplay = document.getElementById('battle-ap-display');
    
    if (statusText) statusText.innerText = text;
    if (apDisplay) {
        apDisplay.innerText = `⚡ ОД: ${combatData.ap} / ${combatData.maxAp}`;
        apDisplay.style.color = isBossTurn ? "#ff4d4d" : "#5dade2";
    }
}

// Перехватчик старых логов для обратной совместимости с модулями
function appendToLog(text) {
    updateStatusPanel(text);
}

// Главный метод синхронизации графического интерфейса сражения
function refreshBattleUI() {
    if (typeof renderMatch3Board === 'function') renderMatch3Board();
    if (typeof renderSquad === 'function') renderSquad();
    
    // Обновление здоровья босса
    const bossHpBar = document.getElementById('boss-hp-bar');
    const bossHpText = document.getElementById('boss-hp-text');
    if (bossHpBar && bossHpText) {
        const pct = Math.max(0, (combatData.dragonBoss.hp / combatData.dragonBoss.maxHp) * 100);
        bossHpBar.style.width = pct + '%';
        bossHpText.innerText = `${Math.max(0, combatData.dragonBoss.hp)} / ${combatData.dragonBoss.maxHp} ОЗ`;
    }
    
    // Актуализация счетчика действий
    const currentStatus = document.getElementById('battle-status-text')?.innerText || "Битва продолжается";
    updateStatusPanel(currentStatus, combatData.ap === 0);
}

// Старт игры после полной инициализации DOM дерева
document.addEventListener('DOMContentLoaded', () => {
     showScreen('screen-camp');
});
