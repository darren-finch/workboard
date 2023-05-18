import { HubConnection } from "@microsoft/signalr"
import { RepositoryResponse } from "./Interfaces"
import Card from "../models/Card"

export class CardRepository {
	private readonly hubConnection: HubConnection

	constructor(hubConnection: HubConnection) {
		this.hubConnection = hubConnection
	}

	// Returns the id of the added card
	async createCard(card: Card): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("CreateCard", card)
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

	async updateCard(card: Card): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("UpdateCard", card)
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

	async deleteCard(cardId: number): Promise<RepositoryResponse<void>> {
		let success = true
		let message = ""

		try {
			await this.hubConnection.invoke("DeleteCard", cardId)
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
