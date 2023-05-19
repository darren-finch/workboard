import NiceModal from "@ebay/nice-modal-react"
import { useEffect, useState } from "react"
import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import { boardRepository, cardRepository, columnRepository } from "../../App"
import FullScreenErrorDisplay from "../../components/misc/FullScreenErrorDisplay"
import Board from "../../models/Board"
import Card from "../../models/Card"
import Column from "../../models/Column"
import ColumnsWrap from "./ColumnsWrap"

export interface DragAndDropCardColumns {
	[key: string]: Column
}

const BoardView = () => {
	const navigate = useNavigate()

	const { boardId } = useParams()
	const [board, setBoard] = useState<Board>(new Board(0, "", []))
	const [error, setError] = useState<string>("")

	const [dragAndDropCardColumns, setDragAndDropCardColumns] = useState<DragAndDropCardColumns>({})

	useEffect(() => {
		if (!boardId) {
			setError("No board ID provided")
			return
		}

		const boardIdAsNumber = parseInt(boardId)
		if (isNaN(boardIdAsNumber)) {
			setError("Invalid board ID provided")
			return
		}

		try {
			const handleBoardUpdated = (board: Board) => {
				setBoard(board)

				setDragAndDropCardColumns(
					board.columns.reduce((acc, column) => {
						acc[column.id.toString()] = column
						return acc
					}, {} as DragAndDropCardColumns)
				)
			}

			boardRepository
				.getBoard(boardIdAsNumber, true)
				.then((res) => handleBoardUpdated(res.value))
				.catch((err) => setError(err.message))

			return boardRepository.addBoardEventListener({
				boardId: boardIdAsNumber,
				onBoardUpdated: handleBoardUpdated,
				onBoardDeleted: () => {
					setError("Board not found")
				},
			})
		} catch (err: any) {
			setError(err.message)
		}
	}, [boardId])

	const handleDragEnd = (result: any) => {
		const { source, destination } = result
		if (!destination) return

		if (source.droppableId !== destination.droppableId) {
			// Dropping into a different column
			const sourceColumn = dragAndDropCardColumns[source.droppableId]
			const destColumn = dragAndDropCardColumns[destination.droppableId]

			const sourceCards = [...sourceColumn.cards]
			const destCards = [...destColumn.cards]

			const [removed] = sourceCards.splice(source.index, 1)
			removed.columnId = destColumn.id
			destCards.splice(destination.index, 0, removed)

			sourceColumn.cards = sourceCards
			destColumn.cards = destCards

			columnRepository.updateColumn(sourceColumn, true)
			columnRepository.updateColumn(destColumn, true)
		} else {
			// Dropping into the same column
			const column = dragAndDropCardColumns[source.droppableId]
			const copiedCards = [...column.cards]

			const [removed] = copiedCards.splice(source.index, 1)
			copiedCards.splice(destination.index, 0, removed)

			column.cards = copiedCards

			columnRepository.updateColumn(column, true)
		}
	}

	const handleColumnEdit = (column: Column) => {
		NiceModal.show("edit-column-modal", {
			column: column,
			boardId: parseInt(boardId),
		})
	}

	const handleColumnDelete = (column: Column) => {
		// TODO: Show confirmation modal
		columnRepository.deleteColumn(column)
	}

	const handleCardAdd = (column: Column) => {
		NiceModal.show("edit-card-modal", { columnId: column.id })
	}

	const handleCardEdit = (card: Card) => {
		NiceModal.show("edit-card-modal", {
			card: card,
			columnId: card.columnId,
		})
	}

	const handleCardDelete = (card: Card) => {
		cardRepository.deleteCard(card.id)
	}

	return (
		<Container fluid className="d-flex flex-column bg-dark text-white py-2" style={{ height: "calc(100% - 57px)" }}>
			{error && (
				<FullScreenErrorDisplay error={error}>
					<div className="d-flex">
						<Button variant="primary" onClick={() => navigate("/")}>
							Go to Dashboard
						</Button>
						<Button className="ms-2" variant="secondary" onClick={() => navigate(0)}>
							Reload
						</Button>
					</div>
				</FullScreenErrorDisplay>
			)}
			{!error && (
				<>
					<Row className="mt-2">
						<Col className="d-flex align-items-center justify-content-start">
							<h2>{board.name}</h2>
							<button
								className="icon-btn text-white bi bi-pencil-fill fs-6"
								onClick={() => navigate(`/boards/${boardId}/edit`)}
							/>
							<button
								className="icon-btn text-white bi bi-trash-fill fs-6"
								onClick={() =>
									NiceModal.show("confirmation-modal", {
										body: "Are you sure you want to delete this board?",
									}).then((result) => {
										if (boardId) boardRepository.deleteBoard(boardId)
										navigate("/")
									})
								}
							/>
						</Col>
						<Col className="d-flex align-items-center justify-content-end">
							<Button
								variant="primary"
								className="me-2"
								onClick={() => NiceModal.show("edit-column-modal", { boardId: parseInt(boardId) })}>
								Add Column
							</Button>
						</Col>
					</Row>
					<ColumnsWrap
						columns={dragAndDropCardColumns}
						onDragEnd={handleDragEnd}
						onColumnEdit={handleColumnEdit}
						onColumnDelete={handleColumnDelete}
						onCardAdd={handleCardAdd}
						onCardEdit={handleCardEdit}
						onCardDelete={handleCardDelete}
					/>
				</>
			)}
		</Container>
	)
}

export default BoardView
