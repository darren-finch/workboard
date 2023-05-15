import Column from "./Column"

export default class Board {
	id: number
	name: string
	columns: Column[]

	constructor(id: number, name: string, columns: Column[]) {
		this.id = id
		this.name = name
		this.columns = columns
	}
}
