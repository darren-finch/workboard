import { Droppable } from "react-beautiful-dnd"
import CardComponent from "./CardComponent"
import Column from "../../models/Column"
import Card from "../../models/Card"
import { useContext } from "react"
import { ScreenSizeContext } from "../../context/ScreenSizeContext"
import { ScreenBreakpoint } from "../../util/ScreenBreakpoint"

interface ColumnComponentProps {
	col: Column
	colIndex: number
	onCardAdd: (column: Column) => void
	onCardEdit: (card: Card) => void
	onCardDelete: (card: Card) => void
	onColumnEdit: (column: Column) => void
	onColumnDelete: (column: Column) => void
}

const ColumnComponent: React.FC<ColumnComponentProps> = ({
	col,
	colIndex,
	onCardAdd,
	onCardEdit,
	onCardDelete,
	onColumnEdit,
	onColumnDelete,
}) => {
	const colId = col.id.toString()
	const screenSize = useContext(ScreenSizeContext)

	return (
		<div
			key={colId}
			className={`d-flex flex-column flex-grow-1
					${colIndex == 0 ? "border-start" : ""}
					border-end border-secondary p-2`}
			style={{
				minWidth: screenSize <= ScreenBreakpoint.XS ? "100%" : "250px",
				minHeight: "200px",
				maxWidth: screenSize <= ScreenBreakpoint.XS ? undefined : "500px",
				height: "fit-content",
			}}>
			<div className="w-100 d-flex align-items-center justify-content-between">
				<h3>{col.name}</h3>
				<div className="d-flex align-items-center">
					<button className="icon-btn text-white bi bi-pencil-fill fs-6" onClick={() => onColumnEdit(col)} />
					<button className="icon-btn text-white bi bi-trash-fill fs-6" onClick={() => onColumnDelete(col)} />
					<button className="btn btn-primary" onClick={() => onCardAdd(col)}>
						<i className="bi bi-plus-lg" />
					</button>
				</div>
			</div>

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
		</div>
	)
}

export default ColumnComponent
