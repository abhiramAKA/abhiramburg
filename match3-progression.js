/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ПРОГРЕССИИ И ДОСКИ 24 ТИРОВ (ИСПРАВЛЕН - v4.8.4-BETA)
   ========================================================================== */

function getMaxUnlockedTier() {
    const saved = localStorage.getItem('khamach_max_tier');
    return saved ? parseInt(saved) : 1;
}

function saveCompletedTier(tier) {
    const currentMax = getMaxUnlockedTier();
    if (tier >= currentMax && tier < 24) {
        localStorage.setItem('khamach_max_tier', tier + 1);
    }
}

function renderDragonSelectionGrid() {
    const gridContainer = document.getElementById('dragon-levels-grid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    const maxUnlocked = getMaxUnlockedTier();
    
    const uniqueFirstDragons = [
        "Дракон-Падальщик Разлома",
        "Чешуйчатый Тиран Забытых Гор",
        "Пещерный Змей Глубоких Склепов",
        "Древний Левиафан Стонущих Скал"
    ];
    
    const elements = ["Огонь", "Лед", "Тьма", "Свет"];
    
    for (let t = 1; t <= 24; t++) {
        const isLocked = t > maxUnlocked;
        
        const row = document.createElement('div');
        row.className = 'menu-row';
        row.style.margin = '5px 0';
        
        const btn = document.createElement('button');
        btn.className = 'menu-btn dragon-level-btn';
        btn.style.transition = 'all 0.2s ease';
        
        if (isLocked) {
            btn.classList.add('disabled');
            btn.innerHTML = `🔒 Тир ${t} (Победите Тир ${t-1})`;
        } else {
            let label = "";
            // Цветовая разметка стихий и уникальные первые 4 дракона
            if (t <= 4) {
                label = `🐲 Тир ${t}: ${uniqueFirstDragons[t-1]}`;
                btn.style.background = "linear-gradient(to bottom, #2b231d, #14100e)";
                btn.style.borderColor = "#6e5541";
                btn.style.color = "#d9b391";
            } else {
                const element = elements[(t - 5) % 4];
                label = `🐉 Тир ${t} [${element}]`;
                
                if (element === "Огонь") {
                    btn.style.background = "linear-gradient(to bottom, #3b1717, #1c0a0a)";
                    btn.style.borderColor = "#9c2a2a";
                    btn.style.color = "#ff8c8c";
                } else if (element === "Лед") {
                    btn.style.background = "linear-gradient(to bottom, #162436, #0b121c)";
                    btn.style.borderColor = "#2a629c";
                    btn.style.color = "#8cd1ff";
                } else if (element === "Тьма") {
                    btn.style.background = "linear-gradient(to bottom, #28173b, #130a1c)";
                    btn.style.borderColor = "#6d2a9c";
                    btn.style.color = "#e58cff";
                } else if (element === "Свет") {
                    btn.style.background = "linear-gradient(to bottom, #362e19, #1a160c)";
                    btn.style.borderColor = "#9c7f2a";
                    btn.style.color = "#ffe88c";
                }
            }
            
            const hp = 120 + (t - 1) * 60;
            btn.innerHTML = `${label} — ${hp} HP`;
            btn.dataset.level = t;
            
            btn.addEventListener('click', (e) => {
                selectedDragonLevel = parseInt(e.currentTarget.dataset.level);
                if (typeof startBackgroundMusic === 'function') startBackgroundMusic();
                showScreen('combat-screen');
                if (typeof startCombatSession === 'function') {
                    startCombatSession(selectedDragonLevel);
                }
            });
        }
        
        row.appendChild(btn);
        gridContainer.appendChild(row);
    }
}
