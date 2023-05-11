import { useContext, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { v4 as uuid } from "uuid"
import Task from "../models/Task"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { ScreenSize } from "../hooks/ScreenSize"
import { ScreenSizeContext } from "../context/ScreenSizeContext"

const taskColumnsFromBackend = {
	[uuid()]: {
		name: "Todo",
		tasks: [
			{
				id: uuid(),
				title: "Task 1",
				description: "This is a description",
				tags: ["tag1", "tag2"],
			},
			{
				id: uuid(),
				title: "Task 2",
				description: "This is another description",
				tags: ["tag1"],
			},
		],
	},
	[uuid()]: {
		name: "Todo 2",
		tasks: [
			{
				id: uuid(),
				title: "Task 3",
				description: "This is a description",
				tags: ["tag1", "tag2"],
			},
			{
				id: uuid(),
				title: "Task 4",
				description: "This is another description",
				tags: ["tag1"],
			},
		],
	},
}

const BoardView = () => {
	const screenSize = useContext(ScreenSizeContext)

	const [taskColumns, setTaskColumns] = useState(taskColumnsFromBackend)

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

			setTaskColumns({
				...taskColumns,
				[source.droppableId]: {
					...sourceColumn,
					tasks: sourceTasks,
				},
				[destination.droppableId]: {
					...destColumn,
					tasks: destTasks,
				},
			})
		} else {
			// Dropping into the same column

			const column = taskColumns[source.droppableId]
			const copiedTasks = [...column.tasks]

			const [removed] = copiedTasks.splice(source.index, 1)
			copiedTasks.splice(destination.index, 0, removed)

			setTaskColumns({
				...taskColumns,
				[source.droppableId]: {
					...column,
					tasks: copiedTasks,
				},
			})
		}
	}

	return (
		<Container fluid className="d-flex flex-column bg-dark text-white py-2" style={{ height: "calc(100% - 57px)" }}>
			<Row className="mt-2">
				<Col className="d-flex align-items-center justify-content-start">
					<h2>Board Name</h2>
				</Col>
				<Col className="d-flex align-items-center justify-content-end">
					<button className="icon-btn text-white bi bi-search" />
					<button className="icon-btn text-white bi bi-pencil-fill fs-6" />
					<button className="icon-btn text-white bi bi-funnel" />
				</Col>
			</Row>
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="d-flex flex-row flex-grow-1 overflow-scroll">
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
								<button
									className="text-white bi bi-three-dots-vertical p-0 ps-2"
									style={{ background: "none", border: "none" }}
								/>
							</div>

							<Droppable key={colId} droppableId={colId}>
								{(provided, snapshot) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className={`flex-grow-1 ${snapshot.isDraggingOver ? "bg-light" : ""}`}
										style={{
											background: snapshot.isDraggingOver ? "lightblue" : "inherit",
											height: "fit-content",
										}}>
										{col.tasks.map((task, taskIndex) => (
											<Draggable key={task.id} draggableId={task.id} index={taskIndex}>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={`task-card my-2 border border-secondary p-2 rounded ${
															snapshot.isDragging ? "bg-secondary" : "bg-dark shadow-sm"
														}`}
														style={{ ...provided.draggableProps.style }}>
														<h3>{task.title}</h3>
														<p>{task.description}</p>
														<div className="d-flex flex-wrap gap-2">
															{task.tags.map((tag) => (
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
			<div className="d-flex align-items-center justify-content-end">
				<button className="btn btn-primary">Add Column</button>
			</div>
		</Container>
	)
}

export default BoardView
