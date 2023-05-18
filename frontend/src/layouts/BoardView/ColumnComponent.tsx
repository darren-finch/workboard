import { Droppable } from "react-beautiful-dnd"
import CardComponent from "./CardComponent"
import Column from "../../models/Column"
import Card from "../../models/Card"

interface ColumnComponentProps {
	col: Column
	onCardEdit: (card: Card) => void
	onCardDelete: (card: Card) => void
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({ col, onCardEdit, onCardDelete }) => {
	const colId = col.id.toString()

	return (
		<Droppable key={colId} droppableId={colId}>
			{(provided, snapshot) => (
				<div
					{...provided.droppableProps}
					ref={provided.innerRef}
					className={`flex-grow-1 ${snapshot.isDraggingOver ? "bg-secondary" : ""}`}
					style={{
						height: "fit-content",
						boxSizing: "border-box",
					}}>
					{col.cards.map((curCard, cardIndex) => (
						<CardComponent
							key={curCard.id}
							card={curCard}
							cardIndex={cardIndex}
							onCardEdit={onCardEdit}
							onCardDelete={onCardDelete}
						/>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	)
}

export default ColumnComponent
