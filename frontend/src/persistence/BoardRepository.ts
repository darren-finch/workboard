import { HubConnection } from "@microsoft/signalr"
import Board from "../models/Board"
import { RepositoryResponse, Unsubscribe } from "."
import { AxiosInstance } from "axios"

export interface BoardUpdatedListener {
	boardId: number
	onBoardUpdated: (board: Board) => void
}

export interface BoardsUpdatedListener {
	(boards: Board[]): void
}

class BoardRepository {
	private readonly hubConnection: HubConnection
	private readonly axiosInstance: AxiosInstance
	private readonly boardUpdatedListeners: BoardUpdatedListener[] = []
	private readonly boardsUpdatedListeners: BoardsUpdatedListener[] = []

	constructor(hubConnection: HubConnection, axiosInstance: AxiosInstance) {
		this.hubConnection = hubConnection
		this.axiosInstance = axiosInstance

		this.hubConnection.on("BoardCreated", (newBoard: Board, newBoardsList: Board[]) => {
			this.notifyBoardsUpdatedListeners(newBoardsList)
		})

		this.hubConnection.on("BoardUpdated", (updatedBoard: Board, newBoardsList: Board[]) => {
			this.notifyBoardUpdatedListeners(updatedBoard)
			this.notifyBoardsUpdatedListeners(newBoardsList)
		})

		this.hubConnection.on("BoardDeleted", (idOfDeletedBoard: number, newBoardsList: Board[]) => {
			console.log("BoardDeleted", newBoardsList)
			this.notifyBoardsUpdatedListeners(newBoardsList)
		})
	}

	onBoardsUpdated(listener: BoardsUpdatedListener): Unsubscribe {
		this.boardsUpdatedListeners.push(listener)

		// Call the listener with the current boards
		this.axiosInstance.get<Board[]>("/boards").then((res) => {
			if (res) {
				listener(res.data)
			} else {
				throw new Error("Boards not found")
			}
		})

		return () => {
			this.boardsUpdatedListeners.splice(
				this.boardsUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	onBoardUpdated(listener: BoardUpdatedListener): Unsubscribe {
		this.boardUpdatedListeners.push(listener)

		// Call the listener with the current board
		this.axiosInstance.get<Board>(`/boards/${listener.boardId}?includeColumns=true`).then((res) => {
			if (res) {
				listener.onBoardUpdated(res.data)
			} else {
				throw new Error(`Board with id ${listener.boardId} not found`)
			}
		})

		return () => {
			this.boardUpdatedListeners.splice(
				this.boardUpdatedListeners.findIndex((l) => l === listener),
				1
			)
		}
	}

	async getBoard(boardId: string, includeColumns: boolean = false): Promise<RepositoryResponse<Board | undefined>> {
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

	async createBoard(board: Board): Promise<RepositoryResponse<string>> {
		let success = true
		let message = "Board added successfully"
		let id = ""

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
			success: true,
			message: "Board updated successfully",
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

	private notifyBoardUpdatedListeners(board: Board) {
		this.boardUpdatedListeners.forEach((l) => {
			if (l.boardId === board.id) {
				l.onBoardUpdated(board)
			}
		})
	}

	// This should only be called when meta data of the board changes, like the name
	// or the columns. When a task is added, updated or deleted, the boardUpdatedListeners
	// should be called instead.
	private notifyBoardsUpdatedListeners(newBoards: Board[]) {
		this.boardsUpdatedListeners.forEach((l) => l(newBoards))
	}
}

export default BoardRepository
