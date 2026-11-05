/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ГЕНЕРАТОР ИНТЕРФЕЙСОВ ГОРОДА (ИСПРАВЛЕН - v1.1.1-BETA)
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

        <!-- ================= ОКНО КУЗНИЦЫ / АЛХИМИИ ================= -->
        <div id="mode-desc-screen" class="game-window" style="display: none;">
            <h2 id="mode-desc-title">РЕЖИМ ИГРЫ</h2>
            <span class="subtitle">Управление зданиями</span>
            <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
            <div id="mode-desc-text">Описание режима загружается...</div>
            <button id="mode-buy-btn" class="menu-btn" style="margin-bottom: 10px; background: linear-gradient(to bottom, #1d421e 0%, #102411 100%); border-color: #316e34; color: #aae6ab;">🛒 ВЫКУПИТЬ ЗДЕНИЕ (500 🪙)</button>
            <button id="mode-process-btn" class="menu-btn" style="margin-bottom: 10px; background: linear-gradient(to bottom, #42351d 0%, #241d10 100%); border-color: #6e5931; color: #e6caa2; display: none;">⚒️ НАЧАТЬ ПЕРЕРАБОТКУ (50 🪙)</button>
            <button id="close-mode-desc-btn" class="menu-btn back-btn" style="margin-top: 5px; width: 100%;">Назад в меню</button>
        </div>

        <!-- ================= ЗЕРКАЛЬНОЕ МЕНЮ ОТРИСОВКИ ОТРЯДА ================= -->
        <div id="squad-screen" class="game-window" style="display: none;">
            <h1>ОТРЯД</h1>
            <span class="subtitle">Военная Цитадель Казарм</span>
            <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
            <p>Модернизируйте пассивные тренировочные полигоны вашей армии. Каждый уровень построек навсегда приумножает параметры выбранного героя.</p>
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">🛡️ Казармы Танка</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🔥 Плац Дамагера</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище Лучника</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель Мага</button></div>
            <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Назад в меню</button>
        </div>
    `;
}
