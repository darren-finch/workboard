using System;
using backend.Models;

namespace backend.Persistence.Repositories;

// This interface is used to define the contract for accessing Board entities.
// Any data related errors that occur in this class will be thrown as an exception
// and should be handled by the caller.
public interface IBoardRepository
{
    ICollection<Board> GetAllBoardsWithoutColumns();
    Board? GetBoardById(long id, bool includeColumns = false);
    Board CreateBoard(Board board);
    Board UpdateBoard(Board board);
    long DeleteBoard(long boardId);
}