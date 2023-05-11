import { useState } from "react"
import Task from "../../models/Task"

interface TaskCardProps {
	task: Task
	onDragStart?: (task: Task) => void
	onDragEnd?: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDragStart, onDragEnd }) => {
	const [isDragging, setDragging] = useState(false)

	const handleDragStart = () => {
		setDragging(true)

		setTimeout(() => {
			if (onDragStart) onDragStart(task)
		}, 0)
	}

	const handleDragEnd = () => {
		setDragging(false)

		if (onDragEnd) onDragEnd(task)
	}

	return (
		<div
			id={isDragging ? "dragging" : undefined}
			className={`task-card my-2 border border-secondary p-2 rounded ${isDragging ? "bg-secondary" : ""}`}
			style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
			draggable
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}>
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
	)
}

export default TaskCard
