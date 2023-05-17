using System;
using backend.Models;
using backend.Persistence.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class BoardHub : Hub
{
    private readonly IBoardRepository boardRepository;
    private readonly IColumnRepository columnRepository;
    private readonly ILogger logger;

    public BoardHub(IBoardRepository boardRepository, IColumnRepository columnRepository, ILogger<BoardHub> logger)
    {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.logger = logger;
    }

    public long CreateBoard(Board board)
    {
        var newBoard = boardRepository.CreateBoard(board);
        Clients.All.SendAsync("BoardCreated", newBoard, boardRepository.GetAllBoardsWithoutColumns());
        return newBoard.Id;
    }

    public long UpdateBoard(Board board)
    {
        var newBoard = boardRepository.UpdateBoard(board);
        Clients.All.SendAsync("BoardUpdated", newBoard, boardRepository.GetAllBoardsWithoutColumns());
        return newBoard.Id;
    }

    public void DeleteBoard(long boardId)
    {
        var idOfDeletedBoard = boardRepository.DeleteBoard(boardId);
        Clients.All.SendAsync("BoardDeleted", idOfDeletedBoard, boardRepository.GetAllBoardsWithoutColumns());
    }

    public long CreateColumn(Column column)
    {
        var newColumn = columnRepository.CreateColumn(column);
        Clients.All.SendAsync("ColumnCreated", newColumn);
        return newColumn.Id;
    }

    public long UpdateColumn(Column column)
    {
        var newColumn = columnRepository.UpdateColumn(column);
        Clients.All.SendAsync("ColumnUpdated", newColumn);
        return newColumn.Id;
    }

    public void DeleteColumn(long columnId)
    {
        var idOfUpdatedBoard = columnRepository.DeleteColumn(columnId);
        Clients.All.SendAsync("ColumnDeleted", idOfUpdatedBoard);
    }
}