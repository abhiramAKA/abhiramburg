/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ МОДУЛЬ ЛЕТОПИСИ И ИСТОРИИ ЦИТАДЕЛИ (v1.0.0-BETA)
   ========================================================================== */

function addChronicleLog(message) {
    let logs = [];
    try {
        logs = JSON.parse(localStorage.getItem('khamach_chronicle_logs') || '[]');
    } catch(e) { logs = []; }
    
    const timeStr = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    logs.unshift(`[${timeStr}] ${message}`);
    localStorage.setItem('khamach_chronicle_logs', JSON.stringify(logs.slice(0, 50)));
}

function renderChronicleDOM() {
    const container = document.getElementById('chronicle-list-container');
    if (!container) return;
    
    let logs = [];
    try {
        logs = JSON.parse(localStorage.getItem('khamach_chronicle_logs') || '[]');
    } catch(e) { logs = []; }
    
    if (logs.length === 0) {
        container.innerHTML = `<div style="color: #6a5335; text-align: center; padding: 20px;">Записей в летописях пока нет. Совершайте подвиги!</div>`;
        return;
    }
    
    container.innerHTML = logs.map(log => {
        let color = "#cdb38c";
        if (log.includes("АВТО")) color = "#2ecc71";
        if (log.includes("ОТПРАВЛЕН")) color = "#f1c40f";
        if (log.includes("ПОБЕДА")) color = "#e6c280";
        return `<div style="color: ${color}; border-bottom: 1px solid #231c15; padding-bottom: 3px;">${log}</div>`;
    }).join('');
}

const oldCheckBattleResolution = window.checkBattleResolution;
window.checkBattleResolution = function() {
    if (typeof combatData !== 'undefined' && combatData.dragonHP <= 0) {
        if (typeof activeSessionLevel !== 'undefined') {
            addChronicleLog(`ВЕЛИКАЯ ПОБЕДА: Успешно ликвидирован древний дракон Тира ${activeSessionLevel}! Получен 1 случайный материал.`);
        }
    }
    if (typeof oldCheckBattleResolution === 'function') oldCheckBattleResolution();
};
