import { HubConnection } from "@microsoft/signalr"
import { RepositoryResponse } from "./Interfaces"
import Task from "../models/Task"

export class TaskRepository {
	private readonly hubConnection: HubConnection

	constructor(hubConnection: HubConnection) {
		this.hubConnection = hubConnection
	}

	// Returns the id of the added task
	async createTask(task: Task): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("CreateTask", task)
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

	async updateTask(task: Task): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("UpdateTask", task)
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

	async deleteTask(taskId: number): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("DeleteTask", taskId)
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
}
