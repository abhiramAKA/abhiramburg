// Глобальный объект данных состояния игры (Интеграция v0.5.5 под сетку 8х8 и систему ОД)
const combatData = {
    board: [],
    heroes: [
        { id: 1, name: "Рыцарь смерти", role: "Воитель", hp: 150, maxHp: 150, slot: "Фронт-Лево" },
        { id: 2, name: "Гвардеец", role: "Танк", hp: 120, maxHp: 120, slot: "Фронт-Право" },
        { id: 3, name: "Чародей", role: "Маг", hp: 80, maxHp: 80, slot: "Тыл-Лево" },
        { id: 4, name: "Рекрут лагеря", role: "Рекрут", hp: 70, maxHp: 70, slot: "Тыл-Право" }
    ],
    dragonBoss: { name: "Огненный Дракон (Тир 1)", hp: 500, maxHp: 500 },
    ap: 3,
    maxAp: 3,
    turnCount: 1
};

// Исправленная функция переключения абсолютно всех экранов
function showScreen(screenId) {
    // Прячем абсолютно все окна с классом game-window
    document.querySelectorAll('.game-window').forEach(window => {
        window.style.display = 'none';
    });
    
    // Показываем целевое окно
    const target = document.getElementById(screenId);
    if (target) {
        // Окна используют flex для готического позиционирования
        target.style.display = 'flex';
        
        // Особая инициализация только при входе непосредственно в бой
        if (screenId === 'battle-screen') {
            combatData.ap = combatData.maxAp; 
            combatData.turnCount = 1;
            combatData.dragonBoss.hp = combatData.dragonBoss.maxHp; 
            combatData.heroes.forEach(h => h.hp = h.maxHp); 
            
            setTimeout(() => {
                if (typeof rebuildActionArea === 'function') rebuildActionArea();
                if (typeof generateValidBoard === 'function') generateValidBoard();
                if (typeof renderMatch3Board === 'function') renderMatch3Board();
                if (typeof renderSquad === 'function') renderSquad();
                updateStatusPanel("⚔️ Раунд 1. Ваш ход!");
            }, 30);
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

function appendToLog(text) {
    updateStatusPanel(text);
}

// Главный метод синхронизации графического интерфейса сражения
function refreshBattleUI() {
    if (typeof renderMatch3Board === 'function') renderMatch3Board();
    if (typeof renderSquad === 'function') renderSquad();
    
    const bossHpBar = document.getElementById('boss-hp-bar');
    const bossHpText = document.getElementById('boss-hp-text');
    if (bossHpBar && bossHpText) {
        const pct = Math.max(0, (combatData.dragonBoss.hp / combatData.dragonBoss.maxHp) * 100);
        bossHpBar.style.width = pct + '%';
        bossHpText.innerText = `${Math.max(0, combatData.dragonBoss.hp)} / ${combatData.dragonBoss.maxHp} ОЗ`;
    }
    
    const currentStatus = document.getElementById('battle-status-text')?.innerText || "Битва продолжается";
    updateStatusPanel(currentStatus, combatData.ap === 0);
}

// Старт игры после загрузки DOM структуры
document.addEventListener('DOMContentLoaded', () => {
    showScreen('main-menu');
});
