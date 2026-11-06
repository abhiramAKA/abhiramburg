/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ГЕНЕРАТОР ИНТЕРФЕЙСА ГОРОДА (ОБНОВЛЕН - v3.4.1-BETA)
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
    mage: {
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
        <h1>ГОРОД</h1>
        <span class="subtitle">Военная Цитадель Казарм</span>
        <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">👑 0 Золота</div>
        
        <div id="squad-inventory-lookup" style="background: rgba(0, 0, 0, 0.4); border: 1px dashed #544432; padding: 6px; margin-bottom: 12px; font-size: 11px; border-radius: 4px;"></div>
        
        <p>Возводите пассивные тренировочные полигоны и развивайте навыки ваших бойцов за добытые в рейдах ресурсы.</p>
        
        <div id="squad-buildings-container" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">⛺ Лагерь защитников</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🛡️ Казармы воинов</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище стрелков</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель магов</button></div>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
