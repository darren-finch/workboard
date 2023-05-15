import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr"
import axios from "axios"
import BoardRepository from "./BoardRepository"
import { ColumnRepository } from "./ColumnRepository"
import { TaskRepository } from "./TaskRepository"

const boardHubConnection = new HubConnectionBuilder()
	.withUrl(process.env.REACT_APP_SIGNALR_SERVER_URL + "/boardHub", {
		skipNegotiation: true,
		transport: HttpTransportType.WebSockets,
	})
	.build()

boardHubConnection.start().catch((err) => console.error(err.toString()))

const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_REST_API_SERVER_URL, timeout: 10000 })

export interface RepositoryResponse<T> {
	success: boolean
	message: string
	value: T
}

export interface Unsubscribe {
	(): void
}

export const boardRepository = new BoardRepository(boardHubConnection, axiosInstance)
export const columnRepository = new ColumnRepository()
export const taskRepository = new TaskRepository()
