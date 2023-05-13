import { useContext, useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { Col, Container, Row } from "react-bootstrap"
import { v4 as uuid } from "uuid"
import { ScreenSizeContext } from "../context/ScreenSizeContext"
import { ScreenSize } from "../hooks/ScreenSize"
import ContextButton from "../components/ContextButton"
import NiceModal from "@ebay/nice-modal-react"
import EditTaskModal from "./modals/EditTaskModal"
import { boardRepository, columnRepository, taskRepository } from "../persistence"
import Board from "../models/Board"
import Column from "../models/Column"
import Task from "../models/Task"

const boardId = uuid()
const col1Id = uuid()
const col2Id = uuid()
const task1Id = uuid()
const task2Id = uuid()
const task3Id = uuid()
const task4Id = uuid()

const testBoard = new Board(boardId, "Test Board", [
	new Column(
		col1Id,
		"Todo",
		[
			new Task(task1Id, "Task 1", "This is a description", ["tag1", "tag2"], col1Id),
			new Task(task2Id, "Task 2", "This is another description", ["tag1"], col1Id),
		],
		boardId
	),
	new Column(
		col2Id,
		"Todo 2",
		[
			new Task(task3Id, "Task 3", "This is a description", ["tag1", "tag2"], col2Id),
			new Task(task4Id, "Task 4", "This is another description", ["tag1"], col2Id),
		],
		boardId
	),
])

boardRepository.createBoard(testBoard)

const BoardView = () => {
	const screenSize = useContext(ScreenSizeContext)

	const [taskColumns, setTaskColumns] = useState({
		[col1Id]: testBoard.columns[0],
		[col2Id]: testBoard.columns[1],
	})

	useEffect(() => {
		return boardRepository.onBoardUpdated((board) => {
			setTaskColumns(
				board.columns.reduce((acc: any, column) => {
					acc[column.id] = column
					return acc
				}, {})
			)
		})
	}, [])

	const handleDragEnd = (result: any) => {
		// Dropping into a different column

		const { source, destination } = result
		if (!destination) return

		if (source.droppableId !== destination.droppableId) {
			const sourceColumn = taskColumns[source.droppableId]
			const destColumn = taskColumns[destination.droppableId]

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

			const column = taskColumns[source.droppableId]
			const copiedTasks = [...column.tasks]

			const [removed] = copiedTasks.splice(source.index, 1)
			copiedTasks.splice(destination.index, 0, removed)

			column.tasks = copiedTasks

			columnRepository.updateColumn(column, true)
		}
	}

	return (
		<Container fluid className="d-flex flex-column bg-dark text-white py-2" style={{ height: "100%" }}>
			<Row className="mt-2">
				<Col className="d-flex align-items-center justify-content-start">
					<h2>Board Name</h2>
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
					{Object.entries(taskColumns).map(([colId, col], colIndex) => (
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
											NiceModal.show("edit-column-modal", { column: col, boardId: boardId })
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
										className={`flex-grow-1 ${snapshot.isDraggingOver ? "bg-secondary" : ""}`}
										style={{
											height: "fit-content",
											boxSizing: "border-box",
										}}>
										{col.tasks.map((curTask, taskIndex) => (
											<Draggable key={curTask.id} draggableId={curTask.id} index={taskIndex}>
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
																	onClick={() => taskRepository.deleteTask(curTask)}
																/>
																<ContextButton
																	options={[{ key: "misc", label: "Misc" }]}
																	onSelect={(optionKey) => console.log(optionKey)}
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
		</Container>
	)
}

export default BoardView
