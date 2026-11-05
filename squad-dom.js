/* ==========================================================================
   КХАМАЧ — АВТОНОМНЫЙ ГЕНЕРАТОР ИНТЕРФЕЙСА ОТРЯДА (НОВЫЙ МОДУЛЬ - v2.7.0-BETA)
   ========================================================================== */

const SQUAD_HERO_LORE = {
    tank: {
        name: "⛺ Тренировочный лагерь",
        title: "🛡️ РЫЦАРЬ СМЕРТИ (ТАНК)",
        lore: "Латные рукавицы намертво сжимают ростовой щит из костей. Он — несокрушимая скала Абхирамбурга, принимающая на себя всю ярость извергаемого драконьего пламени. Его ультимейт провоцирует монстра, защищая союзников.\n\n[Эффект постройки]: Навсегда добавляет Танку +20 Max HP в бою!"
    },
    damage: {
        name: "🛡️ Казармы",
        title: "🔥 БЕРСЕРК ГОРНИЛА (ДАМАГЕР)",
        lore: "Одержимый первобытным гневом рун Кхамача, этот безумный воин не признает защиты. Его парные топоры жаждут лишь одного — вскрыть хребет древнего змея. Каждая собранная огненная триада приближает момент сокрушительного чистого удара.\n\n[Эффект постройки]: Навсегда увеличивает урон ультимейта Дамагера на +15 ед.!"
    },
    archer: {
        name: "⚡ Стрельбище",
        title: "⚡ СЛЕДОПЫТ ГРОЗЫ (ЛУЧНИК)",
        lore: "Его стрелы оперены чешуей драконов света, а тетива поет песнь молний. Метким выстрелом в глазное черево Следопыт способен ослепить чудовище, дезориентируя его и снижая весь входящий урон по нашему отряду ровно в два раза.\n\n[Эффект постройки]: Навсегда увеличивает точечный урон Лучника на +10 ед.!"
    },
    mage: {
        name: "💚 Обитель",
        title: "💚 ОТРИЦАТЕЛЬ СМЕРТИ (МАГ)",
        lore: "Тайные эссенции жизни текут по его венам. Хранитель Обители балансирует на грани миров, собирая изумрудные руны, чтобы одним заклинанием залечить рваные раны отряда и вдохнуть новые силы в павших собратьев.\n\n[Эффект постройки]: Навсегда повышает силу массового исцеления Мага на +5 ед.!"
    }
};

function injectSquadInterfaceDOM() {
    const screen = document.getElementById('squad-screen');
    if (!screen) return;

    screen.innerHTML = `
        <h1>ОТРЯД</h1>
        <span class="subtitle">Военная Цитадель Казарм</span>
        <div class="gold-counter-display" style="color: #ffd700; font-weight: bold; margin-bottom: 10px; font-size: 16px;">🪙 0 Золота</div>
        <p>Модернизируйте пассивные тренировочные полигоны вашей армии. Возведите постройки, чтобы открыть тайные вехи развития воинов.</p>
        
        <div class="menu-row"><button id="upgrade-tank-btn" class="menu-btn">⛺ Тренировочный лагерь</button></div>
        <div class="menu-row"><button id="upgrade-damage-btn" class="menu-btn">🛡️ Казармы</button></div>
        <div class="menu-row"><button id="upgrade-archer-btn" class="menu-btn">⚡ Стрельбище</button></div>
        <div class="menu-row"><button id="upgrade-mage-btn" class="menu-btn">💚 Обитель</button></div>
        
        <button id="close-squad-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Назад в меню</button>
    `;
    setupSquadInterfaceListeners();
}

function setupSquadInterfaceListeners() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleSquadHeroClick(id));
        }
    });
    
    const closeBtn = document.getElementById('close-squad-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => showScreen('main-menu'));
    }
}

function handleSquadHeroClick(id) {
    const data = SQUAD_HERO_LORE[id];
    if (!data) return;

    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    if (isPurchased) {
        alert(`${data.title}\n\n${data.lore}\n\nСтатус: Здание успешно возведено и функционирует!`);
        return;
    }

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 100;

    const textConfirm = `${data.title}\n\n${data.lore}\n\nЖелаете мгновенно возвести постройку «${data.name}» за 100 🪙 золота?`;
    
    if (confirm(textConfirm)) {
        if (currentGold >= cost) {
            localStorage.setItem('khamach_gold', currentGold - cost);
            localStorage.setItem(`khamach_squad_build_${id}`, 'true');
            localStorage.setItem(`khamach_build_${id}`, 1);
            
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            updateSquadVisualStyles();
            
            alert(`Строительство здания «${data.name}» успешно завершено!`);
        } else {
            alert(`Недостаточно золота в казне! Требуется 🪙 ${cost}.`);
        }
    }
}

function updateSquadVisualStyles() {
    const ids = ['tank', 'damage', 'archer', 'mage'];
    ids.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (!btn) return;

        const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
        if (isPurchased) {
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
        } else {
            btn.style.background = "";
            btn.style.borderColor = "";
        }
    });
}
