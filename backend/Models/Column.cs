namespace backend.Models;

public class Column
{
    public long Id { get; set; }
    public string Name { get; set; }
    public IList<Models.Task> Tasks { get; set; } = new List<Models.Task>();
    public long BoardId { get; set; }
}