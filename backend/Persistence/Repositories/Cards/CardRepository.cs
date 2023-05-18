namespace backend.Persistence.Repositories;

public class CardRepository : ICardRepository
{
    private readonly MockDbContext context;

    public CardRepository(MockDbContext context)
    {
        this.context = context;
    }

    public Models.Card? GetCardById(long id)
    {
        return context.Boards.Select(b => b.Columns).SelectMany(c => c).Select(c => c.Cards).SelectMany(t => t).FirstOrDefault(t => t.Id == id);
    }

    public long CreateCard(Models.Card card)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Id == card.ColumnId);
        if (referencedColumn == null)
        {
            throw new Exception($"Column with id {card.ColumnId} not found.");
        }

        if (card.Id == 0)
        {
            card.Id = context.nextCardId;
        }

        referencedColumn.Cards.Add(card);
        return referencedColumn.BoardId;
    }

    public long UpdateCard(Models.Card card)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Cards.Where(t => t.Id == card.Id).Count() > 0);

        if (referencedColumn == null)
        {
            throw new Exception($"Card with id {card.Id} not found.");
        }

        var referencedCard = referencedColumn.Cards.FirstOrDefault(t => t.Id == card.Id);

        if (referencedCard == null)
        {
            throw new Exception($"Card with id {card.Id} not found.");
        }

        referencedCard.Name = card.Name;
        referencedCard.Description = card.Description;
        referencedCard.Tags = card.Tags;

        return referencedColumn.BoardId;
    }

    public long DeleteCard(long id)
    {
        var referencedColumn = context.Boards.Select(b => b.Columns).SelectMany(c => c).FirstOrDefault(c => c.Cards.Where(t => t.Id == id).Count() > 0);

        if (referencedColumn == null)
        {
            throw new Exception($"Card with id {id} not found.");
        }

        var referencedCard = referencedColumn.Cards.FirstOrDefault(t => t.Id == id);

        if (referencedCard == null)
        {
            throw new Exception($"Card with id {id} not found.");
        }

        referencedColumn.Cards.Remove(referencedCard);

        return referencedColumn.BoardId;
    }
}