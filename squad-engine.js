/* ==========================================================================
   КХАМАЧ — МОДУЛЬ УПРАВЛЕНИЯ И СТРОИТЕЛЬСТВА В МЕНЮ ОТРЯДА (v2.6.0-BETA)
   ========================================================================== */

const HERO_SQUAD_DATA = {
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

function initSquadModuleListeners() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (btn) {
            btn.addEventListener('click', () => handleSquadBuildingClick(id));
        }
    });
}

function updateSquadButtonsDOM() {
    const buildings = ['tank', 'damage', 'archer', 'mage'];
    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;

    buildings.forEach(id => {
        const btn = document.getElementById(`upgrade-${id}-btn`);
        if (!btn) return;

        const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
        const baseName = HERO_SQUAD_DATA[id].name;

        if (isPurchased) {
            btn.innerText = `${baseName} (⚙️ ВОЗВЕДЕНО)`;
            btn.style.background = "linear-gradient(to bottom, #1d3a1e 0%, #0f2110 100%)";
            btn.style.borderColor = "#316e34";
        } else {
            btn.innerText = `${baseName} — 100 🪙`;
            btn.style.background = ""; 
            btn.style.borderColor = "";
            
            if (currentGold < 100) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        }
    });
}

function handleSquadBuildingClick(id) {
    const data = HERO_SQUAD_DATA[id];
    if (!data) return;

    const isPurchased = localStorage.getItem(`khamach_squad_build_${id}`) === 'true';
    
    if (isPurchased) {
        alert(`${data.title}\n\n${data.lore}\n\nСтатус: Здание уже успешно возведено и оберегает цитадель.`);
        return;
    }

    const currentGold = typeof getPlayerGold === 'function' ? getPlayerGold() : 0;
    const cost = 100;

    const textConfirm = `${data.title}\n\n${data.lore}\n\nЖелаете мгновенно возвести постройку «${data.name}» за 100 🪙 золота?`;
    
    if (confirm(textConfirm)) {
        if (currentGold >= cost) {
            localStorage.setItem('khamach_gold', currentGold - cost);
            localStorage.setItem(`khamach_squad_build_${id}`, 'true');
            localStorage.setItem(`khamach_build_${id}`, 1); // Активируем 1-й ранг влияния на боевой код
            
            if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
            updateSquadButtonsDOM();
            
            alert(`Великое свершение! Постройка «${data.name}» успешно возведена!`);
        } else {
            alert(`Недостаточно золота в казне! Требуется 🪙 ${cost} для оплаты труда зодчих.`);
        }
    }
}
