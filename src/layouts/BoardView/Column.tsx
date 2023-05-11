import { useContext, useRef } from "react"
import { ScreenSizeContext } from "../../context/ScreenSizeContext"
import { ScreenSize } from "../../hooks/ScreenSize"
import Task from "../../models/Task"
import TaskCard from "./TaskCard"

interface ColumnProps {
	index: number
	tasks: Task[]
	onDragStart?: (colIndex: number, task: Task) => void
	onDragEnd?: (colIndex: number, taskIndexToInsertBefore: number | undefined) => void
}

const Column: React.FC<ColumnProps> = ({ index, tasks, onDragStart, onDragEnd }) => {
	const screenSize = useContext(ScreenSizeContext)

	const colRef = useRef<HTMLDivElement>(null)

	const handleDragStart = (task: Task) => {
		if (onDragStart) onDragStart(index, task)
	}

	const handleDragEnd = (task: Task) => {}

	return (
		<div
			ref={colRef}
			className={`d-flex flex-column
			${index == 0 ? "border-start" : ""}
			border-end border-secondary p-2`}
			style={{
				minWidth: screenSize == ScreenSize.XS ? "100%" : "250px",
				minHeight: "200px",
				maxWidth: screenSize == ScreenSize.XS ? undefined : "500px",
			}}
			onDragOver={(e) => {
				e.preventDefault()
				e.stopPropagation()

				if (colRef.current == null) return

				if (
					e.clientX < colRef.current?.getBoundingClientRect().left ||
					e.clientX > colRef.current?.getBoundingClientRect().right
				) {
					return
				}

				const taskCardsContainer = colRef.current?.querySelector(".task-cards-container")

				const taskCards = taskCardsContainer?.querySelectorAll(".task-card:not(#dragging)") ?? []
				const taskCurrentlyBeingDragged = document.getElementById("dragging") as Node

				// if (taskCards.length == 0) taskCardsContainer?.appendChild(taskCurrentlyBeingDragged)

				// for (let i = 0; i < taskCards.length; i++) {
				// 	const curTaskCard = taskCards[i]
				// 	const nextTaskCard = i < taskCards.length - 1 ? taskCards[i + 1] : undefined

				// 	if (
				// 		i == 0 &&
				// 		e.clientY <
				// 			curTaskCard.getBoundingClientRect().top + curTaskCard.getBoundingClientRect().height / 2
				// 	) {
				// 		taskCardsContainer?.insertBefore(taskCurrentlyBeingDragged, taskCards[i])
				// 		break
				// 	} else if (
				// 		i == taskCards.length - 1 &&
				// 		e.clientY >
				// 			taskCards[i].getBoundingClientRect().top + taskCards[i].getBoundingClientRect().height / 2
				// 	) {
				// 		taskCardsContainer?.appendChild(taskCurrentlyBeingDragged)
				// 		break
				// 	} else if (
				// 		i != 0 &&
				// 		i != taskCards.length - 1 &&
				// 		e.clientY >
				// 			curTaskCard.getBoundingClientRect().top + curTaskCard.getBoundingClientRect().height / 2 &&
				// 		e.clientY <
				// 			nextTaskCard!.getBoundingClientRect().top + nextTaskCard!.getBoundingClientRect().height / 2
				// 	) {
				// 		taskCardsContainer?.insertBefore(taskCurrentlyBeingDragged, taskCards[i + 1])
				// 		break
				// 	}
				// }
			}}>
			<div className="w-100 d-flex align-items-center justify-content-between">
				<h3>Column {index + 1}</h3>
				<button
					className="text-white bi bi-three-dots-vertical p-0 ps-2"
					style={{ background: "none", border: "none" }}
				/>
			</div>
			<div className="task-cards-container" style={{ overflowY: "scroll" }}>
				{tasks.map((task) => (
					<TaskCard key={task.id} task={task} onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
				))}
			</div>
		</div>
	)
}

export default Column
