using System;
using backend.Models;
using backend.Persistence.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class BoardHub : Hub
{
    private readonly IBoardRepository boardRepository;
    private readonly IColumnRepository columnRepository;
    private readonly ITaskRepository tasksRepository;
    private readonly ILogger logger;

    public BoardHub(IBoardRepository boardRepository, IColumnRepository columnRepository, ITaskRepository tasksRepository, ILogger<BoardHub> logger)
    {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.tasksRepository = tasksRepository;
        this.logger = logger;
    }

    public long CreateBoard(Board board)
    {
        var newBoard = boardRepository.CreateBoard(board);
        Clients.All.SendAsync("BoardCreated", newBoard, boardRepository.GetAllBoardsWithoutColumns());
        return newBoard.Id;
    }

    public void UpdateBoard(Board board)
    {
        var newBoard = boardRepository.UpdateBoard(board);
        Clients.All.SendAsync("BoardUpdated", newBoard, boardRepository.GetAllBoardsWithoutColumns());
    }

    public void DeleteBoard(long boardId)
    {
        var idOfDeletedBoard = boardRepository.DeleteBoard(boardId);
        Clients.All.SendAsync("BoardDeleted", idOfDeletedBoard, boardRepository.GetAllBoardsWithoutColumns());
    }

    public void CreateColumn(Column column)
    {
        var idOfModifiedBoard = columnRepository.CreateColumn(column);
        Clients.All.SendAsync("ColumnCreated", idOfModifiedBoard);
    }

    public void UpdateColumn(Column column)
    {
        var idOfModifiedBoard = columnRepository.UpdateColumn(column);
        Clients.All.SendAsync("ColumnUpdated", idOfModifiedBoard);
    }

    public void DeleteColumn(long columnId)
    {
        var idOfModifiedBoard = columnRepository.DeleteColumn(columnId);
        Clients.All.SendAsync("ColumnDeleted", idOfModifiedBoard);
    }

    public void CreateTask(Models.Task task)
    {
        var idOfModifiedBoard = tasksRepository.CreateTask(task);
        Clients.All.SendAsync("TaskCreated", idOfModifiedBoard);
    }

    public void UpdateTask(Models.Task task)
    {
        var idOfModifiedBoard = tasksRepository.UpdateTask(task);
        Clients.All.SendAsync("TaskUpdated", idOfModifiedBoard);
    }

    public void DeleteTask(long taskId)
    {
        var idOfModifiedBoard = tasksRepository.DeleteTask(taskId);
        Clients.All.SendAsync("TaskDeleted", idOfModifiedBoard);
    }
}