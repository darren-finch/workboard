import { HubConnection } from "@microsoft/signalr"
import { RepositoryResponse } from "."
import Column from "../models/Column"

export class ColumnRepository {
	private readonly hubConnection: HubConnection

	constructor(hubConnection: HubConnection) {
		this.hubConnection = hubConnection
	}

	async createColumn(column: Column): Promise<RepositoryResponse<number>> {
		let success = false
		let message = ""
		let id = -1

		try {
			id = await this.hubConnection.invoke("CreateColumn", column)
		} catch (err: any) {
			success = false
			message = err.message
		}

		return {
			success: success,
			message: message,
			value: id,
		}
	}

	async updateColumn(column: Column, updateTasks: boolean = false): Promise<RepositoryResponse<void>> {
		let success = false
		let message = ""

		try {
			await this.hubConnection.invoke("UpdateColumn", column)
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

	async deleteColumn(column: Column): Promise<RepositoryResponse<void>> {
		let success = false
		let message = ""

		try {
			await this.hubConnection.invoke("DeleteColumn", column.id)
		} catch (err: any) {
			console.error(err)
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
