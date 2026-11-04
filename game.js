/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (ВЕРНУЛИ МАГА! - v0.6.0-beta.16)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-beta.16";

const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = ['🔥', '🛡️', '💚', '⚡️', '💀'];

let combatData = {
    dragonHP: 1000,
    dragonMaxHP: 1000,
    playerAP: 3,
    playerMaxAP: 3,
    currentRound: 1,
    playerShield: 0,
    squad: [
        { name: "Воин", hp: 120, maxHP: 120, class: "warrior", role: "⚔️", icon: "⚔️" },
        { name: "Маг", hp: 80, maxHP: 80, class: "mage", role: "⚡️", icon: "⚡️" },
        { name: "Клирик", hp: 90, maxHP: 90, class: "cleric", role: "💚", icon: "💚" }
    ]
};

let match3BoardData = [];
let selectedCell = null;

// Тексты игровых правил и контента (вынесено из разметки HTML)
const GAME_TEXTS = {
    mainInfo: `
        <p><strong>Система Очков Действия:</strong> Вам дается 3 ОД на раунд. Каждый обмен рун на поле тратит 1 ОД.</p>
        <p>Собирайте комбинации из 3 и более рун. Эффекты суммируются! Дракон атакует строго после того, как вы потратите все 3 ОД.</p>
        <p>Опасайтесь 3-го раунда — Дракон использует массовое <em>Дыхание Рока</em>!</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>🔥 Руна Огня:</strong> Наносит Дракону сокрушительный урон (15 ед. за камень).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>⚡️ Руна Молнии:</strong> Пробивает чешую Дракона чистой магией (10 ед. за камень).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>🛡️ Руна Защиты:</strong> Накапливает щиты отряда (12 ед. за камень). Щит полностью принимает на себя входящие атаки босса.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 10px;"><strong>💚 Руна Жизни:</strong> Моментально исцеляет Воина, Мага и Клирика (8 ед. за камень).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 15px;"><strong>💀 Руна Смерти:</strong> Непредсказуемая тёмная энергия подземелий.</p>
        <p style="border-top: 1px dashed #4a3f2c; padding-top: 10px; font-size: 13px; text-align: left;"><strong>⚔️ Тактика боя:</strong> Соберите мощное комбо за 3 Очка Действия. Когда ОД закончатся, Дракон Некросмут проведёт яростную контратаку по вашему отряду!</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: {
        title: "⚒️ ДРЕВНЯЯ КУЗНИЦА",
        text: "Священное место, где из осколков побеждённых монстров и застывшей лавы можно выковывать мифическое снаряжение для Воина, Мага и Клирика. Повышает базовую атаку и открывает пассивные навыки рун."
    },
    alchemy: {
        title: "🧪 ЛАБОРАТОРИЯ АЛХИМИИ",
        text: "Здесь вы сможете трансмутировать руны прямо во время боя, варить зелья Очков Действия (AP) и дистиллировать драконью кровь для получения мощных эликсиров бессмертия."
    },
    squad: {
        title: "👥 УПРАВЛЕНИЕ ОТРЯДОМ",
        text: "Военный лагерь ваших героев. Позволяет распределять очки характеристик (Сила, Дух, Выносливость), нанимать новых бойцов в рейд и изучать сокрушительные комбо-приемы."
    }
};

window.addEventListener('DOMContentLoaded', () => {
    initVersionDisplay();
    setupMenuListeners();
    setupCombatHelpListeners();
});

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) {
        versionElement.innerText = GAME_VERSION;
    }
}

function showScreen(screenId) {
    const screens = ['main-menu', 'info-screen', 'mode-desc-screen', 'combat-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) {
            screenEl.style.display = (id === screenId) ? 'flex' : 'none';
        }
    });
}

function openModeDescription(modeKey) {
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    document.getElementById('mode-desc-text').innerHTML = modeData.text;
    showScreen('mode-desc-screen');
}

function setupMenuListeners() {
    const toCombatBtn = document.getElementById('to-combat-btn');
    if (toCombatBtn) {
        toCombatBtn.addEventListener('click', () => {
            showScreen('combat-screen');
            if (typeof startCombatSession === 'function') {
                startCombatSession();
            }
        });
    }

    const infoBtn = document.getElementById('info-btn');
    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            const infoTextEl = document.getElementById('info-screen-text');
            if (infoTextEl) infoTextEl.innerHTML = GAME_TEXTS.mainInfo;
            showScreen('info-screen');
        });
    }

    const fromInfoToMenuBtn = document.getElementById('from-info-to-menu-btn');
    if (fromInfoToMenuBtn) {
        fromInfoToMenuBtn.addEventListener('click', () => {
            showScreen('main-menu');
        });
    }

    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => openModeDescription('squad'));

    document.getElementById('close-mode-desc-btn').addEventListener('click', () => {
        showScreen('main-menu');
    });

    const leaveCombatBtn = document.getElementById('leave-combat-btn');
    if (leaveCombatBtn) {
        leaveCombatBtn.addEventListener('click', () => {
            if (confirm("Вы уверены, что хотите сбежать из рейда?")) {
                showScreen('main-menu');
            }
        });
    }
}

function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            const txtContainer = document.getElementById('combat-help-text-container');
            if (txtContainer) txtContainer.innerHTML = GAME_TEXTS.combatHelp;
            
            const helpScreen = document.getElementById('combat-help-screen');
            if (helpScreen) {
                helpScreen.classList.add('mobile-fullscreen');
                helpScreen.style.display = 'flex';
            }
        });
    }
    
    if (closeCombatHelpBtn) {
        closeCombatHelpBtn.addEventListener('click', () => {
            const helpScreen = document.getElementById('combat-help-screen');
            if (helpScreen) {
                helpScreen.style.display = 'none';
                helpScreen.classList.remove('mobile-fullscreen');
            }
        });
    }
}
