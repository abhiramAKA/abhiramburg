/* ==========================================================================
   КХАМАЧ — МОДУЛЬ ПРОГРЕССИИ И ДОСКИ 24 ТИРОВ (ОБНОВЛЕН - v1.4.0-BETA)
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
    const elements = ["Огонь", "Лед", "Тьма", "Свет"];
    
    const backpackFull = typeof getBackpackItem === 'function' && getBackpackItem() !== null && getBackpackItem() !== '';
    
    for (let t = 1; t <= 24; t++) {
        const element = elements[(t - 1) % 4];
        const isLocked = t > maxUnlocked;
        
        const row = document.createElement('div');
        row.className = 'menu-row';
        row.style.margin = '4px 0';
        
        const btn = document.createElement('button');
        btn.className = 'menu-btn dragon-level-btn';
        
        if (isLocked || backpackFull) {
            btn.classList.add('disabled');
        }
        btn.dataset.level = t;
        
        const hp = 120 + (t - 1) * 60;
        
        if (isLocked) {
            btn.innerHTML = `🔒 Тир ${t} (Победите Тир ${t-1})`;
        } else if (backpackFull) {
            btn.innerHTML = `⚠️ Рюкзак заполнен! Вернитесь в город`;
        } else {
            btn.innerHTML = `🐉 Тир ${t} [${element}] — ${hp} HP`;
        }
            
        if (!isLocked && !backpackFull) {
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
