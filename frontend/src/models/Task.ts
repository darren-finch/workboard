export default class Task {
	id: number
	name: string
	description: string
	tags: string[]
	columnId: number

	constructor(id: number, name: string, description: string, tags: string[], columnId: number) {
		this.id = id
		this.name = name
		this.description = description
		this.tags = tags
		this.columnId = columnId
	}
}
