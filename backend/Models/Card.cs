namespace backend.Models;

public class Card
{
    public long Id { get; set; }
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public IList<string> Tags { get; set; } = new List<string>();
    public long ColumnId { get; set; }
}