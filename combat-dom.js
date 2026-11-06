/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ПОЛНОГО РЕНДЕРИНГА БОЕВОГО ИНТЕРФЕЙСА (ОБНОВЛЕН - v4.9.5-BETA)
   ========================================================================== */

function injectCombatInterfaceBaseDOM() {
    const container = document.getElementById('dynamic-combat-screen');
    if (!container) return;

    container.innerHTML = `
        <!-- ================= БОЕВОЙ ЭКРАН ================= -->
        <div id="combat-screen" class="game-window" style="display: none; max-width: 460px; padding: 8px 12px;">
            <div id="dragon-raid-zone" style="position: relative;"></div>

            <!-- ПАНЕЛЬ БОССА С ВЕРХНИМ УПРАВЛЕНИЕМ -->
            <div id="boss-panel" style="margin-bottom: 4px; padding: 4px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                    <div id="boss-name" style="font-size: 12px; margin: 0;">ДРАКОН НЕКРОСМУТ</div>
                    <div style="display: flex; gap: 4px;">
                        <button id="combat-help-btn" class="info-btn" style="width: 26px; height: 26px; font-size: 12px; box-shadow: none; border-radius: 4px; padding: 0;">❓</button>
                        <button id="combat-escape-top-btn" class="info-btn back-btn" style="width: 26px; height: 26px; font-size: 11px; box-shadow: none; border-radius: 4px; margin-top: 0; padding: 0;">❌</button>
                    </div>
                </div>
                <div class="hp-bar-container" style="height: 10px;">
                    <div id="boss-hp-bar" class="hp-bar" style="width: 100%;"></div>
                    <div id="boss-hp-text" style="font-size: 9px; line-height: 10px;">120 / 120</div>
                </div>
            </div>

            <!-- СТАТУС РАУНДА -->
            <div id="battle-status-panel" style="margin-bottom: 4px; padding: 4px; font-size: 11px; flex-direction: column; align-items: stretch; gap: 2px;">
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div id="combat-round-display">Раунд: 1</div>
                    <div id="combat-ap-display" style="color: #ffd700; font-weight: bold;">Сделайте ход на поле!</div>
                </div>
                <div id="combat-shield-display" style="display: none; text-align: center; color: #4a90e2; font-weight: bold; font-size: 11px; border-top: 1px dashed #3a3025; padding-top: 2px;">🛡️ Танк спровоцировал дракона!</div>
            </div>

            <!-- ИНТЕРФЕЙС ОТРЯДА -->
            <div id="squad-matrix" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-bottom: 4px;"></div>

            <!-- ИГРОВОЕ ПОЛЕ MATCH-3 -->
            <div id="match3-board-container" class="match3-board"></div>
        </div>

        <!-- ================= СПРАВОЧНИК В БОЮ ================= -->
        <div id="combat-help-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content">
                <h2>ГОРНИЛО РУН</h2>
                <span class="subtitle">Справочник Сил</span>
                <div id="combat-help-text-container"></div>
                <button id="close-combat-help-btn" class="menu-btn back-btn" style="margin-top: 15px; width: 100%;">Вернуться в бой</button>
            </div>
        </div>

        <!-- ================= ОКНО ОБУЧЕНИЯ ПЕРВОГО БОЯ ================= -->
        <div id="combat-welcome-tutorial-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 380px; padding: 20px; text-align: center;">
                <div style="font-size: 13px; color: #cdb38c; line-height: 1.5; display: flex; flex-direction: column; gap: 10px; background: rgba(0,0,0,0.5); padding: 14px; border: 1px solid #544432; border-radius: 4px; margin-bottom: 15px; text-align: left;">
                    <div>⚡ <strong>1. Собирайте руны:</strong> Триады камней копят энергию SP для героев своего цвета (🔥 🛡️ ⚡ 💚). Ходы тратить на свайпы.</div>
                    <div>👑 <strong>2. Бейте ультой:</strong> Когда шкала SP героя дойдет до 100%, <strong>НАЖМИТЕ НА КАРТОЧКУ БОЙЦА</strong> для сокрушительного удара!</div>
                </div>
                <button id="close-combat-tutorial-btn" class="menu-btn" style="width:100%; background: linear-gradient(to bottom, #1d3a1e, #0f2110); border-color: #316e34; padding: 10px;">В Бой!</button>
            </div>
        </div>

        <!-- ================= ОКНО ОСОБЫХ КОМБИНАЦИЙ ================= -->
        <div id="combat-combo-tutorial-screen" class="game-window combat-help-popup" style="display: none;">
            <div class="combat-help-content" style="max-width: 380px; padding: 20px; text-align: center;">
                <div style="font-size: 13px; color: #ffb3ba; line-height: 1.4; background: rgba(40,10,10,0.5); padding: 14px; border: 1px solid #6e3131; border-radius: 4px; margin-bottom: 15px; text-align: left;">
                    Вы собрали усиленный ряд из 4 или 5 рун! В данный момент эти продвинутые комбинации <strong>неактивны</strong>. Чтобы разблокировать их истинную разрушительную силу, улучшайте и прокачивайте своих бойцов в Военном Лагере!
                </div>
                <button id="close-combat-combo-tutorial-btn" class="menu-btn" style="width:100%; background: linear-gradient(to bottom, #2d2621, #171311); padding: 10px;">Понятно</button>
            </div>
        </div>
    `;
}

function buildDragonDOM() {
    const raidZone = document.getElementById('dragon-raid-zone');
    if (!raidZone) return;

    raidZone.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'dragon-container';

    const model = document.createElement('div');
    model.id = 'dragon-model';
    model.className = 'dragon-idle';
    model.innerText = '🐉';
    model.style.fontSize = '70px';
    model.style.display = 'flex';
    model.style.alignItems = 'center';
    model.style.justifyContent = 'center';

    const fireFx = document.createElement('div');
    fireFx.id = 'dragon-fire-fx';
    fireFx.className = 'fire-breath-fx';

    container.appendChild(model);
    container.appendChild(fireFx);
    raidZone.appendChild(container);
}

function updateCombatInterfaceDOM() {
    const hpBar = document.getElementById('boss-hp-bar');
    const hpText = document.getElementById('boss-hp-text');
    if (hpBar && hpText) {
        let pct = (combatData.dragonHP / combatData.dragonMaxHP) * 100;
        hpBar.style.width = pct + '%';
        hpText.innerText = `${combatData.dragonHP} / ${combatData.dragonMaxHP}`;
    }
    
    const roundDisp = document.getElementById('combat-round-display');
    if (roundDisp) roundDisp.innerText = `Раунд: ${combatData.currentRound}`;
    
    const shieldDisp = document.getElementById('combat-shield-display');
    if (shieldDisp) {
        shieldDisp.style.display = combatData.tankTaunting ? 'block' : 'none';
    }
    
    const squadMatrix = document.getElementById('squad-matrix');
    if (!squadMatrix) return;
    
    squadMatrix.innerHTML = '';
    combatData.squad.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-gothic-card';
        
        let isReady = (hero.sp >= hero.maxSP && hero.hp > 0);
        if (isReady) card.classList.add('ready-glow');
        if (hero.hp <= 0) {
            card.style.opacity = '0.3';
            card.style.filter = 'grayscale(1)';
        }
        
        let hpPct = (hero.hp / hero.maxHP) * 100;
        let spPct = (hero.sp / hero.maxSP) * 100;
        
        const heroLvl = typeof getBuildingLevel === 'function' ? getBuildingLevel(hero.id) : 0;
        const currentFatigue = Math.min(100, Math.max(0, parseInt(localStorage.getItem(`khamach_fatigue_${hero.id}`) || '0')));
        
        card.innerHTML = `
            <div class="hero-card-avatar" style="color: ${hero.color};">${hero.icon}</div>
            <div class="hero-card-name" style="font-size: 8px; line-height: 1.1;">
                ${hero.name}<br>
                <span style="color: #ffd700;">Ур. ${heroLvl}</span><br>
                <span style="color: #ffb3ba; font-weight: normal;">🥱 ${currentFatigue}%</span>
            </div>
            <div class="hero-bar-container" style="height: 11px;">
                <div class="hero-bar-fill hp-fill" style="width: ${hpPct}%;"></div>
                <div class="hero-bar-text">${hero.hp}/${hero.maxHP}</div>
            </div>
            <div class="hero-bar-container" style="border-color: #5c4314; background: #0f0a02; height: 11px;">
                <div class="hero-bar-fill sp-fill" style="width: ${spPct}%;"></div>
                <div class="hero-bar-text" style="color: #ffd700;">SP ${Math.round(spPct)}%</div>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (hero.hp > 0 && hero.sp >= hero.maxSP && typeof activateHeroSuperpower === 'function') {
                activateHeroSuperpower(hero.id);
            }
        });
        squadMatrix.appendChild(card);
    });
    
    if (typeof setupCombatHelpListeners === 'function') setupCombatHelpListeners();
}
