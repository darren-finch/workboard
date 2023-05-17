using System;

namespace backend.Models;

public class Board
{
    public long Id { get; set; }
    public string Name { get; set; }
    public IList<Column> Columns { get; set; }
}

