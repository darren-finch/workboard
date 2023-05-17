namespace backend.Persistence.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly MockDbContext context;

    public TaskRepository(MockDbContext context)
    {
        this.context = context;
    }

    public Models.Task? GetTaskById(long id)
    {
        return context.Boards.Select(b => b.Columns).SelectMany(c => c).Select(c => c.Tasks).SelectMany(t => t).FirstOrDefault(t => t.Id == id);
    }

    public long CreateTask(Models.Task task)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Id == task.ColumnId);
        if (referencedColumn == null)
        {
            throw new Exception($"Column with id {task.ColumnId} not found.");
        }

        if (task.Id == 0)
        {
            task.Id = context.nextTaskId;
        }

        referencedColumn.Tasks.Add(task);
        return referencedColumn.BoardId;
    }

    public long UpdateTask(Models.Task task)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Tasks.Where(t => t.Id == task.Id).Count() > 0);

        if (referencedColumn == null)
        {
            throw new Exception($"Task with id {task.Id} not found.");
        }

        var referencedTask = referencedColumn.Tasks.FirstOrDefault(t => t.Id == task.Id);

        if (referencedTask == null)
        {
            throw new Exception($"Task with id {task.Id} not found.");
        }

        referencedTask.Name = task.Name;
        referencedTask.Description = task.Description;
        referencedTask.Tags = task.Tags;

        return referencedColumn.BoardId;
    }

    public long DeleteTask(long id)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Tasks.Where(t => t.Id == id).Count() > 0);

        if (referencedColumn == null)
        {
            throw new Exception($"Task with id {id} not found.");
        }

        var referencedTask = referencedColumn.Tasks.FirstOrDefault(t => t.Id == id);

        if (referencedTask == null)
        {
            throw new Exception($"Task with id {id} not found.");
        }

        referencedColumn.Tasks.Remove(referencedTask);

        return referencedColumn.BoardId;
    }
}