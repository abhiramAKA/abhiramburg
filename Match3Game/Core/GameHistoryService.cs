using System.Collections.Generic;

namespace Match3Game.Core
{
    public static class GameHistoryService
    {
        private static readonly List<int> _history = new List<int>();
        
        public static string WalletAddress { get; set; } = "";
        public static string UserName { get; set; } = "Гость";
        public static bool IsRegistered { get; set; } = false;

        public static void AddRecord(int score)
        {
            _history.Add(score);
        }

        public static List<int> GetHistory()
        {
            return _history;
        }

        public static int GetTotalGames()
        {
            return _history.Count;
        }
    }
}
