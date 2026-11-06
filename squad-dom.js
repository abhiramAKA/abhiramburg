/* ==========================================================================
   КХАМАЧ — ГЕНЕРАТОР ИНТЕРФЕЙСА ВНУТРИ ЦИТАДЕЛИ (ОБНОВЛЕН - v4.0.0-BETA)
   ========================================================================== */

const SQUAD_HERO_LORE = {
    tank: {
        name: "⛺ Лагерь защитников",
        title: "🛡️ РЫЦАРЬ СМЕРТИ (ЗАЩИТНИК)",
        resourceKey: "plasma",
        resourceIcon: "🌋",
        resourceName: "Плазма дракона",
        statBonus: "+20 Max HP за уровень",
        lore: "Латные рукавицы намертво сжимают ростовой щит из костей. Он — несокрушимая скала Абхирамбурга, принимающая на себя всю ярость извергаемого драконьего пламени."
    },
    damage: {
        name: "🛡️ Казармы воинов",
        title: "🔥 БЕРСЕРК ГОРНИЛА (ВОИН)",
        resourceKey: "blood",
        resourceIcon: "🩸",
        resourceName: "Кровь дракона",
        statBonus: "+15 к урону ультимейта за уровень",
        lore: "Одержимый первобытным гневом рун Кхамача, этот безумный боец не признает защиты. Его парные топоры жаждут лишь одного — вскрыть хребет древнего змея."
    },
    archer: {
        name: "⚡ Стрельбище стрелков",
        title: "⚡ СЛЕДОПЫТ ГРОЗЫ (СТРЕЛОК)",
        resourceKey: "scale",
        resourceIcon: "🪶",
        resourceName: "Чешую дракона",
        statBonus: "+10 к урону молнии за уровень",
        lore: "Его стрелы оперены чешуей драконов света, а тетива поет песнь молний. Метким выстрелом Следопыт способен ослепить чудовище."
    },
    damage_mage: { // ключ изменен во избежание конфликта со старыми сохранениями
        name: "💚 Обитель магов",
        title: "💚 ОТРИЦАТЕЛЬ СМЕРТИ (МАГ)",
        resourceKey: "tears",
        resourceIcon: "💧",
        resourceName: "Слезы дракона",
        statBonus: "+5 к групповому хилу за уровень",
        lore: "Тайные эссенции жизни текут по его венам. Хранитель Обители балансирует на грани миров, собирая изумрудные руны, чтобы залечить раны отряда."
    }
};

function injectSquadInterfaceDOM() {
    const screen = document.getElementById('squad-screen');
    if (!screen) return;

    screen.innerHTML = `
        <h1>Цитадель</h1>
        <span class="subtitle">Инфраструктура строений</span>
        
        <!-- Интерактивный дашборд ресурсов в шапке Цитадели, зеркальный Главному Меню -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 15px; font-size: 16px; font-weight: bold; background: rgba(30, 20, 15, 0.4); padding: 6px 14px; border: 1px double #544432; border-radius: 4px; border-left: none; border-right: none;">
            <span id="squad-gold-display" class="gold-counter-display" style="color: #ffd700; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ffd700'">🪙 0 Золота</span>
            <span style="color: #4a3e31; font-weight: normal;">|</span>
            <span id="squad-fatigue-display" style="color: #ffb3ba; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ffb3ba'">🥱 0%</span>
        </div>
        
        <!-- Единый строгий готический вертикальный ряд кнопок без лишнего текста -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%; max-height: 48vh; overflow-y: auto; padding-right: 4px;">
            <div class="menu-row"><button id="city-forge-btn" class="menu-btn">⚒️ Древняя кузня</button></div>
            <div class="menu-row"><button id="city-alchemy-btn" class="menu-btn">🧪 Лаборатория алхимии</button></div>
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">⛺ Лагерь защитников</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🛡️ Казармы воинов</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище стрелков</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель магов</button></div>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
