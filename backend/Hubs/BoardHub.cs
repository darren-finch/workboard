using System;
using backend.Models;
using backend.Persistence.Repositories;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class BoardHub : Hub
{
    private readonly IBoardRepository boardRepository;
    private readonly IColumnRepository columnRepository;
    private readonly ICardRepository cardsRepository;
    private readonly ILogger logger;

    public BoardHub(IBoardRepository boardRepository, IColumnRepository columnRepository, ICardRepository cardsRepository, ILogger<BoardHub> logger)
    {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.cardsRepository = cardsRepository;
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

    public void CreateCard(Models.Card card)
    {
        var idOfModifiedBoard = cardsRepository.CreateCard(card);
        Clients.All.SendAsync("CardCreated", idOfModifiedBoard);
    }

    public void UpdateCard(Models.Card card)
    {
        var idOfModifiedBoard = cardsRepository.UpdateCard(card);
        Clients.All.SendAsync("CardUpdated", idOfModifiedBoard);
    }

    public void DeleteCard(long cardId)
    {
        var idOfModifiedBoard = cardsRepository.DeleteCard(cardId);
        Clients.All.SendAsync("CardDeleted", idOfModifiedBoard);
    }
}