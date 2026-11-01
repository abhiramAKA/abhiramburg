using System;
using System.Collections.Generic;

namespace Match3Game.Core
{
    public class GameModel
    {
        public int[,] Grid { get; private set; }
        public int Score { get; private set; }
        private readonly Random _random = new();

        public GameModel()
        {
            Grid = new int[GameConfig.Rows, GameConfig.Cols];
        }

        public void InitGrid()
        {
            do
            {
                for (int r = 0; r < GameConfig.Rows; r++)
                {
                    for (int c = 0; c < GameConfig.Cols; c++)
                    {
                        Grid[r, c] = GetRandomTile();
                    }
                }
            } while (CheckMatches().Count > 0);
            Score = 0;
        }

        private int GetRandomTile() => GameConfig.TileTypes[_random.Next(GameConfig.TileTypes.Length)];

        public HashSet<TilePosition> CheckMatches()
        {
            var matches = new HashSet<TilePosition>();

            for (int r = 0; r < GameConfig.Rows; r++)
            {
                for (int c = 0; c < GameConfig.Cols - 2; c++)
                {
                    int current = Grid[r, c];
                    if (current != 0 && current == Grid[r, c + 1] && current == Grid[r, c + 2])
                    {
                        matches.Add(new TilePosition(r, c));
                        matches.Add(new TilePosition(r, c + 1));
                        matches.Add(new TilePosition(r, c + 2));
                    }
                }
            }

            for (int c = 0; c < GameConfig.Cols; c++)
            {
                for (int r = 0; r < GameConfig.Rows - 2; r++)
                {
                    int current = Grid[r, c];
                    if (current != 0 && current == Grid[r + 1, c] && current == Grid[r + 2, c])
                    {
                        matches.Add(new TilePosition(r, c));
                        matches.Add(new TilePosition(r + 1, c));
                        matches.Add(new TilePosition(r + 2, c));
                    }
                }
            }
            return matches;
        }

        public void RemoveMatches(IEnumerable<TilePosition> matches)
        {
            int count = 0;
            foreach (var pos in matches)
            {
                if (Grid[pos.Row, pos.Col] != 0)
                {
                    Grid[pos.Row, pos.Col] = 0;
                    count++;
                }
            }
            Score += count * 10;
        }

        public void DropTiles()
        {
            for (int c = 0; c < GameConfig.Cols; c++)
            {
                int emptySpaces = 0;
                for (int r = GameConfig.Rows - 1; r >= 0; r--)
                {
                    if (Grid[r, c] == 0) emptySpaces++;
                    else if (emptySpaces > 0)
                    {
                        Grid[r + emptySpaces, c] = Grid[r, c];
                        Grid[r, c] = 0;
                    }
                }
                for (int r = 0; r < emptySpaces; r++)
                {
                    Grid[r, c] = GetRandomTile();
                }
            }
        }

        public bool IsAdjacent(TilePosition p1, TilePosition p2) =>
            (Math.Abs(p1.Row - p2.Row) == 1 && p1.Col == p2.Col) ||
            (Math.Abs(p1.Col - p2.Col) == 1 && p1.Row == p2.Row);

        public void Swap(TilePosition p1, TilePosition p2) =>
            (Grid[p1.Row, p1.Col], Grid[p2.Row, p2.Col]) = (Grid[p2.Row, p2.Col], Grid[p1.Row, p1.Col]);
    }
}
