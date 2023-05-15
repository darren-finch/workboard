using backend.Models;

namespace backend.Persistence.Repositories;

public class BoardRepository : IBoardRepository
{
    private readonly MockDbContext context;

    public BoardRepository(MockDbContext context)
    {
        this.context = context;
    }

    public ICollection<Board> GetAllBoardsWithoutColumns()
    {
        return context.Boards.Select(b => new Board
        {
            Id = b.Id,
            Name = b.Name
        }).ToList();
    }

    public Board? GetBoardById(long id, bool includeColumns = false)
    {
        var originalBoard = context.Boards.FirstOrDefault(b => b.Id == id, null);
        return originalBoard;
        // if (originalBoard == null)
        // {
        //     return null;
        // }
        // return new Board
        // {
        //     Id = originalBoard.Id,
        //     Name = originalBoard.Name,
        //     Columns = includeColumns ? originalBoard.Columns : new List<Column>()
        // };
    }

    public Board CreateBoard(Board board)
    {
        if (board.Id == 0)
        {
            var maxId = context.Boards.Count > 0 ? context.Boards.Max(b => b.Id) : 0;
            board.Id = maxId + 1;
        }

        context.Boards.Add(board);
        return board;
    }

    public Board UpdateBoard(Board board)
    {
        foreach (var b in context.Boards)
        {
            if (b.Id == board.Id)
            {
                b.Name = board.Name;
                break;
            }
        }

        return board;
    }

    public long DeleteBoard(long boardId)
    {
        var boardToDelete = context.Boards.FirstOrDefault(b => b.Id == boardId, null);
        if (boardToDelete != null)
        {
            context.Boards.Remove(boardToDelete);
            return boardToDelete.Id;
        }
        else
        {
            throw new Exception($"Board with id {boardId} not found");
        }
    }
}