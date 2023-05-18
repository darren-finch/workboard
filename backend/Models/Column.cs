namespace backend.Models;

public class Column
{
    public long Id { get; set; }
    public string Name { get; set; }
    public IList<Models.Card> Cards { get; set; } = new List<Models.Card>();
    public long BoardId { get; set; }
}