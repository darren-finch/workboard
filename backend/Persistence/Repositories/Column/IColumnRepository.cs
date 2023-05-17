using System;
using backend.Models;

namespace backend.Persistence.Repositories;

public interface IColumnRepository
{
    ICollection<Column> GetAllColumns(bool includeTasks = false);
    Column? GetColumnById(long id, bool includeTasks = false);
    Column CreateColumn(Column column);
    Column UpdateColumn(Column column);
    // Returns the BoardId of the column that was deleted.
    long DeleteColumn(long columnId);
}