using backend.Models;

namespace backend.Persistence.Repositories;

public class MockColumnRepository : IColumnRepository
{
    private readonly MockDbContext context;

    public MockColumnRepository(MockDbContext context)
    {
        this.context = context;
    }

    public Column? GetColumnById(long id, bool includeTasks = false)
    {
        var column = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Id == id);
        return column;
    }

    public long CreateColumn(Column column)
    {
        var referencedBoard = context.Boards.FirstOrDefault(b => b.Id == column.BoardId);
        if (referencedBoard == null)
        {
            throw new Exception($"Board with id {column.BoardId} not found.");
        }

        if (column.Id == 0)
        {
            column.Id = context.nextColumnId;
        }

        referencedBoard.Columns.Add(column);
        return referencedBoard.Id;
    }

    public long UpdateColumn(Column column)
    {
        var referencedBoard = context.Boards.FirstOrDefault(b => b.Id == column.BoardId);
        if (referencedBoard == null)
        {
            throw new Exception($"Board with id {column.BoardId} not found.");
        }

        var referencedColumn = referencedBoard.Columns.FirstOrDefault(c => c.Id == column.Id);

        if (referencedColumn == null)
        {
            throw new Exception($"Column with id {column.Id} not found.");
        }

        referencedColumn.Name = column.Name;
        referencedColumn.Tasks = column.Tasks;

        return referencedColumn.BoardId;
    }

    public long DeleteColumn(long columnId)
    {
        var referencedBoard = context.Boards.FirstOrDefault(b => b.Columns.Where(c => c.Id == columnId).Count() > 0);
        if (referencedBoard == null)
        {
            throw new Exception($"Board with column id {columnId} not found.");
        }

        var columnToDelete = referencedBoard.Columns.FirstOrDefault(c => c.Id == columnId);
        if (columnToDelete == null)
        {
            throw new Exception($"Column with id {columnId} not found.");
        }

        referencedBoard.Columns.Remove(columnToDelete!);
        return referencedBoard.Id;
    }
}