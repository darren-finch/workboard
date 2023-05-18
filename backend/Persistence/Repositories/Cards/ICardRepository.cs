namespace backend.Persistence.Repositories;

public interface ICardRepository
{
    Models.Card? GetCardById(long id);
    // These methods return the id of the board that was modified.
    long CreateCard(Models.Card card);
    long UpdateCard(Models.Card card);
    long DeleteCard(long id);
}