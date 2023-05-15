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

export interface BoardUpdatedListener {
	(board: Board): void
}

export interface BoardsUpdatedListener {
	(boards: Board[]): void
}

export interface Unsubscribe {
	(): void
}

const boards: Board[] = []
const boardUpdatedListeners: BoardUpdatedListener[] = []
const boardsUpdatedListeners: BoardsUpdatedListener[] = []

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
					notifyBoardUpdatedListeners(board)
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
						notifyBoardUpdatedListeners(board)
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
					notifyBoardUpdatedListeners(board)
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
				notifyBoardUpdatedListeners(board)
				notifyBoardsUpdatedListeners()
			}
		})

		return {
			success: addColumn,
			message: addColumn ? "Column added successfully" : "Column not added",
			value: column.id,
		}
	}

	async updateColumn(column: Column, updateTasks: boolean = false): Promise<RepositoryResponse<void>> {
		let updatedColumn = false

		boards.forEach((board) => {
			if (board.id === column.boardId) {
				board.columns.forEach((c) => {
					if (c.id === column.id) {
						const columnMetaDataChanged = c.name !== column.name

						c.name = column.name

						if (updateTasks) {
							// This is the only place where we update the tasks of a column all at once
							// This will be useful for drag and drop
							c.tasks = column.tasks
						}

						updatedColumn = true

						notifyBoardUpdatedListeners(board)

						if (columnMetaDataChanged) {
							notifyBoardsUpdatedListeners()
						}
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

	async deleteColumn(column: Column): Promise<RepositoryResponse<void>> {
		let deletedColumn = false

		boards.forEach((board) => {
			if (board.id === column.boardId) {
				board.columns.splice(
					board.columns.findIndex((c) => c.id === column.id),
					1
				)
				deletedColumn = true
				notifyBoardUpdatedListeners(board)
				notifyBoardsUpdatedListeners()
			}
		})

		return {
			success: deletedColumn,
			message: deletedColumn ? "Column deleted successfully" : "Column not deleted",
			value: undefined,
		}
	}
}

let boardIdCounter = 2

export class BoardRepository {
	onBoardsUpdated(listener: BoardsUpdatedListener): Unsubscribe {
		boardsUpdatedListeners.push(listener)

		// Call the listener with the current boards
		listener([...boards])

		return () => {
			boardsUpdatedListeners.splice(
				boardsUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	onBoardUpdated(boardId: string, listener: BoardUpdatedListener): Unsubscribe {
		boardUpdatedListeners.push(listener)

		// Call the listener with the current board
		const board = boards.find((b) => b.id === boardId)
		if (board) {
			listener({ ...board })
		} else {
			throw new Error(`Board with id ${boardId} not found`)
		}

		return () => {
			boardUpdatedListeners.splice(
				boardUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	async getBoard(boardId: string, includeColumns: boolean = false): Promise<RepositoryResponse<Board | undefined>> {
		const board = boards.find((b) => b.id === boardId)
		const boardToReturn = board ? { ...board } : undefined

		if (boardToReturn && !includeColumns) {
			boardToReturn.columns = []
		}

		return {
			success: !!boardToReturn,
			message: boardToReturn ? "Board found" : "Board not found",
			value: boardToReturn,
		}
	}

	async addBoard(board: Board): Promise<RepositoryResponse<string>> {
		if (!board.id) {
			board.id = boardIdCounter.toString()
			boardIdCounter++
		}

		boards.push(board)
		notifyBoardsUpdatedListeners()

		return {
			success: true,
			message: "Board created successfully",
			value: board.id,
		}
	}

	async updateBoard(board: Board): Promise<RepositoryResponse<void>> {
		const index = boards.findIndex((b) => b.id === board.id)
		boards[index].name = board.name
		notifyBoardUpdatedListeners(boards[index])
		notifyBoardsUpdatedListeners()

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

		notifyBoardsUpdatedListeners()

		return {
			success: true,
			message: "Board deleted successfully",
			value: undefined,
		}
	}
}

// When notifying the listeners, we need to make sure we are not passing the actual objects
// but copies of them, otherwise the listeners could directly modify the objects in this mock data store.
// When the application begins using a real database, this will not be necessary anymore.

const notifyBoardUpdatedListeners = (board: Board) => {
	boardUpdatedListeners.forEach((l) => l({ ...board }))
}

// This should only be called when meta data of the board changes, like the name
// or the columns. When a task is added, updated or deleted, the boardUpdatedListeners
// should be called instead.
const notifyBoardsUpdatedListeners = () => {
	boardsUpdatedListeners.forEach((l) => l([...boards]))
}

export const boardRepository = new BoardRepository()
export const columnRepository = new ColumnRepository()
export const taskRepository = new TaskRepository()
