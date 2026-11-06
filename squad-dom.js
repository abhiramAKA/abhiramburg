/* ==========================================================================
   КХАМАЧ — ГЕНЕРАТОР ИНТЕРФЕЙСА ВНУТРИ ЦИТАДЕЛИ (ОБНОВЛЕН - v4.2.0-BETA)
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
    damage_mage: {
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
        
        <!-- Полноразмерный вертикальный ряд кнопок, идентичный Главному меню -->
        <div style="display: flex; flex-direction: column; width: 100%; box-sizing: border-box;">
            <div class="menu-row"><button id="city-forge-btn" class="menu-btn">⚒️ Древняя кузня</button></div>
            <div class="menu-row"><button id="city-alchemy-btn" class="menu-btn">🧪 Лаборатория алхимии</button></div>
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">⛺ Лагерь защитников</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🛡️ Казармы воинов</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище стрелков</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель магов</button></div>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
