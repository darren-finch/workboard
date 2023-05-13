import { EffectCallback } from "react"
import Board from "../models/Board"
import Column from "../models/Column"
import Task from "../models/Task"
import { v4 as uuid } from "uuid"

export interface RepositoryResponse<T> {
	success: boolean
	message: string
	value: T
}

export interface BoardRepositoryListener {
	onBoardUpdated(board: Board): void
}

const boards: Board[] = []
const boardRepositoryListeners: BoardRepositoryListener[] = []

export class TaskRepository {
	// Returns the id of the added task
	async addTask(task: Task): Promise<RepositoryResponse<string>> {
		let addedTask = false

		boards.forEach((board) => {
			board.columns.forEach((column) => {
				if (column.id === task.columnId) {
					if (!task.id) {
						task.id = uuid()
					}

					column.tasks.push(task)
					addedTask = true
					boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))
				}
			})
		})

		return {
			success: addedTask,
			message: addedTask ? "Task added successfully" : "Task not added",
			value: task.id,
		}
	}

	async updateTask(task: Task): Promise<RepositoryResponse<void>> {
		let updatedTask = false

		boards.forEach((board) => {
			board.columns.forEach((column) => {
				column.tasks.forEach((t) => {
					if (t.id === task.id) {
						t.name = task.name
						t.description = task.description
						t.tags = task.tags
						updatedTask = true
						boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))
					}
				})
			})
		})

		return {
			success: updatedTask,
			message: updatedTask ? "Task updated successfully" : "Task not updated",
			value: undefined,
		}
	}

	async deleteTask(task: Task): Promise<RepositoryResponse<void>> {
		let deletedTask = false

		boards.forEach((board) => {
			board.columns.forEach((column) => {
				if (column.id === task.columnId) {
					column.tasks.splice(
						column.tasks.findIndex((t) => t.id === task.id),
						1
					)
					deletedTask = true
					boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))
				}
			})
		})

		return {
			success: deletedTask,
			message: deletedTask ? "Task deleted successfully" : "Task not deleted",
			value: undefined,
		}
	}
}

export class ColumnRepository {
	async addColumn(column: Column): Promise<RepositoryResponse<string>> {
		let addColumn = false

		boards.forEach((board) => {
			if (board.id === column.boardId) {
				if (!column.id) {
					column.id = uuid()
				}

				board.columns.push(column)
				addColumn = true
				boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))
			}
		})

		return {
			success: addColumn,
			message: addColumn ? "Column added successfully" : "Column not added",
			value: column.id,
		}
	}

	async updateColumn(column: Column): Promise<RepositoryResponse<void>> {
		let updatedColumn = false

		boards.forEach((board) => {
			if (board.id === column.boardId) {
				board.columns.forEach((c) => {
					if (c.id === column.id) {
						c.name = column.name

						// This is the only place where we update the tasks of a column all at once
						// This will be useful for drag and drop
						c.tasks = column.tasks

						updatedColumn = true
						boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))
					}
				})
			}
		})

		return {
			success: updatedColumn,
			message: updatedColumn ? "Column updated successfully" : "Column not updated",
			value: undefined,
		}
	}

	async deleteColumn(id: string): Promise<RepositoryResponse<void>> {
		let deletedColumn = false

		boards.forEach((board) => {
			board.columns.splice(
				board.columns.findIndex((c) => c.id === id),
				1
			)
			deletedColumn = true
		})

		return {
			success: deletedColumn,
			message: deletedColumn ? "Column deleted successfully" : "Column not deleted",
			value: undefined,
		}
	}
}

export class BoardRepository {
	onBoardUpdated(listener: (board: Board) => void): () => void {
		boardRepositoryListeners.push({
			onBoardUpdated: listener,
		})

		return () => {
			boardRepositoryListeners.splice(
				boardRepositoryListeners.findIndex((l) => l.onBoardUpdated === listener),
				1
			)
		}
	}

	async getBoard(boardId: string): Promise<RepositoryResponse<Board | undefined>> {
		const board = boards.find((b) => b.id === boardId)

		return {
			success: !!board,
			message: board ? "Board found" : "Board not found",
			value: board,
		}
	}

	async createBoard(board: Board): Promise<RepositoryResponse<string>> {
		if (!board.id) board.id = uuid()

		boards.push(board)

		return {
			success: true,
			message: "Board created successfully",
			value: board.id,
		}
	}

	async updateBoard(board: Board): Promise<RepositoryResponse<void>> {
		const index = boards.findIndex((b) => b.id === board.id)
		boards[index].name = board.name
		boardRepositoryListeners.forEach((l) => l.onBoardUpdated(board))

		return {
			success: true,
			message: "Board updated successfully",
			value: undefined,
		}
	}

	async deleteBoard(id: string): Promise<RepositoryResponse<void>> {
		boards.splice(
			boards.findIndex((b) => b.id === id),
			1
		)

		return {
			success: true,
			message: "Board deleted successfully",
			value: undefined,
		}
	}
}

export const boardRepository = new BoardRepository()
export const columnRepository = new ColumnRepository()
export const taskRepository = new TaskRepository()
