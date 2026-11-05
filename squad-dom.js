/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ГЕНЕРАТОР ИНТЕРФЕЙСА ОТРЯДА (ОБНОВЛЕН - v3.1.0-BETA)
   ========================================================================== */

const SQUAD_HERO_LORE = {
    tank: {
        name: "⛺ Тренировочный лагерь",
        title: "🛡️ РЫЦАРЬ СМЕРТИ (ТАНК)",
        resourceKey: "plasma",
        resourceIcon: "🌋",
        resourceName: "Плазма дракона",
        statBonus: "+20 Max HP за уровень",
        lore: "Латные рукавицы намертво сжимают ростовой щит из костей. Он — несокрушимая скала Абхирамбурга, принимающая на себя всю ярость извергаемого драконьего пламени. Его ультимейт провоцирует монстра, защищая союзников."
    },
    damage: {
        name: "🛡️ Казармы",
        title: "🔥 БЕРСЕРК ГОРНИЛА (ДАМАГЕР)",
        resourceKey: "blood",
        resourceIcon: "🩸",
        resourceName: "Кровь дракона",
        statBonus: "+15 к урону ультимейта за уровень",
        lore: "Одержимый первобытным гневом рун Кхамача, этот безумный воин не признает защиты. Его парные топоры жаждут лишь одного — вскрыть хребет древнего змея. Каждая собранная огненная триада приближает момент сокрушительного чистого удара."
    },
    archer: {
        name: "⚡ Стрельбище",
        title: "⚡ СЛЕДОПЫТ ГРОЗЫ (ЛУЧНИК)",
        resourceKey: "scale",
        resourceIcon: "🪶",
        resourceName: "Чешую дракона",
        statBonus: "+10 к урону молнии за уровень",
        lore: "Его стрелы оперены чешуей драконов света, а тетива поет песнь молний. Метким выстрелом в глазное черево Следопыт способен ослепить чудовище, дезориентируя его и снижая весь входящий урон по нашему отряду ровно в два раза."
    },
    mage: {
        name: "💚 Обитель",
        title: "💚 ОТРИЦАТЕЛЬ СМЕРТИ (МАГ)",
        resourceKey: "tears",
        resourceIcon: "💧",
        resourceName: "Слезы дракона",
        statBonus: "+5 к групповому хилу за уровень",
        lore: "Тайные эссенции жизни текут по его венам. Хранитель Обители балансирует на грани миров, собирая изумрудные руны, чтобы одним заклинанием залечить рваные раны отряда и вдохнуть новые силы в павших собратьев."
    }
};

function injectSquadInterfaceDOM() {
    const screen = document.getElementById('squad-screen');
    if (!screen) return;

    screen.innerHTML = `
        <h1>ОТРЯД</h1>
        <span class="subtitle">Военная Цитадель Казарм</span>
        <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
        
        <!-- Динамический блок инвентаря для отслеживания ресурсов при прокачке -->
        <div id="squad-inventory-lookup" style="background: rgba(0, 0, 0, 0.4); border: 1px dashed #544432; padding: 6px; margin-bottom: 12px; font-size: 11px; border-radius: 4px;"></div>
        
        <p>Возводите пассивные тренировочные полигоны и развивайте навыки ваших героев за добытые в рейдах ресурсы.</p>
        
        <div id="squad-buildings-container" style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
            <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">⛺ Тренировочный лагерь</button></div>
            <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🛡️ Казармы</button></div>
            <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище</button></div>
            <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель</button></div>
        </div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Назад в меню</button>
    `;
    if (typeof setupSquadInterfaceListeners === 'function') setupSquadInterfaceListeners();
}
