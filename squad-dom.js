/* ==========================================================================
   КХАМАЧ — ГЕНЕРАТОР ИНТЕРФЕЙСА ВНУТРИ ЦИТАДЕЛИ (ОБНОВЛЕН - v4.9.4-BETA)
   ========================================================================== */

function injectSquadInterfaceDOM() {
    const screen = document.getElementById('squad-screen');
    if (!screen) return;

    screen.innerHTML = `
        <h1>Цитадель</h1>
        <span class="subtitle">Инфраструктура строений</span>
        
        <div style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
            <div class="menu-row"><button id="city-forge-btn" class="menu-btn">⚒️ Древняя кузня</button></div>
            <div class="menu-row"><button id="city-alchemy-btn" class="menu-btn">🧪 Лаборатория алхимии</button></div>
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">🛡️ Гарнизон</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🔥 Казармы</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель</button></div>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
