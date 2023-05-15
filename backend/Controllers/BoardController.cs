using backend.Persistence.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("/boards")]
public class BoardController : ControllerBase
{
    private readonly IBoardRepository boardRepository;

    public BoardController(IBoardRepository boardRepository)
    {
        this.boardRepository = boardRepository;
    }

    [HttpGet]
    public IActionResult GetAllBoardsWithoutTheirColumns()
    {
        return Ok(boardRepository.GetAllBoardsWithoutColumns());
    }

    [HttpGet("{id}")]
    public IActionResult GetBoardById(long id, [FromQuery] bool includeColumns = false)
    {
        var board = boardRepository.GetBoardById(id, includeColumns);
        if (board == null)
        {
            return NotFound();
        }
        return Ok(board);
    }
}