import { useContext } from "react"
import { DragDropContext, DropResult } from "react-beautiful-dnd"
import { ScreenSizeContext } from "../../context/ScreenSizeContext"
import Card from "../../models/Card"
import Column from "../../models/Column"
import { ScreenBreakpoint } from "../../util/ScreenBreakpoint"
import { DragAndDropCardColumns } from "./BoardView"
import ColumnComponent from "./ColumnComponent"

interface ColumnsWrapProps {
	columns: DragAndDropCardColumns
	onDragEnd: (result: DropResult) => void
	onColumnEdit: (column: Column) => void
	onColumnDelete: (column: Column) => void
	onCardAdd: (column: Column) => void
	onCardEdit: (card: Card) => void
	onCardDelete: (card: Card) => void
}

const ColumnsWrap: React.FC<ColumnsWrapProps> = ({
	columns,
	onDragEnd,
	onColumnEdit,
	onColumnDelete,
	onCardAdd,
	onCardEdit,
	onCardDelete,
}) => {
	const screenSize = useContext(ScreenSizeContext)

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="d-flex flex-row flex-grow-1 overflow-scroll hide-scrollbar-container">
				{Object.entries(columns).map(([colId, col], colIndex) => (
					<div
						key={colId}
						className={`d-flex flex-column flex-grow-1
					${colIndex == 0 ? "border-start" : ""}
					border-end border-secondary p-2`}
						style={{
							minWidth: screenSize <= ScreenBreakpoint.XS ? "100%" : "250px",
							minHeight: "200px",
							maxWidth: screenSize <= ScreenBreakpoint.XS ? undefined : "500px",
						}}>
						<div className="w-100 d-flex align-items-center justify-content-between">
							<h3>{col.name}</h3>
							<div className="d-flex align-items-center">
								<button
									className="icon-btn text-white bi bi-pencil-fill fs-6"
									onClick={() => onColumnEdit(col)}
								/>
								<button
									className="icon-btn text-white bi bi-trash-fill fs-6"
									onClick={() => onColumnDelete(col)}
								/>
								<button className="btn btn-primary" onClick={() => onCardAdd(col)}>
									<i className="bi bi-plus-lg" />
								</button>
							</div>
						</div>

						<ColumnComponent col={col} onCardEdit={onCardEdit} onCardDelete={onCardDelete} />
					</div>
				))}
			</div>
		</DragDropContext>
	)
}

export default ColumnsWrap
