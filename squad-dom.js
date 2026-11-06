/* ==========================================================================
   КХАМАЧ — ГЕНЕРАТОР ИНТЕРФЕЙСА ВНУТРИ ЦИТАДЕЛИ (ОБНОВЛЕН - v4.1.0-BETA)
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
        <h1 style="font-size: 28px; margin-bottom: 2px;">Цитадель</h1>
        <span class="subtitle" style="margin-bottom: 10px; padding-bottom: 8px;">Инфраструктура строений</span>
        
        <!-- Интерактивный дашборд ресурсов в шапке Цитадели -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; font-size: 15px; font-weight: bold; background: rgba(30, 20, 15, 0.4); padding: 4px 12px; border: 1px double #544432; border-radius: 4px; border-left: none; border-right: none;">
            <span id="squad-gold-display" class="gold-counter-display" style="color: #ffd700; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ffd700'">🪙 0 Золота</span>
            <span style="color: #4a3e31; font-weight: normal;">|</span>
            <span id="squad-fatigue-display" style="color: #ffb3ba; cursor: pointer; transition: color 0.2s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='#ffb3ba'">🥱 0%</span>
        </div>
        
        <!-- Высококомпактный вертикальный стек кнопок без лишних flex-рядов и отступов -->
        <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; box-sizing: border-box;">
            <button id="city-forge-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">⚒️ Древняя кузня</button>
            <button id="city-alchemy-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">🧪 Лаборатория алхимии</button>
            <button id="upgrade-tank-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">⛺ Лагерь защитников</button>
            <button id="upgrade-damage-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">🛡️ Казармы воинов</button>
            <button id="upgrade-archer-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">⚡ Стрельбище стрелков</button>
            <button id="upgrade-mage-btn" class="menu-btn" style="padding: 10px; font-size: 13px;">💚 Обитель магов</button>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 10px; padding: 10px; font-size: 13px; width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
