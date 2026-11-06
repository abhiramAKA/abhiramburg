/* ==========================================================================
   КХАМАЧ — ГЛОБАЛЬНАЯ ГРАФИЧЕСКАЯ ФАБРИКА ГОРОДСКИХ ИНТЕРФЕЙСОВ (v4.5.0-BETA)
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

        <!-- ================= ОКНО ОПИСАНИЙ ЗДАНnetwork С КРЕСТИКОМ В ШАПКЕ ================= -->
        <div id="mode-desc-screen" class="game-window" style="display: none; padding: 25px 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; width: 100%;">
                <h2 id="mode-desc-title" style="margin: 0; font-size: 20px;">РЕЖИМ ИГРЫ</h2>
                <button id="close-mode-desc-top-btn" class="info-btn back-btn" style="width: 26px; height: 26px; font-size: 11px; box-shadow: none; border-radius: 4px; margin: 0; padding: 0;">❌</button>
            </div>
            <span class="subtitle" style="margin-bottom: 15px; padding-bottom: 6px;">Управление строениями</span>
            <div id="mode-desc-text">Описание режима загружается...</div>
            <button id="mode-buy-btn" class="menu-btn" style="margin-top: 15px; background: linear-gradient(to bottom, #1d421e 0%, #102411 100%); border-color: #316e34; color: #aae6ab;">⚒️ ПОСТРОИТЬ ЗДЕНИЕ (100 🪙)</button>
        </div>

        <!-- ================= ОКНО НАСТРОЕК ЗВУКА ================= -->
        <div id="settings-screen" class="game-window" style="display: none; padding: 20px;">
            <h2>ЗВУКОВОЙ ПУЛЬТ</h2>
            <span class="subtitle">Микшер Абхирамбурга</span>
            <div style="text-align: left; font-size: 13px; color: #cdb38c; margin-bottom: 15px;">
                <div style="margin-bottom: 10px;">
                    <label>🎵 Громкость Музыки:</label>
                    <input type="range" id="volume-music-slider" min="0" max="100" value="50" style="width: 100%; accent-color: #ffd700;">
                </div>
                <div style="margin-bottom: 10px;">
                    <label>🎇 Громкость Эффектов:</label>
                    <input type="range" id="volume-fx-slider" min="0" max="100" value="70" style="width: 100%; accent-color: #ffd700;">
                </div>
            </div>
            <button id="close-settings-btn" class="menu-btn back-btn" style="width: 100%;">Сохранить настройки</button>
        </div>

        <!-- ================= ОКНО СКЛАДА ================= -->
        <div id="storage-screen" class="game-window" style="display: none;">
            <h2>СКЛАД ЦИТАДЕЛИ</h2>
            <span class="subtitle">Учет Ресурсов и Трофеев</span>
            <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
            <div id="storage-resources-list" style="background: rgba(0, 0, 0, 0.4); border: 1px double #544432; padding: 15px; margin-bottom: 15px; border-radius: 4px; text-align: left;"></div>
            <button id="close-storage-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
        </div>

        <!-- ================= ОКНО ПОРУЧЕНИЙ ================= -->
        <div id="missions-screen" class="game-window" style="display: none;">
            <h2>ГОРОДСКОЕ ПОРУЧЕНИЕ</h2>
            <span class="subtitle">Доска Объявлений Абхирамбурга</span>
            <p style="font-size: 12px; margin-bottom: 10px;">Отправляйте бойцов помогать горожанам. Занятые бойцы автоматически вернутся по истечении таймера!</p>
            <div id="missions-list-container" style="max-height: 45vh; overflow-y: auto; padding: 4px; margin-bottom: 15px; border: 1px solid #4a3e31; background: rgba(0,0,0,0.4); border-radius: 4px; display: flex; flex-direction: column; gap: 8px;"></div>
            <button id="close-missions-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 0;">Назад в меню</button>
        </div>

        <!-- ================= ОКНО ЛЕТОПИСИ ================= -->
        <div id="chronicle-screen" class="game-window" style="display: none;">
            <h2>ЛЕТОПИСЬ ЦИТАДЕЛИ</h2>
            <span class="subtitle">Архив Истории Абхирамбурга</span>
            <div id="chronicle-list-container" style="max-height: 50vh; overflow-y: auto; padding: 10px; margin-bottom: 15px; border: 1px dashed #8a7350; background: rgba(10,8,6,0.6); border-radius: 4px; text-align: left; font-size: 12px; display: flex; flex-direction: column; gap: 6px;"></div>
            <button id="clear-chronicle-btn" class="menu-btn" style="background: linear-gradient(to bottom, #421e1e, #241010); border-color: #6e3131; font-size: 12px; padding: 8px; margin-bottom: 8px;">Очистить архив</button>
            <button id="close-chronicle-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 0;">Назад в меню</button>
        </div>

        <!-- ================= ОКНО ИНДИВИДУАЛЬНОЙ УСТАЛОСТИ ================= -->
        <div id="squad-fatigue-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 400px; padding: 20px 25px;">
                <h2>СОСТОЯНИЕ ОТРЯДА</h2>
                <span class="subtitle">Стихийное Истощение сил</span>
                <div id="individual-fatigue-list-container" style="display: flex; flex-direction: column; gap: 10px; text-align: left; background: rgba(0,0,0,0.5); padding: 15px; border: 1px solid #544432; border-radius: 4px; font-size: 14px;"></div>
                <p style="font-size: 11px; margin-top: 12px; color: #8a7350; line-height: 1.4; text-align: center;">Бойцы пассивно сбрасывают усталость во время отдыха, когда не выполняют поручения города.</p>
                <button id="close-fatigue-screen-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Вернуться в меню</button>
            </div>
        </div>

        <!-- ================= ОКНО ИНСТРУКТАЖА ПЕРВОГО БОЯ ================= -->
        <div id="welcome-palace-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 420px; padding: 25px;">
                <h2>ПРИВЕТСТВИЕ</h2>
                <span class="subtitle">Хроники Абхирамбурга</span>
                <p style="font-size: 14px; color: #e6c280; text-align: left; line-height: 1.6; margin-bottom: 15px;">
                    Добро пожаловать в мрачные чертоги тактической ролевой стратегии <strong>«КХАМАЧ»</strong>! 
                </p>
                <div style="font-size: 12px; color: #cdb38c; text-align: left; line-height: 1.5; display: flex; flex-direction: column; gap: 8px; background: rgba(0,0,0,0.4); padding: 12px; border: 1px dashed #8a7350; border-radius: 4px;">
                    <div>• ⚔️ <strong>Боевые Рейды:</strong> Собирайте руны стихий три в ряд, чтобы заряжать суперсилы героев и сокрушать великих драконов.</div>
                    <div>• ⛺ <strong>Развитие Цитадели:</strong> Повышайте уровни лагерей за золото и добытые в бою стихийные трофеи ящеров.</div>
                    <div>• 📜 <strong>Поручения:</strong> Отправляйте свободных бойцов на городские задания ради добычи монет, но следите за их общей 🥱 усталостью!</div>
                </div>
                <button id="close-welcome-palace-btn" class="menu-btn" style="margin-top: 20px; width: 100%; background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34;">Принять командование</button>
            </div>
        </div>
    `;
}
