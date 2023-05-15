using System;
using backend.Models;
using backend.Persistence.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class BoardHub : Hub
{
    private readonly IBoardRepository boardRepository;

    public BoardHub(IBoardRepository boardRepository)
    {
        this.boardRepository = boardRepository;
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
}