/* ==========================================================================
   КХАМАЧ — ВЫЧИСЛИТЕЛЬНЫЙ МОДУЛЬ ТРЕНИРОВОК И ПОТОЛКА ОТРЯДА (v4.7.4-BETA)
   ========================================================================== */

const SQUAD_HERO_LORE = {
    tank: {
        name: "🛡️ Гарнизон",
        title: "🛡️ ЗАЩИТНИК (РЫЦАРЬ СМЕРТИ)",
        resourceKey: "plasma",
        resourceIcon: "🌋",
        resourceName: "Плазма дракона",
        statBonus: "+20 Max HP за уровень",
        lore: "Латные рукавицы намертво сжимают ростовой щит из костей. Он — несокрушимая скала Абхирамбурга, принимающая на себя всю ярость извергаемого драконьего пламени."
    },
    damage: {
        name: "🔥 Казармы",
        title: "🔥 ВОИН (БЕРСЕРК ГОРНИЛА)",
        resourceKey: "blood",
        resourceIcon: "🩸",
        resourceName: "Кровь дракона",
        statBonus: "+15 к урону ультимейта за уровень",
        lore: "Одержимый первобытным гневом рун Кхамача, этот безумный боец не признает защиты. Его парные топоры жаждут лишь одного — вскрыть хребет древнего змея."
    },
    archer: {
        name: "⚡ Стрельбище",
        title: "⚡ СТРЕЛОК (СЛЕДОПЫТ ГРОЗЫ)",
        resourceKey: "scale",
        resourceIcon: "🪶",
        resourceName: "Чешую дракона",
        statBonus: "+10 к урону молнии за уровень",
        lore: "Его стрелы оперены чешуей драконов света, а тетива поет песнь молний. Метким выстрелом Следопыт способен ослепить чудовище."
    },
    damage_mage: {
        name: "💚 Обитель",
        title: "💚 МАГ (ОТРИЦАТЕЛЬ СМЕРТИ)",
        resourceKey: "tears",
        resourceIcon: "💧",
        resourceName: "Слезы дракона",
        statBonus: "+5 к групповому хилу за уровень",
        lore: "Тайные эссенции жизни текут по его венам. Хранитель Обители балансирует на грани миров, собирая изумрудные руны, чтобы залечить раны отряда."
    }
};

window.getHeroLevel = function(id) { return parseInt(localStorage.getItem(`khamach_hero_lvl_${id}`) || '1'); };
window.getBuildingLevel = function(id) { return parseInt(localStorage.getItem(`khamach_build_${id}`) || '0'); };

window.updateStorageScreenDOM = function() {
    const listContainer = document.getElementById('storage-resources-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = `
        <div style="color: #e6c280; font-weight: bold; border-bottom: 1px solid #544432; padding-bottom: 6px; margin-bottom: 10px; text-transform: uppercase; font-size: 13px;">📜 Материалы Хранилища:</div>
        <div style="display: grid; grid-template-columns: 1fr; gap: 8px; font-size: 14px; color: #cdb38c;">
            <div>🌋 Плазма древнего змея: <strong style="color:#fff; float: right;">${window.getPlayerResource('plasma')} шт.</strong></div>
            <div>🩸 Первородная кровь дракона: <strong style="color:#fff; float: right;">${window.getPlayerResource('blood')} шт.</strong></div>
            <div>🪶 Плотная чешуя ящера: <strong style="color:#fff; float: right;">${window.getPlayerResource('scale')} шт.</strong></div>
            <div>💧 Чистые слезы природы: <strong style="color:#fff; float: right;">${window.getPlayerResource('tears')} шт.</strong></div>
        </div>
    `;
};

window.updateSquadHeroesSpecScreenDOM = function() {
    const container = document.getElementById('heroes-upgrade-list-container');
    if (!container) return;
    container.innerHTML = '';
    
    const heroesData = [
        { id: "tank" },
        { id: "damage" },
        { id: "archer" },
        { id: "mage" }
    ];
    
    heroesData.forEach(h => {
        const lore = SQUAD_HERO_LORE[h.id === 'mage' ? 'damage_mage' : h.id];
        if (!lore) return;
        
        const heroLvl = window.getHeroLevel(h.id);
        const buildLvl = window.getBuildingLevel(h.id);
        const isPurchased = localStorage.getItem(`khamach_squad_build_${h.id}`) === 'true';
        const currentRes = typeof window.getPlayerResource === 'function' ? window.getPlayerResource(lore.resourceKey) : 0;
        
        const card = document.createElement('div');
        card.style.background = "rgba(25, 20, 18, 0.9)";
        card.style.border = "1px solid #544432";
        card.style.padding = "8px 10px";
        card.style.borderRadius = "3px";
        card.style.display = "flex";
        card.style.flexDirection = "column";
        card.style.gap = "2px";
        
        let actionBtnHTML = '';
        if (!isPurchased) {
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px;" disabled>Здание не построено</button>`;
        } else if (heroLvl >= 15) {
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px;" disabled>МАКС. УРОВЕНЬ</button>`;
        } else if (heroLvl >= buildLvl) {
            actionBtnHTML = `<button class="menu-btn disabled" style="padding:4px; font-size:11px; background:#421e1e; border-color:#6e3131;" disabled>Требуется ${lore.name} ${heroLvl + 1} ур.</button>`;
        } else {
            actionBtnHTML = `<button class="menu-btn" style="padding:4px; font-size:11px; background:#1d3a1e; height:24px;" onclick="window.triggerHeroLevelUpgrade('${h.id}')">Повысить уровень</button>`;
        }
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:#e6c280; font-size:12px;">
                <span>${lore.title}</span>
                <span style="color:#ffd700;">Ур. ${heroLvl} <span style="font-weight:normal; font-size:10px; color:#8a7350;">(Потолок: ${buildLvl})</span></span>
            </div>
            <div style="font-size:11px; color:#cdb38c; line-height:1.2;">Эффект: <span style="color:#2ecc71;">${lore.statBonus}</span></div>
            <div style="font-size:11px; color:#bfae96;">Цена: 1 шт. ${lore.resourceIcon} ${lore.resourceName} (Есть: ${currentRes})</div>
            <div style="margin-top:2px;">${actionBtnHTML}</div>
        `;
        container.appendChild(card);
    });
};

window.triggerHeroLevelUpgrade = function(heroId) {
    const heroesData = {
        tank: { resKey: "plasma", name: "🌋 Плазму" },
        damage: { resKey: "blood", name: "🩸 Кровь" },
        archer: { resKey: "scale", name: "🪶 Чешую" },
        mage: { resKey: "tears", name: "💧 Слезы" }
    };
    const target = heroesData[heroId];
    if (!target) return;

    const currentRes = typeof window.getPlayerResource === 'function' ? window.getPlayerResource(target.resKey) : 0;
    const heroLvl = window.getHeroLevel(heroId);

    if (currentRes < 1) {
        alert(`Недостаточно трофеев! Требуется 1 шт. ${target.name}.`);
        return;
    }

    if (typeof addPlayerResource === 'function') addPlayerResource(target.resKey, -1);
    localStorage.setItem(`khamach_hero_lvl_${heroId}`, heroLvl + 1);

    if (typeof addChronicleLog === 'function') {
        addChronicleLog(`ТРЕНИРОВКА: Боец повысил уровень до ${heroLvl + 1}-го.`);
    }

    alert(`Боец успешно развил навыки до ${heroLvl + 1} уровня!`);
    window.updateSquadHeroesSpecScreenDOM();
};
