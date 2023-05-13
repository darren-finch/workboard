import Column from "./Column"

export default class Board {
	id: string
	name: string
	columns: Column[]

	constructor(id: string, name: string, columns: Column[]) {
		this.id = id
		this.name = name
		this.columns = columns
	}
}
