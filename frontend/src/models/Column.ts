import Card from "./Card"

export default class Column {
	id: number
	name: string
	cards: Card[]
	boardId: number

	constructor(id: number, name: string, cards: Card[], boardId: number) {
		this.id = id
		this.name = name
		this.cards = cards
		this.boardId = boardId
	}
}
