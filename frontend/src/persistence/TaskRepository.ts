import { RepositoryResponse } from "."
import Task from "../models/Task"

export class TaskRepository {
	// Returns the id of the added task
	async addTask(task: Task): Promise<RepositoryResponse<string>> {
		let addedTask = false

		// boards.forEach((board) => {
		// 	board.columns.forEach((column) => {
		// 		if (column.id === task.columnId) {
		// 			if (!task.id) {
		// 				task.id = uuid()
		// 			}

		// 			column.tasks.push(task)
		// 			addedTask = true
		// 			notifyBoardUpdatedListeners(board)
		// 		}
		// 	})
		// })

		return {
			success: addedTask,
			message: addedTask ? "Task added successfully" : "Task not added",
			value: task.id,
		}
	}

	async updateTask(task: Task): Promise<RepositoryResponse<void>> {
		let updatedTask = false

		// boards.forEach((board) => {
		// 	board.columns.forEach((column) => {
		// 		column.tasks.forEach((t) => {
		// 			if (t.id === task.id) {
		// 				t.name = task.name
		// 				t.description = task.description
		// 				t.tags = task.tags
		// 				updatedTask = true
		// 				notifyBoardUpdatedListeners(board)
		// 			}
		// 		})
		// 	})
		// })

		return {
			success: updatedTask,
			message: updatedTask ? "Task updated successfully" : "Task not updated",
			value: undefined,
		}
	}

	async deleteTask(task: Task): Promise<RepositoryResponse<void>> {
		let deletedTask = false

		// boards.forEach((board) => {
		// 	board.columns.forEach((column) => {
		// 		if (column.id === task.columnId) {
		// 			column.tasks.splice(
		// 				column.tasks.findIndex((t) => t.id === task.id),
		// 				1
		// 			)
		// 			deletedTask = true
		// 			notifyBoardUpdatedListeners(board)
		// 		}
		// 	})
		// })

		return {
			success: deletedTask,
			message: deletedTask ? "Task deleted successfully" : "Task not deleted",
			value: undefined,
		}
	}
}
