namespace backend.Persistence.Repositories;

public interface ITaskRepository
{
    Models.Task? GetTaskById(long id);
    // These methods return the id of the board that was modified.
    long CreateTask(Models.Task task);
    long UpdateTask(Models.Task task);
    long DeleteTask(long id);
}