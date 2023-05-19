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
	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className="d-flex flex-row flex-grow-1 overflow-scroll hide-scrollbar-container">
				{Object.entries(columns).map(([colId, col], colIndex) => (
					<ColumnComponent
						col={col}
						colIndex={colIndex}
						onCardAdd={onCardAdd}
						onCardEdit={onCardEdit}
						onCardDelete={onCardDelete}
						onColumnEdit={onColumnEdit}
						onColumnDelete={onColumnDelete}
					/>
				))}
			</div>
		</DragDropContext>
	)
}

export default ColumnsWrap
