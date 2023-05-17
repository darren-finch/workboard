using System;
using backend.Models;

namespace backend.Persistence.Repositories;

public interface IColumnRepository
{
    Column? GetColumnById(long id, bool includeTasks = false);
    // These methods return the id of the board that was modified.
    long CreateColumn(Column column);
    long UpdateColumn(Column column);
    long DeleteColumn(long columnId);
}