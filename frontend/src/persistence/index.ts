import { HttpTransportType, HubConnectionBuilder } from "@microsoft/signalr"
import axios from "axios"
import BoardRepository from "./BoardRepository"
import { ColumnRepository } from "./ColumnRepository"
import { TaskRepository } from "./TaskRepository"

export interface RepositoryResponse<T> {
	success: boolean
	message: string
	value: T
}

export interface Unsubscribe {
	(): void
}

export const taskRepository = new TaskRepository()
