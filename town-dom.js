/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ГЕНЕРАТОР ИНТЕРФЕЙСОВ ГОРОДА (ИСПРАВЛЕН - v2.7.0-BETA)
   ========================================================================== */

function injectTownScreensDOM() {
    const container = document.getElementById('dynamic-town-screens');
    if (!container) return;

    container.innerHTML = `
        <!-- ================= ОКНО ВЫБОРА ДРАКОНА ================= -->
        <div id="dragon-select-screen" class="game-window" style="display: none;">
            <h2>ДОСКА ОБЪЯВЛЕНИЙ ОХОТЫ</h2>
            <span class="subtitle">24 Бестиария Горнила</span>
            <p>Выберите доступного дракона. Следующий уровень угрозы откроется только после полной ликвидации текущей цели.</p>
            <div id="dragon-levels-grid" style="max-height: 40vh; overflow-y: auto; padding: 4px; margin-bottom: 15px; border: 1px solid #4a3e31; background: rgba(0,0,0,0.4); border-radius: 4px;"></div>
            <button id="from-select-to-menu-btn" class="menu-btn back-btn" style="margin-top: 0; width: 100%;">Назад в меню</button>
        </div>

        <!-- ================= ЭКРАН СПРАВКИ МЕНЮ ================= -->
        <div id="info-screen" class="game-window" style="display: none;">
            <h2>КОНТЕКСТНАЯ СПРАВКА</h2>
            <span class="subtitle">Базовый Инструктаж</span>
            <p id="info-screen-text">Загрузка правил...</p>
            <button id="from-info-to-menu-btn" class="menu-btn back-btn">Назад в меню</button>
        </div>

        <!-- ================= ОКНО КУЗНИЦЫ / ЛАБОРАТОРИИ / КЛАНОВ ================= -->
        <div id="mode-desc-screen" class="game-window" style="display: none;">
            <h2 id="mode-desc-title">РЕЖИМ ИГРЫ</h2>
            <span class="subtitle">Управление зданиями</span>
            <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
            <div id="mode-desc-text">Описание режима загружается...</div>
            <button id="mode-buy-btn" class="menu-btn" style="margin-bottom: 10px; background: linear-gradient(to bottom, #1d421e 0%, #102411 100%); border-color: #316e34; color: #aae6ab;">🛒 ВЫКУПИТЬ ЗДЕНИЕ (100 🪙)</button>
            <button id="close-mode-desc-btn" class="menu-btn back-btn" style="margin-top: 5px; width: 100%;">Назад в меню</button>
        </div>
    `;
}
