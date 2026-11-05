/* ==========================================================================
   КХАМАЧ — ЦЕНТРАЛЬНЫЙ ДИСПЕТЧЕР (ИНТЕРАКТИВНАЯ МУЗЫКА - v0.6.0-beta.40)
   ========================================================================== */

const GAME_VERSION = "v0.6.0-beta.40";
const BOARD_ROWS = 8;
const BOARD_COLS = 8;
const RUNE_TYPES = new Array('🔥', '🛡️', '💚', '⚡️', '💀');

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

let match3BoardData = new Array();
let selectedCell = null;

const GAME_TEXTS = {
    mainInfo: `
        <h2>ЛОГОВО ЧУДОВИЩА</h2>
        <span class="subtitle">Поле Брани</span>
        <p>Земля содрогается от поступи древнего змея. Скоро здесь появится боевое поле, и каждая собранная триада камней обрушит ярость вашего отряда на врага.</p>
    `,
    combatHelp: `
        <p style="text-align: left; font-size: 13px; margin-bottom: 5px;"><strong>🔥 Огонь / ⚡️ Молния:</strong> Атака босса (15 / 10 урона).</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 5px;"><strong>🛡️ Защита:</strong> Накапливает +12 щита отряда за руну.</p>
        <p style="text-align: left; font-size: 13px; margin-bottom: 5px;"><strong>💚 Жизнь:</strong> Исцеление всех живых героев на +8 за руну.</p>
    `
};

const MODE_DESCRIPTIONS = {
    forge: { 
        title: "⚒️ ДРЕВНЕЕ ГОРНИЛО", 
        subtitle: "Кузница предметов", 
        text: "<p>В полумраке кузницы тяжело вздыхают мехи. Старый мастер готов принять трофеи из черева великого ящера. Из чешуи и хребтовых костей он скует доспех, не знающий износа, а из клыка — клинок, разящий без промаха.</p>" 
    },
    alchemy: { 
        title: "🧪 ТАЙНЫЙ ОЧАГ", 
        subtitle: "Лаборатория Алхимика", 
        text: "<p>Свитки, покрытые пылью веков, и склянки со светящимися эссенциями заполняют полки. Алхимик Абхирамбурга способен дистиллировать кровь Дракона в чистый опыт для ваших верных воинов или превратить прах в золото.</p>" 
    },
    squad: { 
        title: "👥 ВАШЕ ВОИНСТВО", 
        subtitle: "Мой Отряд", 
        text: "<p>Ваш отряд замер у походного костра в ожидании приказов. Сила Кхамача растет с каждой битвой. Здесь вы сможете распределять вехи развития, повышать классы бойцов и снаряжать их в дорогу.</p><p style='color:#e6c280; font-size:13px; border-top:1px dashed #4a3f2c; padding-top:8px;'><strong>Предводитель:</strong> Рыцарь смерти (1 ур)<br>⚔️ Атака: 25 | ❤️ Жизнь: 120</p>" 
    },
    arena: {
        title: "🏆 КОЛИЗЕЙ ОТРЕКШИХСЯ",
        subtitle: "PvP Арена",
        text: "<p>Песок арены пропитан кровью сотен рейдеров, дерзнувших оспорить право на Горнило Рун. Здесь, под пристальным взором Некросмута, Кхамач сталкивает воинов в бесконечной схватке. Собери триаду камней быстрее соперника, или твой прах пополнит залы вечного безмолвия.</p>"
    }
};

function runGameCoreInitialization() {
    initVersionDisplay();
    setupMenuListeners();
    setupCombatHelpListeners();
    setupAudioSettingsListeners();
    if (typeof changeMusicState === 'function') changeMusicState('menu');
}

function initVersionDisplay() {
    const versionElement = document.getElementById('game-version');
    if (versionElement) versionElement.innerText = GAME_VERSION;
}

function showScreen(screenId) {
    const screens = new Array('main-menu', 'info-screen', 'mode-desc-screen', 'combat-screen');
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) screenEl.style.display = (id === screenId) ? 'flex' : 'none';
    });
    if (typeof changeMusicState === 'function') changeMusicState('menu');
}

function openModeDescription(modeKey) {
    const modeData = MODE_DESCRIPTIONS[modeKey];
    if (!modeData) return;
    
    document.getElementById('mode-desc-title').innerText = modeData.title;
    document.getElementById('mode-desc-subtitle').innerText = modeData.subtitle;
    document.getElementById('mode-desc-text').innerHTML = modeData.text;
    document.getElementById('mode-desc-text').style.display = 'block';
    document.getElementById('menu-audio-mixer').style.display = 'none';
    showScreen('mode-desc-screen');
}

function openSettingsWindow() {
    document.getElementById('mode-desc-title').innerText = "⚙️ НАСТРОЙКИ";
    document.getElementById('mode-desc-subtitle').innerText = "Конфигурация звукового ядра";
    document.getElementById('mode-desc-text').style.display = 'none';
    document.getElementById('menu-audio-mixer').style.display = 'block';
    showScreen('mode-desc-screen');
}

function setupAudioSettingsListeners() {
    const volMusic = document.getElementById('volume-music');
    const volFX = document.getElementById('volume-fx');
    const muteBtn = document.getElementById('btn-mute-toggle');

    if (volMusic) {
        volMusic.addEventListener('input', (e) => {
            if (typeof setGameVolume === 'function') setGameVolume('music', e.target.value);
        });
    }
    if (volFX) {
        volFX.addEventListener('input', (e) => {
            if (typeof setGameVolume === 'function') setGameVolume('fx', e.target.value);
        });
    }
    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (typeof toggleGameMute === 'function') {
                const muted = toggleGameMute();
                muteBtn.innerText = muted ? "🔇 Звук выкл" : "🔊 Звук вкл";
                muteBtn.style.borderColor = muted ? "#a84444" : "#544432";
            }
        });
    }
}

function setupMenuListeners() {
    document.getElementById('to-combat-btn').addEventListener('click', () => {
        showScreen('combat-screen');
        if (typeof startCombatSession === 'function') startCombatSession();
    });

    document.getElementById('info-btn').addEventListener('click', () => {
        document.getElementById('info-screen-text').innerHTML = GAME_TEXTS.mainInfo;
        showScreen('info-screen');
    });

    document.getElementById('from-info-to-menu-btn').addEventListener('click', () => showScreen('main-menu'));
    document.getElementById('to-forge-btn').addEventListener('click', () => openModeDescription('forge'));
    document.getElementById('to-settings-btn').addEventListener('click', openSettingsWindow);
    document.getElementById('to-alchemy-btn').addEventListener('click', () => openModeDescription('alchemy'));
    document.getElementById('to-squad-btn').addEventListener('click', () => openModeDescription('squad'));
    document.getElementById('to-arena-btn').addEventListener('click', () => openModeDescription('arena'));
    document.getElementById('close-mode-desc-btn').addEventListener('click', () => showScreen('main-menu'));

    document.getElementById('leave-combat-btn').addEventListener('click', () => {
        if (confirm("Вы уверены, что хотите сбежать из рейда?")) showScreen('main-menu');
    });
}

function setupCombatHelpListeners() {
    const combatHelpBtn = document.getElementById('combat-help-btn');
    const closeCombatHelpBtn = document.getElementById('close-combat-help-btn');
    
    if (combatHelpBtn) {
        combatHelpBtn.addEventListener('click', () => {
            document.getElementById('combat-help-text-container').innerHTML = GAME_TEXTS.combatHelp;
            document.getElementById('combat-help-screen').style.display = 'flex';
        });
    }
    if (closeCombatHelpBtn) {
        closeCombatHelpBtn.addEventListener('click', () => {
            document.getElementById('combat-help-screen').style.display = 'none';
        });
    }
}
