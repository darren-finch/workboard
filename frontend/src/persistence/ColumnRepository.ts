import { RepositoryResponse } from "."
import Column from "../models/Column"

export class ColumnRepository {
	async addColumn(column: Column): Promise<RepositoryResponse<string>> {
		let addColumn = false

		// boards.forEach((board) => {
		// 	if (board.id === column.boardId) {
		// 		if (!column.id) {
		// 			column.id = uuid()
		// 		}

		// 		board.columns.push(column)
		// 		addColumn = true
		// 		notifyBoardUpdatedListeners(board)
		// 		notifyBoardsUpdatedListeners()
		// 	}
		// })

		return {
			success: addColumn,
			message: addColumn ? "Column added successfully" : "Column not added",
			value: column.id,
		}
	}

	async updateColumn(column: Column, updateTasks: boolean = false): Promise<RepositoryResponse<void>> {
		let updatedColumn = false

		// boards.forEach((board) => {
		// 	if (board.id === column.boardId) {
		// 		board.columns.forEach((c) => {
		// 			if (c.id === column.id) {
		// 				const columnMetaDataChanged = c.name !== column.name

		// 				c.name = column.name

		// 				if (updateTasks) {
		// 					// This is the only place where we update the tasks of a column all at once
		// 					// This will be useful for drag and drop
		// 					c.tasks = column.tasks
		// 				}

		// 				updatedColumn = true

		// 				notifyBoardUpdatedListeners(board)

		// 				if (columnMetaDataChanged) {
		// 					notifyBoardsUpdatedListeners()
		// 				}
		// 			}
		// 		})
		// 	}
		// })

		return {
			success: updatedColumn,
			message: updatedColumn ? "Column updated successfully" : "Column not updated",
			value: undefined,
		}
	}

	async deleteColumn(column: Column): Promise<RepositoryResponse<void>> {
		let deletedColumn = false

		// boards.forEach((board) => {
		// 	if (board.id === column.boardId) {
		// 		board.columns.splice(
		// 			board.columns.findIndex((c) => c.id === column.id),
		// 			1
		// 		)
		// 		deletedColumn = true
		// 		notifyBoardUpdatedListeners(board)
		// 		notifyBoardsUpdatedListeners()
		// 	}
		// })

		return {
			success: deletedColumn,
			message: deletedColumn ? "Column deleted successfully" : "Column not deleted",
			value: undefined,
		}
	}
}
