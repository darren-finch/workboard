using backend.Models;

namespace backend.Persistence.Repositories;

public class MockColumnRepository : IColumnRepository
{
    private readonly MockDbContext context;

    public MockColumnRepository(MockDbContext context)
    {
        this.context = context;
    }

    public ICollection<Column> GetAllColumns(bool includeTasks = false)
    {
        return context.Boards.Select(b => b.Columns).SelectMany(c => c).Select(c => new Column
        {
            Id = c.Id,
            Name = c.Name,
            Tasks = includeTasks ? c.Tasks : new List<Models.Task>(),
            BoardId = c.BoardId
        }).ToList();
    }

    public Column? GetColumnById(long id, bool includeTasks = false)
    {
        var column = GetAllColumns().FirstOrDefault(c => c.Id == id);
        if (column == null)
        {
            return null;
        }
        return new Column
        {
            Id = column.Id,
            Name = column.Name,
            Tasks = includeTasks ? column.Tasks : new List<Models.Task>(),
            BoardId = column.BoardId
        };
    }

    public Column CreateColumn(Column column)
    {
        var boardToUpdate = context.Boards.FirstOrDefault(b => b.Id == column.BoardId);
        if (boardToUpdate == null)
        {
            throw new Exception($"Board with id {column.BoardId} not found.");
        }

        if (column.Id == 0)
        {
            var allColumns = GetAllColumns();
            column.Id = allColumns.Count > 0 ? allColumns.Max(c => c.Id) + 1 : 1;
        }

        boardToUpdate.Columns.Add(column);
        return column;
    }

    public Column UpdateColumn(Column column)
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

        return referencedColumn;
    }

    public long DeleteColumn(long columnId)
    {
        var boardToUpdate = context.Boards.FirstOrDefault(b => b.Columns.Where(c => c.Id == columnId).Count() > 0);
        if (boardToUpdate == null)
        {
            throw new Exception($"Board with column id {columnId} not found.");
        }

        var columnToDelete = boardToUpdate.Columns.FirstOrDefault(c => c.Id == columnId);
        if (columnToDelete == null)
        {
            throw new Exception($"Column with id {columnId} not found.");
        }

        boardToUpdate.Columns.Remove(columnToDelete!);
        return boardToUpdate.Id;
    }
}