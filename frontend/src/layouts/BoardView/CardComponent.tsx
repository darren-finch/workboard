import { Draggable } from "react-beautiful-dnd"
import Card from "../../models/Card"

interface CardComponentProps {
	card: Card
	cardIndex: number
	onCardEdit: (card: Card) => void
	onCardDelete: (card: Card) => void
}

const CardComponent: React.FC<CardComponentProps> = ({ card, cardIndex, onCardEdit, onCardDelete }) => {
	return (
		<Draggable key={card.id} draggableId={card.id.toString()} index={cardIndex}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					className={`card-card my-2 border p-2 bg-dark rounded ${
						snapshot.isDragging ? "border-primary" : "border-secondary shadow-sm"
					}`}
					style={{ ...provided.draggableProps.style }}>
					<div className="d-flex align-items-top justify-content-between">
						<h3>{card.name}</h3>
						<div className="d-flex align-items-center">
							<button
								className="icon-btn text-white bi bi-pencil-fill fs-6"
								onClick={() => onCardEdit(card)}
							/>
							<button
								className="icon-btn text-white bi bi-trash-fill"
								onClick={() => onCardDelete(card)}
							/>
						</div>
					</div>
					<p>{card.description}</p>
					<div className="d-flex flex-wrap gap-2">
						{card.tags.map((tag) => (
							<span key={tag} className="badge bg-secondary">
								{tag}
							</span>
						))}
					</div>
				</div>
			)}
		</Draggable>
	)
}

export default CardComponent
