/* ==========================================================================
   КХАМАЧ — МОДУЛЬ МОДАЛЬНЫХ ОКОН ЦИТАДЕЛИ (УСТАЛОСТЬ, УРОВЕНЬ, КЛАНЫ) (v6.3.1)
   ========================================================================== */

function injectTownPopupsDOM() {
    const fatigueScr = document.getElementById('squad-fatigue-screen');
    if (fatigueScr) {
        const tFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_tank') || '0'));
        const dFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_damage') || '0'));
        const aFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_archer') || '0'));
        const mFat = Math.round(parseFloat(localStorage.getItem('khamach_fatigue_mage') || '0'));
        
        fatigueScr.innerHTML = `
            <div class="combat-help-content" style="max-width: 380px; padding: 20px;">
                <h2>Уровень усталости героев</h2>
                <span class="subtitle">Свежесть боевого отряда</span>
                <div style="display:flex; flex-direction:column; gap:10px; text-align:left; background:rgba(0,0,0,0.5); padding:12px; border:1px solid #544432; border-radius:4px; font-size:13px; color:#cdb38c;">
                    <div style="display:flex; justify-content:space-between;"><span>🛡️ Защитник:</span><strong>${tFat}% Усталости</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>🔥 Воин:</span><strong>${dFat}% Усталости</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>⚡ Стрелок:</span><strong>${aFat}% Усталости</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>💚 Маг:</span><strong>${mFat}% Усталости</strong></div>
                </div>
                <p style="font-size:11px; color:#8a7350; margin-top:10px; line-height:1.35; text-align:justify;">
                    *Поручение Ратуши добавляет +15% усталости, победа в бою — +3% (поражение — 0%). Отдых восстанавливает 10% в час. Усталость пропорционально снижает шанс добычи руды (минимум до 10%), но не влияет на качество редких жил.
                </p>
                <button id="close-fatigue-screen-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 10px; padding: 8px;">Вернуться в меню</button>
            </div>
        `;
    }

    const lvlInfoScr = document.getElementById('squad-level-info-screen');
    if (lvlInfoScr) {
        const tLvl = parseInt(localStorage.getItem('khamach_hero_lvl_tank') || '1');
        const dLvl = parseInt(localStorage.getItem('khamach_hero_lvl_damage') || '1');
        const aLvl = parseInt(localStorage.getItem('khamach_hero_lvl_archer') || '1');
        const mLvl = parseInt(localStorage.getItem('khamach_hero_lvl_mage') || '1');
        const curLvl = typeof window.getSquadPower === 'function' ? window.getSquadPower() : 1;

        lvlInfoScr.innerHTML = `
            <div class="combat-help-content" style="max-width: 380px; padding: 20px;">
                <h2>👑 Уровень Отряда: ${curLvl}</h2>
                <span class="subtitle">Как рассчитывается показатель</span>
                <p style="font-size:12px; color:#cdb38c; line-height:1.45; text-align:left; margin-bottom:10px;">
                    Уровень отряда — это среднее значение уровней прокачки всех четырёх героев вашей команды (округлённое в меньшую сторону). Тренируйте бойцов в Спортзале, чтобы открывать новые главы.
                </p>
                <div style="display:flex; flex-direction:column; gap:6px; text-align:left; background:rgba(0,0,0,0.5); padding:10px; border:1px solid #544432; border-radius:4px; font-size:12px; color:#e6c280;">
                    <div style="display:flex; justify-content:space-between;"><span>🛡️ Защитник:</span><strong>Ур. ${tLvl}</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>🔥 Воин:</span><strong>Ур. ${dLvl}</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>⚡ Стрелок:</span><strong>Ур. ${aLvl}</strong></div>
                    <div style="display:flex; justify-content:space-between;"><span>💚 Маг:</span><strong>Ур. ${mLvl}</strong></div>
                    <div style="border-top:1px dashed #544432; padding-top:4px; margin-top:2px; display:flex; justify-content:space-between; color:#ffd700;">
                        <span>Формула: (${tLvl}+${dLvl}+${aLvl}+${mLvl}) ÷ 4</span><strong>Уровень ${curLvl}</strong>
                    </div>
                </div>
                <button id="close-level-info-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 12px; padding: 8px;">Понятно</button>
            </div>
        `;
    }

    let clansLockScr = document.getElementById('clans-lock-info-screen');
    if (!clansLockScr) {
        clansLockScr = document.createElement('div');
        clansLockScr.id = 'clans-lock-info-screen';
        clansLockScr.className = 'game-window combat-help-popup';
        clansLockScr.style.display = 'none';
        document.body.appendChild(clansLockScr);
    }
    const curSquadLvl = typeof window.getSquadPower === 'function' ? window.getSquadPower() : 1;
    clansLockScr.innerHTML = `
        <div class="combat-help-content" style="max-width: 380px; padding: 20px;">
            <h2>👥 ВРАТА КЛАНОВ И МИРОВ</h2>
            <span class="subtitle">Межмировая Экспедиция</span>
            <p style="font-size:12px; color:#cdb38c; line-height:1.5; text-align:left; background:rgba(0,0,0,0.5); padding:12px; border:1px solid #544432; border-radius:4px; margin-bottom:12px;">
                За этими вратами открывается новая эпоха приключений! Вас ждут <strong>клановые баталии</strong>, приручение боевых <strong>питомцев</strong>, <strong>сражения на космических кораблях</strong> в далёких мирах, собственная <strong>ферма</strong> ресурсов и великие союзные походы.
            </p>
            <div style="font-size:12px; color:#ffb3ba; font-weight:bold; padding:8px; border:1px dashed #6e3131; background:rgba(40,10,10,0.5); border-radius:4px;">
                🔒 Доступ закрыт: требуется 2-й уровень отряда (команды).<br>
                <span style="color:#ffd700; font-weight:normal;">Ваш текущий уровень команды: 👑 ${curSquadLvl}</span>
            </div>
            <button id="close-clans-lock-btn" class="menu-btn back-btn" style="width: 100%; margin-top: 12px; padding: 10px;">Вернуться в Цитадель</button>
        </div>
    `;
}
