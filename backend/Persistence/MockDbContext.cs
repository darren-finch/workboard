using backend.Models;

namespace backend.Persistence;

public class MockDbContext
{
    public List<Board> Boards { get; } = new List<Board>();
}
