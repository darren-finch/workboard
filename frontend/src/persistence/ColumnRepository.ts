import { HubConnection } from "@microsoft/signalr"
import { RepositoryResponse } from "./Interfaces"
import Column from "../models/Column"

export class ColumnRepository {
	private readonly hubConnection: HubConnection

	constructor(hubConnection: HubConnection) {
		this.hubConnection = hubConnection
	}

	async createColumn(column: Column): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("CreateColumn", column)
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

	async updateColumn(column: Column, updateCards: boolean = false): Promise<RepositoryResponse<void>> {
		let success = true
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
		let success = true
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
