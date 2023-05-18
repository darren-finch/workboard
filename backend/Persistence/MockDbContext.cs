using backend.Models;

namespace backend.Persistence;

public class MockDbContext
{
    public List<Board> Boards { get; } = new List<Board>();

    // FOR TESTING ONLY
    private long lastBoardId = 1;
    public long nextBoardId
    {
        get => lastBoardId++;
    }

    private long lastColumnId = 1;
    public long nextColumnId
    {
        get => lastColumnId++;
    }

    private long lastCardId = 1;
    public long nextCardId
    {
        get => lastCardId++;
    }
}
