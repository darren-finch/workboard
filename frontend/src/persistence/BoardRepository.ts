import { HubConnection } from "@microsoft/signalr"
import { AxiosInstance } from "axios"
import Board from "../models/Board"
import { RepositoryResponse, Unsubscribe } from "./Interfaces"

export interface BoardEventListener {
	boardId: number
	onBoardUpdated?: (board: Board) => void
	onBoardDeleted?: () => void
}

export interface BoardsListEventListener {
	(boards: Board[]): void
}

class BoardRepository {
	private readonly hubConnection: HubConnection
	private readonly axiosInstance: AxiosInstance
	private readonly boardUpdatedListeners: BoardEventListener[] = []
	private readonly boardsUpdatedListeners: BoardsListEventListener[] = []

	constructor(hubConnection: HubConnection, axiosInstance: AxiosInstance) {
		this.hubConnection = hubConnection
		this.axiosInstance = axiosInstance
	}

	init() {
		this.hubConnection.on("BoardCreated", (newBoard: Board, newBoardsList: Board[]) => {
			this.notifyBoardListEventListenersOfUpdate(newBoardsList)
		})

		this.hubConnection.on("BoardUpdated", (updatedBoard: Board, newBoardsList: Board[]) => {
			this.notifyBoardEventListenersOfUpdate(updatedBoard)
			this.notifyBoardListEventListenersOfUpdate(newBoardsList)
		})

		this.hubConnection.on("BoardDeleted", (idOfDeletedBoard: number, newBoardsList: Board[]) => {
			this.notifyBoardListEventListenersOfUpdate(newBoardsList)
		})

		const onBoardUpdated = (idOfModifiedBoard: number) => {
			this.getBoard(idOfModifiedBoard, true).then((res) => {
				if (!res.success) {
					console.error(res.message)
				}
				console.log(res.value)
				this.notifyBoardEventListenersOfUpdate(res.value)
			})
		}

		this.hubConnection.on("ColumnCreated", onBoardUpdated)
		this.hubConnection.on("ColumnUpdated", onBoardUpdated)
		this.hubConnection.on("ColumnDeleted", onBoardUpdated)
		this.hubConnection.on("CardCreated", onBoardUpdated)
		this.hubConnection.on("CardUpdated", onBoardUpdated)
		this.hubConnection.on("CardDeleted", onBoardUpdated)
	}

	addBoardsListEventListener(listener: BoardsListEventListener): Unsubscribe {
		this.boardsUpdatedListeners.push(listener)

		// Call the listener with the current boards
		this.axiosInstance
			.get<Board[]>("/boards")
			.then((res) => {
				if (res) {
					listener(res.data)
				} else {
					throw new Error("Boards not found")
				}
			})
			.catch((err) => {
				throw err
			})

		return () => {
			this.boardsUpdatedListeners.splice(
				this.boardsUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	addBoardEventListener(listener: BoardEventListener): Unsubscribe {
		this.boardUpdatedListeners.push(listener)

		return () => {
			this.boardUpdatedListeners.splice(
				this.boardUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	// async getBoards(): Promise<RepositoryResponse<Board[]>> {
	// 	let boards: Board[] = []
	// 	let success = true
	// 	let message = "Boards found"

	// 	try {
	// 		const res = await this.axiosInstance.get<Board[]>("/boards")
	// 		boards = res.data
	// 	} catch (err: any) {
	// 		success = false
	// 		message = err.message
	// 	}

	// 	return {
	// 		success: !!boards,
	// 		message: boards ? "Boards found" : "Boards not found",
	// 		value: boards,
	// 	}
	// }

	async getBoard(boardId: number, includeColumns: boolean = false): Promise<RepositoryResponse<Board | undefined>> {
		let board: Board | undefined = undefined
		let success = true
		let message = "Board found"

		try {
			const res = await this.axiosInstance.get<Board>(`/boards/${boardId}?includeColumns=${includeColumns}`)
			board = res.data
		} catch (err: any) {
			success = false
			message = err.message
		}

		return {
			success: !!board,
			message: board ? "Board found" : "Board not found",
			value: board,
		}
	}

	async createBoard(board: Board): Promise<RepositoryResponse<number>> {
		let success = true
		let message = "Board added successfully"
		let id = -1

		try {
			id = await this.hubConnection.invoke("CreateBoard", board)

			if (!id) {
				throw new Error("Board not created")
			}
		} catch (err: any) {
			success = false
			message = err.message
		}

		return {
			success,
			message,
			value: id,
		}
	}

	async updateBoard(board: Board): Promise<RepositoryResponse<void>> {
		let success = true
		let message = "Board updated successfully"

		try {
			await this.hubConnection.invoke("UpdateBoard", board)
		} catch (err: any) {
			success = false
			message = err.message
		}

		return {
			success: success,
			message: message,
			value: undefined,
		}
	}

	async deleteBoard(id: string): Promise<RepositoryResponse<void>> {
		let success = true
		let message = "Board deleted successfully"

		try {
			const idAsNum = parseInt(id)
			await this.hubConnection.invoke("DeleteBoard", idAsNum)
		} catch (err: any) {
			success = false
			message = err.message
		}

		return {
			success,
			message,
			value: undefined,
		}
	}

	private notifyBoardEventListenersOfUpdate(board: Board) {
		this.boardUpdatedListeners.forEach((l) => {
			if (l.boardId === board.id) {
				l.onBoardUpdated && l.onBoardUpdated(board)
			}
		})
	}

	private notifyBoardEventListenersOfDelete(board: Board) {
		this.boardUpdatedListeners.forEach((l) => {
			if (l.boardId === board.id) {
				l.onBoardDeleted && l.onBoardDeleted()
			}
		})
	}

	// This should only be called when meta data of the board changes, like the name
	// or the columns. When a card is added, updated or deleted, the boardUpdatedListeners
	// should be called instead.
	private notifyBoardListEventListenersOfUpdate(newBoards: Board[]) {
		this.boardsUpdatedListeners.forEach((l) => l(newBoards))
	}
}

export default BoardRepository
