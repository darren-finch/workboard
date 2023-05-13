import NiceModal from "@ebay/nice-modal-react"
import { useContext, useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Col, Container, Row } from "react-bootstrap"
import ContextButton from "../../components/ContextButton"
import { ScreenSizeContext } from "../../context/ScreenSizeContext"
import { ScreenSize } from "../../hooks/ScreenSize"
import { boardRepository, columnRepository, taskRepository } from "../../persistence"
import Column from "../../models/Column"
import { useParams } from "react-router-dom"
import Board from "../../models/Board"

interface DragAndDropTaskColumns {
	[key: string]: Column
}

const BoardView = () => {
	const screenSize = useContext(ScreenSizeContext)

	const { boardId } = useParams()
	const [board, setBoard] = useState<Board>(new Board("", "", []))
	const [error, setError] = useState<string>("")

	const [dragAndDropTaskColumns, setDragAndDropTaskColumns] = useState<DragAndDropTaskColumns>({})

	useEffect(() => {
		if (!boardId) {
			setError("No board ID provided")
			return
		}

		try {
			return boardRepository.onBoardUpdated(boardId, (board) => {
				if (!board) {
					setError("There was an error loading the board")
					return
				}

				setBoard(board)

				setDragAndDropTaskColumns(
					board.columns.reduce((acc, column) => {
						acc[column.id] = column
						return acc
					}, {} as DragAndDropTaskColumns)
				)
			})
		} catch (err: any) {
			setError(err.message)
		}
	}, [])

	const handleDragEnd = (result: any) => {
		// Dropping into a different column

		const { source, destination } = result
		if (!destination) return

		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = dragAndDropTaskColumns[source.droppableId]
			const destColumn = dragAndDropTaskColumns[destination.droppableId]

			const sourceTasks = [...sourceColumn.tasks]
			const destTasks = [...destColumn.tasks]

			const [removed] = sourceTasks.splice(source.index, 1)
			destTasks.splice(destination.index, 0, removed)

			sourceColumn.tasks = sourceTasks
			destColumn.tasks = destTasks

			columnRepository.updateColumn(sourceColumn, true)
			columnRepository.updateColumn(destColumn, true)
		} else {
			// Dropping into the same column

			const column = dragAndDropTaskColumns[source.droppableId]
			const copiedTasks = [...column.tasks]

			const [removed] = copiedTasks.splice(source.index, 1)
			copiedTasks.splice(destination.index, 0, removed)

			column.tasks = copiedTasks

			columnRepository.updateColumn(column, true)
		}
	}

	return (
		<Container fluid className="d-flex flex-column bg-dark text-white py-2" style={{ height: "100%" }}>
			{error && <p className="h4 text-danger">{error}</p>}
			{!error && (
				<>
					<Row className="mt-2">
						<Col className="d-flex align-items-center justify-content-start">
							<h2>{board.name}</h2>
						</Col>
						<Col className="d-flex align-items-center justify-content-end">
							<button className="icon-btn text-white bi bi-search" />
							<button className="icon-btn text-white bi bi-pencil-fill fs-6" />
							<button className="icon-btn text-white bi bi-funnel" />
							<button
								className="icon-btn text-white bi bi-plus-lg"
								onClick={() => NiceModal.show("edit-column-modal", { boardId: boardId })}
							/>
							<ContextButton
								onSelect={(optionKey) => {
									console.log(optionKey)
								}}
								options={[
									{ key: "option1", label: "option1" },
									{ key: "option2", label: "option2" },
									{ key: "option3", label: "option3" },
								]}
							/>
						</Col>
					</Row>
					<DragDropContext onDragEnd={handleDragEnd}>
						<div className="d-flex flex-row flex-grow-1 overflow-scroll task-columns-container">
							{Object.entries(dragAndDropTaskColumns).map(([colId, col], colIndex) => (
								<div
									key={colId}
									className={`d-flex flex-column flex-grow-1
					${colIndex == 0 ? "border-start" : ""}
					border-end border-secondary p-2`}
									style={{
										minWidth: screenSize == ScreenSize.XS ? "100%" : "250px",
										minHeight: "200px",
										maxWidth: screenSize == ScreenSize.XS ? undefined : "500px",
									}}>
									<div className="w-100 d-flex align-items-center justify-content-between">
										<h3>{col.name}</h3>
										<div className="d-flex align-items-center">
											<button
												className="icon-btn text-white bi bi-pencil-fill fs-6"
												onClick={() =>
													NiceModal.show("edit-column-modal", {
														column: col,
														boardId: boardId,
													})
												}
											/>
											<button
												className="icon-btn text-white bi bi-trash-fill fs-6"
												onClick={() => columnRepository.deleteColumn(col)}
											/>
											<button
												className="btn btn-primary"
												onClick={() => {
													NiceModal.show("edit-task-modal", { columnId: colId })
												}}>
												<i className="bi bi-plus-lg" />
											</button>
										</div>
									</div>

									<Droppable key={colId} droppableId={colId}>
										{(provided, snapshot) => (
											<div
												{...provided.droppableProps}
												ref={provided.innerRef}
												className={`flex-grow-1 ${
													snapshot.isDraggingOver ? "bg-secondary" : ""
												}`}
												style={{
													height: "fit-content",
													boxSizing: "border-box",
												}}>
												{col.tasks.map((curTask, taskIndex) => (
													<Draggable
														key={curTask.id}
														draggableId={curTask.id}
														index={taskIndex}>
														{(provided, snapshot) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																className={`task-card my-2 border p-2 bg-dark rounded ${
																	snapshot.isDragging
																		? "border-primary"
																		: "border-secondary shadow-sm"
																}`}
																style={{ ...provided.draggableProps.style }}>
																<div className="d-flex align-items-top justify-content-between">
																	<h3>{curTask.name}</h3>
																	<div className="d-flex align-items-center">
																		<button
																			className="icon-btn text-white bi bi-pencil-fill fs-6"
																			onClick={() => {
																				NiceModal.show("edit-task-modal", {
																					task: curTask,
																					columnId: colId,
																				})
																			}}
																		/>
																		<button
																			className="icon-btn text-white bi bi-trash-fill"
																			onClick={() =>
																				taskRepository.deleteTask(curTask)
																			}
																		/>
																		<ContextButton
																			options={[{ key: "misc", label: "Misc" }]}
																			onSelect={(optionKey) =>
																				console.log(optionKey)
																			}
																		/>
																	</div>
																</div>
																<p>{curTask.description}</p>
																<div className="d-flex flex-wrap gap-2">
																	{curTask.tags.map((tag) => (
																		<span key={tag} className="badge bg-secondary">
																			{tag}
																		</span>
																	))}
																</div>
															</div>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</div>
							))}
						</div>
					</DragDropContext>
				</>
			)}
		</Container>
	)
}

export default BoardView