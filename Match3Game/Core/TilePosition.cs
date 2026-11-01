using System;

namespace Match3Game.Core
{
    public struct TilePosition : IEquatable<TilePosition>
    {
        public int Row { get; }
        public int Col { get; }

        public TilePosition(int row, int col)
        {
            Row = row;
            Col = col;
        }

        public bool Equals(TilePosition other) => Row == other.Row && Col == other.Col;
        public override bool Equals(object? obj) => obj is TilePosition other && Equals(other);
        public override int GetHashCode() => HashCode.Combine(Row, Col);
    }
}
