@page "/match3"
@using System
@using System.Threading.Tasks
@using Microsoft.AspNetCore.Components
@using Match3Game.Pages
@using Match3Game.Core

<div class="game-wrapper" style="display: flex; flex-direction: column; align-items: center; max-width: 400px; margin: 0 auto; padding: 10px; position: relative;">
    
    <GameStats Score="@score" MovesLeft="@movesLeft" />

    @if (isGameOver)
    {
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(44, 62, 80, 0.98); z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 12px; color: white; padding: 25px; box-sizing: border-box; text-align: center;">
            <h2 style="color: #e74c3c; margin: 0 0 10px 0;">Игра окончена!</h2>
            <p style="font-size: 1.2rem; margin: 0 0 15px 0;">Результат: <strong style="color: #f1c40f;">@score</strong></p>
            
            @if (!IsWalletConnected)
            {
                <div style="background: rgba(0,0,0,0.25); padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 1px dashed #f1c40f;">
                    <p style="margin: 0 0 12px 0; color: #bdc3c7; font-size: 0.95rem;">Для сохранения прогресса авторизуйтесь с помощью криптокошелька Грам.</p>
                    <button style="background-color: #3498db; padding: 10px 15px; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; color: white;" @onclick="GoToAuth">
                        👤 Создать профиль и привязать
                    </button>
                </div>
            }

            <button style="background-color: #2ecc71; margin-bottom: 10px; width: 220px; padding: 12px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; color: white;" @onclick="InitGame">Играть снова</button>
            <button style="background-color: #7f8c8d; width: 220px; padding: 12px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; color: white;" @onclick="ExitToMenu">Вернуться в город</button>
        </div>
    }

    <GameGrid Rows="@rows" Cols="@cols" Grid="@grid" SelectedRow="@selectedRow" SelectedCol="@selectedCol" OnCellClick="HandleCellClick" />

    <GameControls IsGameOver="@isGameOver" OnShuffle="ShuffleGrid" OnExit="ExitToMenu" />
</div>

@code {
    [Parameter] public EventCallback OnGameOver { get; set; }
    [Parameter] public EventCallback OnRequestAuth { get; set; }
    [Parameter] public bool IsWalletConnected { get; set; }

    private int rows = 8; private int cols = 8;
    private int[,] grid = new int[8, 8];
    private int selectedRow = -1; private int selectedCol = -1;
    private int score = 0; private int movesLeft = 20;
    private bool isGameOver = false;
    private Random rand = new Random();

    protected override void OnInitialized() => InitGame();

    private void InitGame()
    {
        score = 0; movesLeft = 20; isGameOver = false;
        ResetSelection(); GenerateValidGrid();
    }

    private void ResetSelection() { selectedRow = -1; selectedCol = -1; }

    private void GenerateValidGrid()
    {
        do {
            for (int r = 0; r < rows; r++)
                for (int c = 0; c < cols; c++)
                    grid[r, c] = rand.Next(1, 6);
        } while (HasMatches());
    }

    private async Task HandleCellClick((int r, int c) coord)
    {
        if (isGameOver) return;
        if (selectedRow == -1 && selectedCol == -1) { selectedRow = coord.r; selectedCol = coord.c; }
        else {
            if (IsAdjacent(selectedRow, selectedCol, coord.r, coord.c)) {
                SwapTiles(selectedRow, selectedCol, coord.r, coord.c);
                if (HasMatches()) {
                    movesLeft--; await ProcessMatches();
                    if (movesLeft <= 0) isGameOver = true;
                } else SwapTiles(selectedRow, selectedCol, coord.r, coord.c);
            }
            ResetSelection();
        }
    }

    private bool IsAdjacent(int r1, int c1, int r2, int c2) =>
        (Math.Abs(r1 - r2) == 1 && c1 == c2) || (Math.Abs(c1 - c2) == 1 && r1 == r2);

    private void SwapTiles(int r1, int c1, int r2, int c2)
    {
        int temp = grid[r1, c1]; grid[r1, c1] = grid[r2, c2]; grid[r2, c2] = temp;
    }

    private bool HasMatches()
    {
        for (int r = 0; r < rows; r++)
            for (int c = 0; c < cols - 2; c++)
                if (grid[r, c] != 0 && grid[r, c] == grid[r, c + 1] && grid[r, c] == grid[r, c + 2]) return true;
        for (int c = 0; c < cols; c++)
            for (int r = 0; r < rows - 2; r++)
                if (grid[r, c] != 0 && grid[r, c] == grid[r + 1, c] && grid[r, c] == grid[r + 2, c]) return true;
        return false;
    }

    private async Task ProcessMatches()
    {
        while (HasMatches()) {
            bool[,] toDestroy = new bool[8, 8];
            for (int r = 0; r < rows; r++)
                for (int c = 0; c < cols - 2; c++)
                    if (grid[r, c] != 0 && grid[r, c] == grid[r, c + 1] && grid[r, c] == grid[r, c + 2])
                        toDestroy[r, c] = toDestroy[r, c + 1] = toDestroy[r, c + 2] = true;
            for (int c = 0; c < cols; c++)
                for (int r = 0; r < rows - 2; r++)
                    if (grid[r, c] != 0 && grid[r, c] == grid[r + 1, c] && grid[r, c] == grid[r + 2, c])
                        toDestroy[r, c] = toDestroy[r + 1, c] = toDestroy[r + 2, c] = true;

            int destroyed = 0;
            for (int r = 0; r < rows; r++)
                for (int c = 0; c < cols; c++)
                    if (toDestroy[r, c]) { grid[r, c] = 0; destroyed++; }

            score += destroyed * 10; StateHasChanged(); await Task.Delay(250);
            DropAndFill(); StateHasChanged(); await Task.Delay(200);
        }
    }

    private void DropAndFill()
    {
        for (int c = 0; c < cols; c++) {
            int emptyRow = rows - 1;
            for (int r = rows - 1; r >= 0; r--)
                if (grid[r, c] != 0) {
                    grid[emptyRow, c] = grid[r, c];
                    if (emptyRow != r) grid[r, c] = 0;
                    emptyRow--;
                }
            for (int r = emptyRow; r >= 0; r--) grid[r, c] = rand.Next(1, 6);
        }
    }

    private void ShuffleGrid() { if (!isGameOver) { GenerateValidGrid(); ResetSelection(); } }
    private async Task GoToAuth() => await OnRequestAuth.InvokeAsync();
    
    private async Task ExitToMenu() 
    { 
        // При выходе в меню сохраняем очки в наш изолированный сервис
        GameHistoryService.AddRecord(score);
        await OnGameOver.InvokeAsync(); 
    }
}
