function showScreen(screenId) {
    // Добавлены 'storage-screen' и 'missions-screen'
    const screens = ['main-menu', 'dragon-select-screen', 'info-screen', 'mode-desc-screen', 'squad-screen', 'combat-screen', 'storage-screen', 'missions-screen'];
    screens.forEach(id => {
        const screenEl = document.getElementById(id);
        if (screenEl) screenEl.style.display = (id === screenId) ? 'flex' : 'none';
    });
    
    if (screenId === 'dragon-select-screen' && typeof renderDragonSelectionGrid === 'function') {
        renderDragonSelectionGrid();
    }
    if (screenId === 'squad-screen' && typeof updateSquadVisualStyles === 'function') {
        updateSquadVisualStyles();
    }
    if (screenId === 'storage-screen' && typeof updateStorageScreenDOM === 'function') {
        updateStorageScreenDOM();
    }
    if (screenId === 'missions-screen' && typeof renderMissionsDOM === 'function') {
        renderMissionsDOM();
    }
    if (screenId === 'main-menu' || screenId === 'squad-screen' || screenId === 'mode-desc-screen' || screenId === 'storage-screen') {
        if (typeof updateTownGoldDisplay === 'function') updateTownGoldDisplay();
    }
}
